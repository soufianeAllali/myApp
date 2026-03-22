export default function TeacherTable({ teachers, onEdit, onDelete}) {
  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="modern-table">
        <thead>
          <tr>
            <th>Professeur</th>
            <th>Contact</th>
            <th>Matières</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.length > 0 ? teachers.map(t => (
            <tr key={t.id} className="row-card">
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="avatar-box avatar-green">
                    {getInitials(t.first_name, t.last_name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{t.first_name} {t.last_name}</div>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.email}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.phone}</div>
              </td>
              <td>
                <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                  {t.subjects && t.subjects.map(s => (
                    <span key={s.id} className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                      {s.name}
                    </span>
                  ))}
                </div>
              </td> 
              <td>
                <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                  <button className="icon-btn" onClick={() => onEdit(t)} title="Modifier le professeur" style={{ background: 'var(--bg-main)' }}>
                    <i className="fas fa-pencil-alt" style={{ fontSize: '0.875rem',color:'grey'}}></i>
                  </button>
                  <button className="icon-btn" onClick={() => onDelete(t.id)} title="Supprimer le professeur" style={{ color: 'var(--danger)', background: 'var(--danger-light)' }}>
                    <i className="fas fa-trash-alt" style={{ fontSize: '0.875rem' }}></i>
                  </button> 
                </div>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <i className="fas fa-chalkboard-teacher" style={{ fontSize: '3rem', opacity: 0.1 }}></i>
                  <p>Aucun professeur trouvé dans l'annuaire.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}