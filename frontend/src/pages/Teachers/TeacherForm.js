export default function TeacherForm({
  formData,
  handleChange,
  handleSubjectsChange,
  handleSubmit,
  subjects,
  editingId,
  errors
}) {

  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '800px', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          {editingId ? "Mettre à jour les détails du personnel" : "Inscrire un nouveau professeur"}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Intégrer un nouveau membre du corps professoral.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Prénom</label>
            <input type="text" name="first_name" placeholder="Prénom"
              value={formData.first_name}
              onChange={handleChange}
            />
            {errors.first_name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.first_name}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Nom de famille</label>
            <input type="text" name="last_name" placeholder="Nom de famille"
              value={formData.last_name}
              onChange={handleChange}
            />
            {errors.last_name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.last_name}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Adresse e-mail</label>
            <input type="email" name="email" placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Numéro de téléphone</label>
            <input type="text" name="phone" placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.phone}</p>}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Expertise (Matières)</label>
          <select 
            multiple
            value={formData.subjects}
            onChange={handleSubjectsChange}
            style={{ minHeight: '120px' }}
            title="Maintenez Ctrl (Windows) ou Cmd (Mac) pour en sélectionner plusieurs"
          >
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <i className="fas fa-info-circle"></i> Maintenez Ctrl/Cmd pour sélectionner plusieurs matières.
          </p>
          {errors.subjects && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.subjects}</p>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour le professeur" : "Inscrire le professeur"}
          </button>
        </div>
      </form>
    </div>
  );
}