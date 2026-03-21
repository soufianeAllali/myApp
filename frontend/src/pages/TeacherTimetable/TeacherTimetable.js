import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./TeacherTimetable.css";

const TeacherTimetable = () => {
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
    if (!token || user_role !== "teacher") {
      navigate("/");
      return;
    }

    const fetchSchedules = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/teacher/schedules",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setSchedules(response.data);
        setLoading(false);
      } catch (err) {
        setError(
          "Échec de la récupération sécurisée des données de l'emploi du temps. Veuillez vérifier votre connexion.",
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
      console.error("Logout error:", e);
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
        message: "La confirmation du nouveau mot de passe ne correspond pas.",
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
        message: "Identifiants mis à jour avec succès.",
      });
      setPwdForm({ current: "", new: "", confirm: "" });
      setTimeout(() => setShowPwdModal(false), 2000);
    } catch (err) {
      setPwdStatus({
        type: "error",
        message:
          err.response?.data?.message ||
          "Erreur d'authentification. Le mot de passe n'a pas été modifié.",
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
      <div className="tt-page-wrapper">
        <div className="tt-loader-container">
          <div className="tt-structured-spinner"></div>
          <p>Synchronisation des données du corps professoral...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tt-page-wrapper">
        <div className="tt-alert-container">
          <i className="fas fa-exclamation-triangle tt-alert-icon"></i>
          <h3>Alerte système</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="tt-btn-primary"
          >
            Réessayer la connexion
          </button>
        </div>
      </div>
    );
  }

  const teacherName =
    schedules.length > 0 && schedules[0].teacher
      ? `Prof. ${schedules[0].teacher.last_name} ${schedules[0].teacher.first_name}`
      : "Profil du professeur";

  return (
    <div className="tt-page-wrapper">
      <header className="tt-header">
        <div className="tt-header-left">
          <div className="tt-header-icon">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="tt-header-text">
            <h1>Emploi du temps du professeur</h1>
            <p>
              Utilisateur : <span>{teacherName}</span>
            </p>
          </div>
        </div>
        <div className="tt-header-right">
          <button
            onClick={() => setShowPwdModal(true)}
            className="tt-btn-outline"
          >
            <i className="fas fa-shield-alt"></i> Sécurité
          </button>
          <button
            onClick={handleLogout}
            className="tt-btn-danger"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Déconnexion...
              </>
            ) : (
              <>
                <i className="fas fa-sign-out-alt"></i> Se déconnecter
              </>
            )}
          </button>
        </div>
      </header>

      <main className="tt-grid">
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
              className="tt-day-card"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="tt-day-header">
                <h3>{day}</h3>
                <span className="tt-count-badge">
                  {daySchedules.length} Sessions
                </span>
              </div>
              <div className="tt-schedule-wrapper">
                {daySchedules.map((schedule, sIndex) => (
                  <div
                    key={schedule.id}
                    className="tt-schedule-block"
                    style={{
                      animationDelay: `${index * 0.05 + sIndex * 0.05}s`,
                    }}
                  >
                    <div className="tt-time-strip">
                      <span>
                        ⏰ {schedule.time_slot?.start_time.slice(0, 5)}
                      </span>
                      <span className="tt-time-separator"></span>
                      <span>{schedule.time_slot?.end_time.slice(0, 5)}</span>
                    </div>
                    <div className="tt-schedule-content">
                      <h4 className="tt-subject-title">
                        {schedule.subject?.name}
                      </h4>
                      <div className="tt-info-grid">
                        <div className="tt-info-item">
                          <span className="tt-icon-box">👥</span>
                          <div className="tt-info-text">
                            <span className="tt-info-label">Groupe cible</span>
                            <span className="tt-info-value">
                              {schedule.class?.name}
                            </span>
                          </div>
                        </div>
                        <div className="tt-info-item">
                          <span className="tt-icon-box">🏫</span>
                          <div className="tt-info-text">
                            <span className="tt-info-label">Lieu</span>
                            <span className="tt-info-value">
                              {schedule.room?.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {schedules.length === 0 && (
          <div className="tt-empty-state">
            <i className="fas fa-calendar-check"></i>
            <h3>Aucune session planifiée</h3>
            <p>
              Votre emploi du temps pédagogique institutionnel est actuellement vide.
            </p>
          </div>
        )}
      </main>

      {showPwdModal && (
        <div
          className="tt-modal-overlay"
          onClick={() => setShowPwdModal(false)}
        >
          <div className="tt-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="tt-modal-header">
              <h2>Paramètres de sécurité</h2>
              <button
                className="tt-close-btn"
                onClick={() => setShowPwdModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="tt-modal-body">
              <p className="tt-modal-desc">
                Configurez vos identifiants d'accès au compte ci-dessous. Nécessite la vérification du mot de passe actuel.
              </p>

              {pwdStatus.message && (
                <div className={`tt-alert tt-alert-${pwdStatus.type}`}>
                  <i
                    className={
                      pwdStatus.type === "success"
                        ? "fas fa-check-circle"
                        : "fas fa-exclamation-circle"
                    }
                  ></i>
                  <span>{pwdStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword}>
                <div className="tt-form-group">
                  <label>Clé d'autorisation actuelle</label>
                  <div className="tt-input-wrapper">
                    <i className="fas fa-lock tt-input-icon"></i>
                    <input
                      type="password"
                      value={pwdForm.current}
                      onChange={(e) =>
                        setPwdForm({ ...pwdForm, current: e.target.value })
                      }
                      required
                      style={{paddingLeft:'40px'}}
                    />
                  </div>
                </div>
                <div className="tt-form-group">
                  <label>Nouvelle clé d'autorisation</label>
                  <div className="tt-input-wrapper">
                    <i className="fas fa-key tt-input-icon"></i>
                    <input
                      type="password"
                      value={pwdForm.new}
                      onChange={(e) =>
                        setPwdForm({ ...pwdForm, new: e.target.value })
                      }
                      required
                      style={{paddingLeft:'40px'}}
                    />
                  </div>
                </div>
                <div className="tt-form-group">
                  <label>Vérifier la nouvelle clé</label>
                  <div className="tt-input-wrapper">
                    <i className="fas fa-check-double tt-input-icon"></i>
                    <input
                      type="password"
                      value={pwdForm.confirm}
                      onChange={(e) =>
                        setPwdForm({ ...pwdForm, confirm: e.target.value })
                      }
                      required
                      style={{paddingLeft:'40px'}}
                    />
                  </div>
                </div>

                <div className="tt-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowPwdModal(false)}
                    className="tt-btn-ghost"
                  >
                    Annuler l'opération
                  </button>
                  <button type="submit" className="tt-btn-primary">
                    Exécuter la modification
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherTimetable;
