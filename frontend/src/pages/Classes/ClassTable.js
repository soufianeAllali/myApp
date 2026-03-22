export default function ClassTable({ classes, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Informations sur la classe</th>
            <th>Niveau / Filière</th>
            <th>Matières</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cl) => (
              <tr key={cl.id} className="row-card">
                <td>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <div className="avatar-box avatar-orange">
                      {cl.name
                        .split(" ")
                        .map((s) => s.charAt(0))
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: "var(--text-main)",
                        }}
                      >
                        {cl.name}
                      </div>
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "var(--text-muted)",
                        }}
                      >
                        ID Classe : #{cl.id.toString().padStart(3, "0")}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className="badge badge-warning"
                    style={{ fontWeight: 700 }}
                  >
                    {cl.level}
                  </span>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.375rem",
                      flexWrap: "wrap",
                      maxWidth: "400px",
                    }}
                  >
                    {cl.subjects &&
                      cl.subjects.map((s) => (
                        <span
                          key={s.id}
                          className="badge badge-primary"
                          style={{ fontSize: "0.7rem" }}
                        >
                          {s.name}{" "}
                          <span style={{ opacity: 0.7, marginLeft: "0.25rem" }}>
                            {s.pivot.hours_per_week}h
                          </span>
                        </span>
                      ))}
                  </div>
                </td>
                <td>
                  <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                    <button
                      className="icon-btn"
                      onClick={() => onEdit(cl)}
                      title="Modifier la classe"
                      style={{ background: "var(--bg-main)" }}
                    >
                      <i
                        className="fas fa-pencil-alt"
                        style={{ fontSize: "0.875rem", color: "grey" }}
                      ></i>
                    </button>
                    <button
                      className="icon-btn"
                      onClick={() => onDelete(cl.id)}
                      title="Supprimer la classe"
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
            ))
          ) : (
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
                    className="fas fa-users-slash"
                    style={{ fontSize: "3rem", opacity: 0.1 }}
                  ></i>
                  <p>Aucune classe définie. Commencez par en ajouter une !</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
