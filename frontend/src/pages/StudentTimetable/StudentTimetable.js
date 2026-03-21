import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./StudentTimetable.css";

const getSubjectIcon = (subjectName) => {
  if (!subjectName) return "📚";
  const name = subjectName.toLowerCase();
  if (name.includes("math")) return "🔢";
  if (
    name.includes("sci") ||
    name.includes("phys") ||
    name.includes("chem") ||
    name.includes("bio")
  )
    return "🔬";
  if (
    name.includes("eng") ||
    name.includes("arab") ||
    name.includes("fren") ||
    name.includes("lang")
  )
    return "📖";
  if (name.includes("art") || name.includes("draw")) return "🎨";
  if (name.includes("sport") || name.includes("pe")) return "⚽";
  if (name.includes("hist") || name.includes("geo")) return "🌍";
  if (name.includes("comp") || name.includes("tech") || name.includes("info"))
    return "💻";
  if (name.includes("music")) return "🎵";
  return "📚";
};

const StudentTimetable = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", new: "", confirm: "" });
  const [pwdStatus, setPwdStatus] = useState({ type: "", message: "" });
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const user_role = localStorage.getItem("user_role");

  useEffect(() => {
    if (!token || user_role !== "student") {
      navigate("/");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/student/schedules",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          "Échec de la récupération de vos emplois du temps. Veuillez vérifier votre connexion.",
        );
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [navigate, token, user_role]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
    } catch (e) {
      console.error("Logout failed:", e);
    }
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("user_email");
    navigate("/");
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdStatus({ type: "", message: "" });

    if (pwdForm.new !== pwdForm.confirm) {
      setPwdStatus({
        type: "error",
        message: "Les nouveaux mots de passe ne correspondent pas ! 😬",
      });
      return;
    }

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/change-password",
        {
          current_password: pwdForm.current,
          new_password: pwdForm.new,
          new_password_confirmation: pwdForm.confirm,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setPwdStatus({
        type: "success",
        message: "Mot de passe modifié avec succès ! 🎉",
      });
      setPwdForm({ current: "", new: "", confirm: "" });
      setTimeout(() => setShowPwdModal(false), 2000);
    } catch (err) {
      setPwdStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Échec de la modification du mot de passe. Veuillez réessayer ! 😥",
      });
    }
  };

  const allDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  if (loading) {
    return (
      <div className="st-loading-container">
        <div className="st-spinner"></div>
        <h2>Chargement de votre emploi du temps... ✨</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="st-error-container">
        <div className="st-error-icon">😥</div>
        <h2>Oups !</h2>
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="st-btn-primary"
        >
          Réessayer 🔄
        </button>
      </div>
    );
  }

  const className =
    schedules.length > 0 && schedules[0].class
      ? schedules[0].class.name
      : "Votre classe";

  return (
    <div className="st-page-wrapper">
      <header className="st-header">
        <div className="st-header-info">
          <div className="st-header-avatar">🎓</div>
          <div className="st-header-text">
            <h1>Mon emploi du temps</h1>
            <p>
              Classe : <span className="st-class-badge">{className}</span>
            </p>
          </div>
        </div>
        <div className="st-header-actions">
          <button
            onClick={() => setShowPwdModal(true)}
            className="st-btn-secondary"
          >
            🔑 Changer le mot de passe
          </button>
          <button
            onClick={handleLogout}
            className="st-btn-danger"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Déconnexion... 👋" : "Se déconnecter 🚪"}
          </button>
        </div>
      </header>

      <main className="st-grid">
        {allDays.map((day, index) => {
          const daySchedules = schedules
            .filter((s) => s.time_slot?.day === day)
            .sort((a, b) => {
              return (a.time_slot?.start_time || "").localeCompare(
                b.time_slot?.start_time || "",
              );
            });

          if (daySchedules.length === 0) return null;

          return (
            <div
              key={day}
              className="st-day-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="st-day-header">
                <h3>{day}</h3>
                <div className="st-day-decoration"></div>
              </div>
              <div className="st-schedule-list">
                {daySchedules.map((schedule, sIndex) => (
                  <div
                    key={schedule.id}
                    className="st-schedule-item"
                    style={{
                      animationDelay: `${index * 0.1 + sIndex * 0.05}s`,
                    }}
                  >
                    <div className="st-time-badge">
                      <span className="st-clock-icon">⏰</span>
                      {schedule.time_slot?.start_time.slice(0, 5)} -{" "}
                      {schedule.time_slot?.end_time.slice(0, 5)}
                    </div>
                    <div className="st-subject-row">
                      <span className="st-subject-icon">
                        {getSubjectIcon(schedule.subject?.name)}
                      </span>
                      <span className="st-subject-name">
                        {schedule.subject?.name}
                      </span>
                    </div>
                    <div className="st-details-row">
                      <div className="st-detail">
                        <i className="fas fa-chalkboard-teacher"></i>{" "}
                        {schedule.teacher?.first_name}{" "}
                        {schedule.teacher?.last_name}
                      </div>
                      <div className="st-detail">
                        <i className="fas fa-door-open"></i>{" "}
                        {schedule.room?.name}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {schedules.length === 0 && (
          <div className="st-empty-state">
            <div className="st-empty-icon">🏖️</div>
            <h3>Youpi ! Aucun cours de prévu.</h3>
            <p>Votre emploi du temps est actuellement vide. Profitez de votre temps libre !</p>
          </div>
        )}
      </main>

      {showPwdModal && (
        <div
          className="st-modal-backdrop"
          onClick={() => setShowPwdModal(false)}
        >
          <div
            className="st-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="st-modal-header">
              <h2>Changer le mot de passe 🔐</h2>
              <button
                className="st-modal-close"
                onClick={() => setShowPwdModal(false)}
              >
                ×
              </button>
            </div>

            {pwdStatus.message && (
              <div className={`st-alert st-alert-${pwdStatus.type}`}>
                {pwdStatus.message}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="st-form">
              <div className="st-input-group">
                <label>Mot de passe actuel</label>
                <input
                  type="password"
                  placeholder="Saisissez le mot de passe actuel"
                  value={pwdForm.current}
                  onChange={(e) =>
                    setPwdForm({ ...pwdForm, current: e.target.value })
                  }
                  required
                />
                <div className="st-input-focus-line"></div>
              </div>
              <div className="st-input-group">
                <label>Nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="Choisissez un mot de passe fort"
                  value={pwdForm.new}
                  onChange={(e) =>
                    setPwdForm({ ...pwdForm, new: e.target.value })
                  }
                  required
                />
                <div className="st-input-focus-line"></div>
              </div>
              <div className="st-input-group">
                <label>Confirmer le nouveau mot de passe</label>
                <input
                  type="password"
                  placeholder="Tapez-le encore une fois"
                  value={pwdForm.confirm}
                  onChange={(e) =>
                    setPwdForm({ ...pwdForm, confirm: e.target.value })
                  }
                  required
                />
                <div className="st-input-focus-line"></div>
              </div>
              <div className="st-modal-footer">
                <button
                  type="button"
                  onClick={() => setShowPwdModal(false)}
                  className="st-btn-text"
                >
                  Annuler
                </button>
                <button type="submit" className="st-btn-primary">
                  Enregistrer le mot de passe 🚀
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTimetable;
