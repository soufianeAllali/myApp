export default function SubjectTable({ subjects, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Détails de la matière</th>
            <th>Code</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects.length > 0 ? subjects.map(s => (
            <tr key={s.id} className="row-card">
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="avatar-box avatar-blue">
                    <i className="fas fa-book"></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{s.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cours académique</div>
                  </div>
                </div>
              </td>
              <td>
                <code style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>SUBJ-{s.id.toString().padStart(3, '0')}</code>
              </td>
              <td>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <button className="icon-btn" onClick={() => onEdit(s)} title="Modifier la matière" style={{ background: 'var(--bg-main)' }}>
                    <i className="fas fa-pencil-alt" style={{ fontSize: '0.875rem',color:'grey' }}></i>
                  </button>
                  <button className="icon-btn" onClick={() => onDelete(s.id)} title="Supprimer la matière" style={{ color: 'var(--danger)', background: 'var(--danger-light)' }}>
                    <i className="fas fa-trash-alt" style={{ fontSize: '0.875rem' }}></i>
                  </button>
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <i className="fas fa-book-open" style={{ fontSize: '3rem', opacity: 0.1 }}></i>
                  <p>Aucune matière trouvée. Créez votre premier cours !</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}