export default function RoomTable({ rooms, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Détails de la salle</th>
            <th>Capacité et Type</th>
            <th>Classes assignées</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="row-card">
              <td>
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <div className="avatar-box avatar-blue">
                    <i className="fas fa-door-open"></i>
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9375rem",
                        color: "var(--text-main)",
                      }}
                    >
                      {room.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      ID Salle : #{room.id.toString().padStart(3, "0")}
                    </div>
                  </div>
                </div>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.25rem",
                  }}
                >
                  <span
                    className="badge badge-success"
                    style={{ fontWeight: 700, width: "fit-content" }}
                  >
                    {room.capacity} Places
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-muted)",
                      fontWeight: 600,
                      marginLeft: "0.5rem",
                    }}
                  >
                    {room.type || "Salle standard"}
                  </span>
                </div>
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    gap: "0.375rem",
                    flexWrap: "wrap",
                    maxWidth: "300px",
                  }}
                >
                  {room.classes && room.classes.length > 0 ? (
                    room.classes.map((r) => (
                      <span
                        key={r.id}
                        className="badge badge-warning"
                        style={{ fontSize: "0.7rem" }}
                      >
                        {r.name}
                      </span>
                    ))
                  ) : (
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                      }}
                    >
                      Non assigné
                    </span>
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                  <button
                    className="icon-btn"
                    onClick={() => onEdit(room)}
                    title="Modifier l'installation"
                    style={{ background: "var(--bg-main)" }}
                  >
                    <i
                      className="fas fa-pencil-alt"
                      style={{ fontSize: "0.875rem", color: "grey" }}
                    ></i>
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => onDelete(room.id)}
                    title="Supprimer l'installation"
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
          {rooms.length === 0 && (
            <tr>
              <td
                colSpan="4"
                style={{
                  textAlign: "center",
                  padding: "4rem",
                  color: "var(--text-muted)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <i
                    className="fas fa-building"
                    style={{ fontSize: "3rem", opacity: 0.1 }}
                  ></i>
                  <p>Aucune installation enregistrée pour le moment.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
