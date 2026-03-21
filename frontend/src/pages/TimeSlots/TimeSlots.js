import { useState, useEffect } from "react";
import axios from "axios";
import TimeSlotForm from "./TimeSlotForm";

export default function TimeSlots() {
  const [timeSlots, setTimeSlots] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [apiErrors, setApiErrors] = useState({});

  const [formData, setFormData] = useState({
    day: "",
    start_time: "",
    end_time: "",
  });

  useEffect(() => {
    fetchTimeSlots();
    fetchTeachers();
  }, []);

  const fetchTimeSlots = () => {
    axios
      .get("http://localhost:8000/api/time_slots")
      .then((res) => setTimeSlots(res.data))
      .catch((err) => console.error("Fetch TimeSlots Error:", err));
  };

  const fetchTeachers = () => {
    axios
      .get("http://localhost:8000/api/teachers_with_availabilities")
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Fetch Teachers Error:", err));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let errors = {};

    if (!formData.day.trim()) errors.day = "Le jour est requis";
    if (!formData.start_time)
      errors.start_time = "L'heure de début est requise";
    if (!formData.end_time) errors.end_time = "L'heure de fin est requise";

    if (
      formData.start_time &&
      formData.end_time &&
      formData.end_time <= formData.start_time
    ) {
      errors.end_time = "L'heure de fin doit être après l'heure de début";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setApiErrors({});

    if (!validateForm()) return;

    const payload = {
      day: formData.day.trim(),
      start_time: formData.start_time,
      end_time: formData.end_time,
    };

    const request = editingId
      ? axios.put(`http://localhost:8000/api/time_slots/${editingId}`, payload)
      : axios.post("http://localhost:8000/api/time_slots", payload);

    request
      .then(() => {
        fetchTimeSlots();
        resetForm();
      })
      .catch((err) => {
        if (err.response && err.response.status === 422) {
          setApiErrors(err.response.data.errors || {});
        } else {
          console.error("API Error:", err);
        }
      });
  };

  const handleEdit = (slot) => {
    setEditingId(slot.id);
    setFormData({
      day: slot.day,
      start_time: slot.start_time,
      end_time: slot.end_time,
    });
    setShowForm(true);
    setFormErrors({});
    setApiErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Êtes-vous sûr de vouloir supprimer ce créneau horaire ? Cela peut affecter les emplois du temps existants.",
      )
    ) {
      axios
        .delete(`http://localhost:8000/api/time_slots/${id}`)
        .then(() => setTimeSlots(timeSlots.filter((t) => t.id !== id)))
        .catch((err) => console.error("Delete Error:", err));
    }
  };

  const resetForm = () => {
    setFormData({ day: "", start_time: "", end_time: "" });
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
    setApiErrors({});
  };

  const toggleAvailability = async (teacherId, slotId) => {
    setTeachers((prev) =>
      prev.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;

        const existing = teacher.availabilities.find(
          (a) => a.time_slot_id === slotId,
        );

        if (existing) {
          return {
            ...teacher,
            availabilities: teacher.availabilities.map((a) =>
              a.time_slot_id === slotId
                ? { ...a, is_available: !a.is_available }
                : a,
            ),
          };
        } else {
          return {
            ...teacher,
            availabilities: [
              ...teacher.availabilities,
              {
                time_slot_id: slotId,
                is_available: true,
              },
            ],
          };
        }
      }),
    );

    try {
      await axios.post(
        "http://localhost:8000/api/teacher_availabilities/toggle",
        {
          teacher_id: teacherId,
          time_slot_id: slotId,
        },
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="timeslots-page">
      <div className="page-header">
        <div>
          <h1>Planification et Disponibilité</h1>
          <p>
            Définissez les créneaux horaires de l'établissement et gérez la
            matrice de disponibilité du corps professoral.
          </p>
        </div>
        <button
          className={`btn ${showForm ? "btn-outline" : "btn-primary"}`}
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          style={{width:'220px'}}
        >
          <i className={showForm ? "fas fa-times" : "fas fa-clock"}></i>
          {showForm ? "Annuler" : "Ajouter un créneau"}
        </button>
      </div>

      {showForm && (
        <div
          style={{
            marginBottom: "3rem",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TimeSlotForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            formErrors={formErrors}
            apiErrors={apiErrors}
          />
        </div>
      )}

      <div className="table-section" style={{ marginBottom: "3rem" }}>
        <div className="table-header">
          <h3>Créneaux horaires définis</h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Jour de fonctionnement</th>
                <th>Heures de travail</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot) => (
                <tr key={slot.id} className="row-card">
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        className="avatar-box avatar-blue"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="fas fa-calendar-day"></i>
                      </div>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: "var(--text-main)",
                        }}
                      >
                        {slot.day}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <span
                        className="badge badge-primary"
                        style={{ padding: "0.4rem 0.75rem" }}
                      >
                        {slot.start_time.slice(0, 5)}
                      </span>
                      <i
                        className="fas fa-long-arrow-alt-right"
                        style={{ color: "var(--text-muted)" }}
                      ></i>
                      <span
                        className="badge badge-primary"
                        style={{ padding: "0.4rem 0.75rem" }}
                      >
                        {slot.end_time.slice(0, 5)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        className="icon-btn"
                        onClick={() => handleEdit(slot)}
                        title="Modifier le créneau"
                        style={{ background: "var(--bg-main)" }}
                      >
                        <i
                          className="fas fa-pencil-alt"
                          style={{ fontSize: "0.875rem", color: "grey" }}
                        ></i>
                      </button>
                      <button
                        className="icon-btn"
                        onClick={() => handleDelete(slot.id)}
                        title="Supprimer le créneau"
                        style={{
                          color: "var(--danger)",
                          background: "var(--danger-light)",
                        }}
                      >
                        <i
                          className="fas fa-trash-alt"
                          style={{ fontSize: "0.875rem" }}
                        ></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="table-section">
        <div className="table-header">
          <div>
            <h3>Matrice de disponibilité des professeurs</h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                margin: 0,
              }}
            >
              Cliquez sur une cellule pour basculer la disponibilité pour le
              créneau horaire spécifique.
            </p>
          </div>
        </div>
        <div style={{ overflowX: "auto", padding: "0 2rem 2rem" }}>
          <table className="matrix-table">
            <thead>
              <tr>
                <th
                  style={{
                    minWidth: "180px",
                    padding: "1rem",
                    background: "transparent",
                    textAlign: "left",
                    fontSize: "0.875rem",
                    fontWeight: 800,
                  }}
                >
                  Membre du corps professoral
                </th>
                {timeSlots.map((slot) => (
                  <th
                    key={slot.id}
                    style={{
                      textAlign: "center",
                      minWidth: "80px",
                      padding: "0.75rem",
                      background: "var(--bg-main)",
                      borderRadius: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {slot.day}
                    </div>
                    <div
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "var(--text-muted)",
                      }}
                    >
                      {slot.start_time.slice(0, 5)}-{slot.end_time.slice(0, 5)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td style={{ padding: "1rem", background: "transparent" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      <div
                        className="avatar-box avatar-green"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                        }}
                      >
                        {teacher.first_name.charAt(0)}
                        {teacher.last_name.charAt(0)}
                      </div>
                      <span style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                        {teacher.first_name} {teacher.last_name}
                      </span>
                    </div>
                  </td>
                  {timeSlots.map((slot) => {
                    const availability = teacher.availabilities.find(
                      (a) => a.time_slot_id === slot.id,
                    );
                    const isAvailable = availability
                      ? Boolean(availability.is_available)
                      : false;
                    return (
                      <td key={slot.id} style={{ padding: "4px" }}>
                        <div
                          onClick={() =>
                            toggleAvailability(teacher.id, slot.id)
                          }
                          className={
                            isAvailable
                              ? "matrix-cell available"
                              : "matrix-cell unavailable"
                          }
                          title={`${teacher.first_name}: ${isAvailable ? "Disponible" : "Indisponible"} à ${slot.day} ${slot.start_time.slice(0, 5)}`}
                        >
                          <i
                            className={
                              isAvailable ? "fas fa-check" : "fas fa-times"
                            }
                            style={{
                              fontSize: "0.75rem",
                              opacity: isAvailable ? 1 : 0.3,
                            }}
                          ></i>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
