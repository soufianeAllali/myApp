import { useState, useEffect } from "react";
import axios from "axios";

export default function Schedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8000/api/schedules");
      setSchedules(res.data);
      setError(null);
    } catch (err) {
      setError("Échec de la récupération des emplois du temps. Veuillez vous assurer que le serveur backend est accessible.");
    } finally {
      setLoading(false);
    }
  };

  const generateTimetable = async () => {
    try {
      setGenerating(true);
      await axios.post("http://localhost:8000/api/schedules/generate");
      await fetchSchedules();
      setError(null);
    } catch (err) {
      setError("La génération de l'emploi du temps a échoué. Veuillez vérifier les disponibilités des professeurs et les contraintes des salles.");
    } finally {
      setGenerating(false);
    }
  };

  const schedulesByClass = schedules.reduce((acc, s) => {
    const className = s.class?.name || "Groupes non assignés";
    if (!acc[className]) acc[className] = [];
    acc[className].push(s);
    return acc;
  }, {});

  return (
    <div className="schedules-page">
      <div className="page-header">
        <div>
          <h1>Emploi du temps principal</h1>
          <p>Planification automatisée des emplois du temps académiques et aperçu de la répartition des classes.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={generateTimetable} 
          disabled={generating}
          style={{ padding: '0.875rem 2.5rem',width:'340px' }}
        >
          {generating ? (
            <><div className="loader" style={{ width: '18px', height: '18px', borderThickness: '2px', marginRight: '0.75rem' }}></div> Calcul en cours...</>
          ) : (
            <><i className="fas fa-wand-magic-sparkles" style={{ marginRight: '0.75rem' }}></i> Générer l'emploi du temps</>
          )}
        </button>
      </div>

      {error && (
        <div style={{ 
          background: 'var(--danger-light)', 
          color: 'var(--danger)', 
          padding: '1.25rem 1.5rem', 
          borderRadius: 'var(--radius-lg)', 
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div className="avatar-box" style={{ background: 'white', color: 'var(--danger)' }}>
            <i className="fas fa-circle-exclamation" style={{ fontSize: '1.25rem' }}></i>
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>Logique conflictuelle détectée</div>
            <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.8 }}>{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '400px', gap: '1.5rem' }}>
          <div className="loader"></div>
          <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Assemblage de votre calendrier académique...</p>
        </div>
      ) : Object.keys(schedulesByClass).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'var(--bg-sidebar)', borderRadius: '2rem', border: '2px dashed var(--border-color)', margin: '0 2rem' }}>
          <div className="avatar-box avatar-blue" style={{ width: '80px', height: '80px', borderRadius: '24px', margin: '0 auto 2rem' }}>
            <i className="fas fa-calendar-plus" style={{ fontSize: '2.5rem' }}></i>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Prêt à planifier ?</h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>Aucun emploi du temps n'a été généré pour le trimestre en cours. Cliquez sur le bouton de génération ci-dessus pour cartographier automatiquement les professeurs, les salles et les matières.</p>
          <button className="btn btn-outline" onClick={generateTimetable}>Initialiser le moteur de planification</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3.5rem' }}>
          {Object.keys(schedulesByClass).sort().map((className) => (
            <div key={className}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', paddingLeft: '1rem' }}>
                 <div style={{ width: '8px', height: '24px', background: 'var(--primary)', borderRadius: '4px' }}></div>
                 <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{className} <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: '0.875rem', marginLeft: '0.5rem' }}>/ {schedulesByClass[className].length} sessions hebdomadaires</span></h3>
              </div>

              <div className="table-section">
                <div style={{ overflowX: 'auto' }}>
                  <table className="modern-table">
                    <thead>
                      <tr>
                        <th>Créneau horaire</th>
                        <th>Matière</th>
                        <th>Professeur</th>
                        <th>Lieu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schedulesByClass[className].sort((a, b) => {
                        const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                        if (a.time_slot?.day !== b.time_slot?.day) {
                          return dayOrder.indexOf(a.time_slot?.day) - dayOrder.indexOf(b.time_slot?.day);
                        }
                        return (a.time_slot?.start_time || "").localeCompare(b.time_slot?.start_time || "");
                      }).map((s) => (
                        <tr key={s.id} className="row-card">
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                               <div className="avatar-box avatar-blue" style={{ width: '32px', height: '32px', borderRadius: '8px' }}>
                                  <i className="fas fa-clock" style={{ fontSize: '0.875rem' }}></i>
                               </div>
                               <div>
                                  <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{s.time_slot?.day || "-"}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                                    {s.time_slot?.start_time?.slice(0, 5) || "-"} — {s.time_slot?.end_time?.slice(0, 5) || "-"}
                                  </div>
                               </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem', fontWeight: 700 }}>
                              {s.subject?.name || "-"}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                               <div className="avatar-box avatar-green" style={{ width: '28px', height: '28px', borderRadius: '50%', fontSize: '0.7rem' }}>
                                  {s.teacher?.first_name?.charAt(0)}{s.teacher?.last_name?.charAt(0)}
                               </div>
                               <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-main)' }}>{s.teacher ? `${s.teacher.first_name} ${s.teacher.last_name}` : "-"}</span>
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
                              <i className="fas fa-location-dot" style={{ color: 'var(--danger)' }}></i>
                              {s.room?.name || "-"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}