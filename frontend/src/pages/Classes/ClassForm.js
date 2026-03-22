export default function ClassForm({
  formData,
  handleChange,
  handleSubjectChange,
  handleHourChange,
  handleSubmit,
  editingId,
  subjects,
  errors
}) {

  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '850px' }}>
      <div className="form-header">
        <h3>
          {editingId ? "Modifier le programme de la classe" : "Configurer une nouvelle classe"}
        </h3>
        <p>Définissez le nom de la classe, le niveau académique et assignez les heures hebdomadaires par matière.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Nom de la classe</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="name"
            />
            {errors.name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>Niveau / Filière</label>
            <input
              type="text"
              name="level"
              value={formData.level}
              onChange={handleChange}
              placeholder="level"
            />
            {errors.level && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.level}</p>}
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <h4 className="form-section-title">
            <i className="fas fa-book-reader" style={{ color: 'var(--primary)' }}></i>
            Matières
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Cochez les matières et spécifiez le nombre d'heures par semaine pour chacune.</p>
        </div>

        <div className="selection-grid">
          {subjects.map(subject => {
            const selected = formData.subjects.find(
              s => s.subject_id === subject.id
            );

            return (
              <div key={subject.id} 
                className={`selection-card ${selected ? 'selected' : ''}`}
                style={{ flexDirection: 'column', alignItems: 'flex-start' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input
                    type="checkbox"
                    checked={!!selected}
                    onChange={(e) =>
                      handleSubjectChange(subject.id, e.target.checked)
                    }
                    style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                  />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem', color: selected ? 'var(--primary)' : 'var(--text-main)' }}>{subject.name}</span>
                </div>

                {selected && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '2rem', marginTop: '0.25rem' }}>
                    <input
                      type="number"
                      min="1"
                      value={selected.hours_per_week}
                      onChange={(e) =>
                        handleHourChange(subject.id, e.target.value)
                      }
                      style={{ 
                        width: '64px', 
                        padding: '0.375rem 0.5rem', 
                        fontSize: '0.875rem',
                        textAlign: 'center'
                      }}
                    />
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>h/sem</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {errors.subjects && (
          <div className="badge badge-danger" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
            {errors.subjects}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour la classe" : "Initialiser la classe"}
          </button>
        </div>
      </form>
    </div>
  );
}