import { useState, useEffect, useRef } from "react";
import "./Voix.css";

const SpeechForm = () => {
  const [mode, setMode] = useState(null);
  const [recording, setRecording] = useState(false);
  const [speechText, setSpeechText] = useState("");
  const [formData, setFormData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [systemMessage, setSystemMessage] = useState(null);
  const [classes, setClasses] = useState([]);
  const [subjectsList, setSubjectsList] = useState([]);

  const recognitionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clsRes, subRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/classes"),
          fetch("http://127.0.0.1:8000/api/subjects"),
        ]);
        if (clsRes.ok) setClasses(await clsRes.json());
        if (subRes.ok) setSubjectsList(await subRes.json());
      } catch (err) {
        console.error("Error fetching dependencies", err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setSystemMessage({
        text: "Votre navigateur ne supporte pas la reconnaissance vocale.",
        type: "error",
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + " ";
        }
      }

      if (finalTranscript) {
        setSpeechText((prev) => prev + finalTranscript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Erreur de reconnaissance vocale:", event.error);
      if (event.error === "no-speech") {
      } else {
        setRecording(false);
        setSystemMessage({
          text: "Erreur d'écoute, veuillez réessayer.",
          type: "error",
        });
      }
    };

    recognition.onend = () => {
      if (recording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (recording && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn("Recognition already started");
      }
    } else if (!recording && recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, [recording]);

  const handleStartRecording = () => {
    if (!mode) {
      setSystemMessage({
        text: "❌ Veuillez sélectionner un mode (Élève ou Professeur) avant de parler.",
        type: "error",
      });
      return;
    }
    setFormData(null);
    setSpeechText("");
    setRecording(true);
    setSystemMessage({
      text: "Veuillez fournir les informations. Suivez le format affiché et appuyez sur Stop quand vous avez terminé.",
      type: "info",
    });
  };

  const handleStopRecording = async () => {
    setRecording(false);
    if (!speechText.trim()) {
      setSystemMessage({
        text: "Aucun texte reconnu. Veuillez réessayer.",
        type: "error",
      });
      return;
    }

    await processSpeechWithAI(speechText);
  };

  const processSpeechWithAI = async (text) => {
    setIsProcessing(true);
    setSystemMessage(null);

    const aiPrompt = `
Extract structured JSON from the user's speech.

For Student:
- firstName
- lastName
- email
- phone
- class
- birthDate (YYYY-MM-DD)

For Teacher:
- firstName
- lastName
- email
- phone
- subjects (convert spoken lists into an array of strings, or comma-separated string)

Rules:
- Convert 'arobas' to '@'
- Convert spoken dates like '2005 03 15' into '2005-03-15'
- Return ONLY valid JSON
    `;

    try {
      const response = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [
              {
                role: "system",
                content:
                  aiPrompt +
                  "\nOutput strictly as JSON and nothing else, no markdown fences.",
              },
              { role: "user", content: `Mode: ${mode}\nSpeech: ${text}` },
            ],
          }),
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API call failed:", response.status, errorText);
        throw new Error("API call failed");
      }

      const data = await response.json();
      let rawContent = data.choices[0].message.content;
      rawContent = rawContent
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
      const extractedJSON = JSON.parse(rawContent);

      let initialForm = {};

      let matchedClassId = "";
      if (mode === "student" && extractedJSON.class) {
        const spokenClass = extractedJSON.class.toLowerCase();
        const found = classes.find(
          (c) =>
            c.name.toLowerCase().includes(spokenClass) ||
            spokenClass.includes(c.name.toLowerCase()),
        );
        if (found) matchedClassId = found.id;
      }

      let matchedSubjects = [];
      if (mode === "teacher" && extractedJSON.subjects) {
        const spokenSubs = Array.isArray(extractedJSON.subjects)
          ? extractedJSON.subjects
          : extractedJSON.subjects.split(",");
        spokenSubs.forEach((s) => {
          const sLower = s.trim().toLowerCase();
          const found = subjectsList.find(
            (sub) =>
              sub.name.toLowerCase().includes(sLower) ||
              sLower.includes(sub.name.toLowerCase()),
          );
          if (found && !matchedSubjects.includes(found.id))
            matchedSubjects.push(found.id);
        });
      }

      if (mode === "student") {
        initialForm = {
          first_name: extractedJSON.firstName || "",
          last_name: extractedJSON.lastName || "",
          email: extractedJSON.email || "",
          phone: extractedJSON.phone || "",
          class_id: matchedClassId,
          birth_date: extractedJSON.birthDate || "",
        };
      } else {
        initialForm = {
          first_name: extractedJSON.firstName || "",
          last_name: extractedJSON.lastName || "",
          email: extractedJSON.email || "",
          phone: extractedJSON.phone || "",
          subjects: matchedSubjects,
        };
      }

      setFormData(initialForm);
      setSystemMessage({
        text: "✅ Données extraites avec succès. Vous pouvez les vérifier et les modifier ci-dessous avant de valider.",
        type: "success",
      });
    } catch (err) {
      console.error(err);
      setSystemMessage({
        text: "❌ Erreur lors de l'extraction par l'IA. Veuillez vérifier votre clé API ou réessayer.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setSystemMessage({ text: "Enregistrement en cours...", type: "info" });

    const endpoint = mode === "student" ? "/api/students" : "/api/teachers";

    try {
      const submitData = { ...formData };
      if (mode === "teacher") {
        if (typeof submitData.subjects === "string") {
          submitData.subjects = submitData.subjects
            .split(",")
            .map((s) => s.trim());
        }
      }

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        console.error("API Error", errData);
        throw new Error(errData.message || "Failed to interact with API");
      }

      setSystemMessage({
        text: `🎉 ${mode === "student" ? "Élève" : "Professeur"} ajouté avec succès !`,
        type: "success",
      });
      setFormData(null);
      setSpeechText("");
      setMode(null);
    } catch (err) {
      console.error(err);
      setSystemMessage({
        text: "❌ Erreur lors de la soumission à l'API.",
        type: "error",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="voix-container">
      <div className="voix-header">
        <h2>🎙️ Assistant Vocal IA</h2>
        <p>
          Ajoutez rapidement un élève ou un professeur par reconnaissance
          vocale.
        </p>
      </div>

      <div className="voix-actions">
        <button
          className={`btn-mode ${mode === "student" ? "active" : ""}`}
          onClick={() => {
            setMode("student");
            setFormData(null);
            setSpeechText("");
          }}
        >
          <i className="fas fa-user-graduate"></i> Ajouter un Élève
        </button>
        <button
          className={`btn-mode ${mode === "teacher" ? "active" : ""}`}
          onClick={() => {
            setMode("teacher");
            setFormData(null);
            setSpeechText("");
          }}
        >
          <i className="fas fa-chalkboard-teacher"></i> Ajouter un Professeur
        </button>
      </div>

      {mode && (
        <div className="voix-helper animate-fade-in">
          <h4>📌 Format attendu :</h4>
          {mode === "student" ? (
            <p>
              "prenom said nom sfriwi email said@gmail.com telephone 0612345678
              class 3A date de naissance 2005 03 15"
            </p>
          ) : (
            <p>
              "prenom said nom sfriwi email said@gmail.com telephone 0612345678
              subjects Math, Physics"
            </p>
          )}
        </div>
      )}

      {systemMessage && (
        <div className={`system-message-box ${systemMessage.type || "info"}`}>
          {systemMessage.text}
        </div>
      )}

      <div
        className={`voix-recording-section ${recording ? "is-recording" : ""}`}
      >
        {!recording ? (
          <button className="btn-record start" onClick={handleStartRecording}>
            <i className="fas fa-microphone"></i> Démarrer l'enregistrement
          </button>
        ) : (
          <button className="btn-record stop" onClick={handleStopRecording}>
            <i className="fas fa-stop-circle"></i> Arrêter l'enregistrement
          </button>
        )}

        <div className="speech-output">
          {speechText ? (
            speechText
          ) : (
            <span className="empty-text">Votre texte apparaîtra ici...</span>
          )}
        </div>
      </div>

      {isProcessing && !formData && (
        <div className="ai-status">
          <div className="ai-spinner-container">
            <i className="fas fa-circle-notch fa-spin"></i>
          </div>
          <span>Traitement par l'IA Llama en cours...</span>
        </div>
      )}

      {formData && (
        <div className="voix-form-section animate-slide-up">
          <h3>
            <i className="fas fa-check-circle text-blue-500"></i> Vérification
            des Données
          </h3>
          <div className="voix-grid">
            <div className="voix-input-group">
              <label>Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="voix-input-group">
              <label>Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="voix-input-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email || ""}
                onChange={handleInputChange}
              />
            </div>
            <div className="voix-input-group">
              <label>Téléphone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ""}
                onChange={handleInputChange}
              />
            </div>

            {mode === "student" ? (
              <>
                <div className="voix-input-group">
                  <label>Classe</label>
                  <select
                    name="class_id"
                    value={formData.class_id || ""}
                    onChange={handleInputChange}
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="voix-input-group">
                  <label>Date de Naissance</label>
                  <input
                    type="date"
                    name="birth_date"
                    value={formData.birth_date || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <div className="voix-input-group">
                <label>Matières</label>
                <select
                  multiple
                  name="subjects"
                  value={formData.subjects || []}
                  onChange={(e) => {
                    const selected = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value,
                    );
                    setFormData((prev) => ({ ...prev, subjects: selected }));
                  }}
                  style={{ height: "120px" }}
                >
                  {subjectsList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="voix-submit">
            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Validation...
                </>
              ) : (
                "Valider & Ajouter"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpeechForm;
