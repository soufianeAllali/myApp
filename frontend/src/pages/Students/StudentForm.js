export default function StudentForm({ formData, handleChange, handleSubmit, editingId, errors }) {
  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '800px', border: 'none', boxShadow: 'var(--shadow-lg)' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.025em' }}>
          {editingId ? "Modifier les informations de l'étudiant" : "Inscrire un nouvel étudiant"}
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Veuillez remplir les détails ci-dessous pour inscrire l'étudiant dans le système.</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Prénom</label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Prénom"
            />
            {errors.first_name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.first_name}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Nom de famille</label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Nom de famille"
            />
            {errors.last_name && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.last_name}</p>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Adresse e-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
            />
            {errors.email && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.email}</p>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Numéro de téléphone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+2120000000000"
            />
            {errors.phone && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.phone}</p>}
          </div>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Assigner à une classe</label>
          <select 
            name="class_id" 
            value={formData.class_id} 
            onChange={handleChange}
          >
            <option value="">Sélectionnez une classe...</option>
            {formData.classes && formData.classes.map(cls => (
              <option key={cls.id} value={Number(cls.id)}>{cls.name}</option>
            ))}
          </select>
          {errors.class_id && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{errors.class_id}</p>}
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour l'étudiant" : "Inscrire l'étudiant"}
          </button>
        </div>
      </form>
    </div>
  );
}