import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NotificationDropdown.css';

const NotificationDropdown = ({ isOpen, onClose }) => {
  const [requests, setRequests] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const token = localStorage.getItem('auth_token');

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
      fetchClasses();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin/account-requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/classes');
      setClasses(res.data);
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  const handleApprove = async (id) => {
    if (!selectedClass) {
      alert("Veuillez sélectionner une classe pour l'élève.");
      return;
    }
    setActionLoading(true);
    try {
      await axios.post(`http://127.0.0.1:8000/api/admin/account-requests/${id}/approve`, 
        { class_id: selectedClass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests(requests.filter(r => r.id !== id));
      setApprovingId(null);
      setSelectedClass('');
      alert("Compte approuvé et créé avec succès !");
    } catch (err) {
      console.log(err)
      alert("Erreur lors de l'approbation.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir rejeter cette demande ?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/account-requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(requests.filter(r => r.id !== id));
      alert("Demande rejetée.");
    } catch (err) {
      alert("Erreur lors du rejet.");
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="nd-wrapper animate-slide-down">
      <div className="nd-header">
        <h3>Demandes de compte ({requests.length})</h3>
        <button className="nd-close" onClick={onClose}>&times;</button>
      </div>

      <div className="nd-body">
        {loading ? (
          <div className="nd-loading">
            <i className="fas fa-spinner fa-spin"></i> Chargement...
          </div>
        ) : requests.length === 0 ? (
          <div className="nd-empty">
            <i className="fas fa-check-circle"></i>
            <p>Aucune demande en attente.</p>
          </div>
        ) : (
          requests.map(req => (
            <div key={req.id} className="nd-card">
              <div className="nd-card-info">
                <h4>{req.first_name} {req.last_name}</h4>
                <p><i className="fas fa-envelope"></i> {req.email}</p>
                <p><i className="fas fa-phone"></i> {req.phone}</p>
                <span className="nd-date">{new Date(req.created_at).toLocaleDateString()}</span>
              </div>

              {approvingId === req.id ? (
                <div className="nd-approve-zone animate-fade-in">
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="nd-select"
                  >
                    <option value="">Sélectionner une classe</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="nd-actions">
                    <button onClick={() => handleApprove(req.id)} className="btn-confirm" disabled={actionLoading}>
                      Confirmer
                    </button>
                    <button onClick={() => setApprovingId(null)} className="btn-cancel">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="nd-actions">
                  <button onClick={() => setApprovingId(req.id)} className="btn-approve">
                    <i className="fas fa-check"></i> Approuver
                  </button>
                  <button onClick={() => handleReject(req.id)} className="btn-reject" disabled={actionLoading}>
                    <i className="fas fa-times"></i> Rejeter
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
