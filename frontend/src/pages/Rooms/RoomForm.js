export default function RoomForm({
  formData,
  handleChange,
  handleClassChange,
  handleSubmit,
  classes,
  editingId,
  errors
}) {

  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '850px' }}>
      <div className="form-header">
        <h3>
          {editingId ? "Mettre à jour les détails de l'installation" : "Enregistrer un nouveau lieu"}
        </h3>
        <p>Définissez le but de la salle, sa capacité et quelles classes sont autorisées à l'utiliser.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>
              <i className="fas fa-door-open" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Désignation de la salle
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="nom de la salle"
            />
            {errors.name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.name}</p>}
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-users" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Capacité d'accueil
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="capacité de la salle"
            />
            {errors.capacity && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.capacity}</p>}
          </div>

          <div className="form-group">
            <label>
              <i className="fas fa-microscope" style={{ marginRight: '0.5rem', color: 'var(--primary)' }}></i>
              Type d'infrastructure
            </label>
            <input
              type="text"
              name="type"
              value={formData.type}
              onChange={handleChange}
              placeholder="type de la salle"
            />
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h4 className="form-section-title">
            <i className="fas fa-link" style={{ color: 'var(--primary)' }}></i>
            Groupes académiques associés
          </h4>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sélectionnez les classes qui utiliseront principalement cette installation.</p>
        </div>

        <div className="selection-grid">
          {classes.map(cl => {
            const isSelected = formData.classes.includes(cl.id);
            return (
              <div key={cl.id} 
                className={`selection-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleClassChange(cl.id, !isSelected)}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => { e.stopPropagation(); handleClassChange(cl.id, e.target.checked); }}
                  style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--primary)' }}
                />
                <span style={{ fontWeight: 700, fontSize: '0.875rem', color: isSelected ? 'var(--primary)' : 'var(--text-main)' }}>{cl.name}</span>
              </div>
            );
          })}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour la salle" : "Enregistrer l'installation"}
          </button>
        </div>
      </form>
    </div>
  );
}