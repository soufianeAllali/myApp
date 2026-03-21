export default function SubjectForm({ formData, handleChange, handleSubmit, editingId, errors }) {
  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '500px' }}>
      <div className="form-header">
        <h3>
          {editingId ? "Modifier le nom du cours" : "Ajouter une nouvelle matière"}
        </h3>
        <p>Entrez le nom officiel du cours académique ou de la matière.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Titre de la matière</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="ex. Mathématiques"
          />
          {errors.name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.name}</p>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour la matière" : "Créer la matière"}
          </button>
        </div>
      </form>
    </div>
  );
}