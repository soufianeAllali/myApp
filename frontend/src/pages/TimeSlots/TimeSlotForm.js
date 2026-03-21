export default function TimeSlotForm({ formData, handleChange, handleSubmit, editingId, formErrors, apiErrors }) {
  return (
    <div className="chart-card" style={{ marginTop: '1rem', width: '100%', maxWidth: '540px' }}>
      <div className="form-header">
        <h3>
          {editingId ? "Mettre à jour la fenêtre horaire" : "Créer un nouveau créneau horaire"}
        </h3>
        <p>Spécifiez le jour et les heures de travail pour ce créneau horaire académique.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Jour de la semaine</label>
          <input
            type="text"
            name="day"
            value={formData.day}
            onChange={handleChange}
            placeholder="ex. Lundi"
          />
          {formErrors.day && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{formErrors.day}</p>}
          {apiErrors.day && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{apiErrors.day[0]}</p>}
        </div>

        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div className="form-group">
            <label>Heure de début</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
            />
            {formErrors.start_time && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{formErrors.start_time}</p>}
            {apiErrors.start_time && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{apiErrors.start_time[0]}</p>}
          </div>

          <div className="form-group">
            <label>Heure de fin</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
            />
            {formErrors.end_time && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{formErrors.end_time}</p>}
            {apiErrors.end_time && <p style={{color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem', fontWeight: 500}}>{apiErrors.end_time[0]}</p>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
            <i className={editingId ? 'fas fa-save' : 'fas fa-plus'}></i>
            {editingId ? "Mettre à jour le créneau horaire" : "Enregistrer le créneau horaire"}
          </button>
        </div>
      </form>
    </div>
  );
}