import { useState, useEffect, useMemo } from "react";
import { studentService, classService } from "../../services/api";
import StudentForm from "./StudentForm";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    class_id: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        studentService.getAll(),
        classService.getAll()
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.first_name.trim()) newErrors.first_name = "Le prénom est requis";
    if (!formData.last_name.trim()) newErrors.last_name = "Le nom de famille est requis";
    
    if (!formData.email.trim()) {
      newErrors.email = "L'adresse e-mail est requise";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Veuillez entrer une adresse e-mail valide";
    }

    if (!formData.phone.trim()) newErrors.phone = "Le numéro de téléphone est requis";
    if (!formData.class_id) newErrors.class_id = "Veuillez assigner une classe";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setErrors({}); 

    const request = editingId
      ? studentService.update(editingId, formData)
      : studentService.create(formData);

    request.then(() => {
      loadData();
      resetForm();
    }).catch(err => {
      if (err.response && err.response.status === 422) {
        setErrors(err.response.data.errors || {});
      }
    });
  };

  const handleEdit = (student) => {
    setEditingId(student.id);
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      phone: student.phone,
      class_id: student.class_id
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet étudiant ?")) {
      studentService.delete(id)
        .then(() => setStudents(students.filter(s => s.id !== id)));
    }
  };

  const resetForm = () => {
    setFormData({ first_name: "", last_name: "", email: "", phone: "", class_id: "" });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1>Gestion des étudiants</h1>
          <p>Gérez les inscriptions, les classes et les informations des étudiants.</p>
        </div>
        <button className={`btn ${showForm ? "btn-outline" : "btn-primary"}`} onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          <i className={showForm ? "fas fa-times" : "fas fa-user-plus"}></i>
          {showForm ? "Fermer le formulaire" : "Ajouter un étudiant"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
          <StudentForm
            formData={{...formData, classes}}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            errors={errors}
          />
        </div>
      )}

      <div className="table-section">
        <div className="table-header">
          <h3>Annuaire des étudiants</h3>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher des étudiants..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
            <div className="loader"></div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Détails de l'étudiant</th>
                  <th>ID</th>
                  <th>Classe</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.length > 0 ? paginatedStudents.map(student => (
                  <tr key={student.id} className="row-card">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div className="avatar-box avatar-blue">
                          {getInitials(student.first_name, student.last_name)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-main)' }}>{student.first_name} {student.last_name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>#{student.id.toString().padStart(3, '0')}</code>
                    </td>
                    <td>
                      <span className="badge badge-primary">
                        {student.class?.name || 'Non assigné'}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">Actif</span>
                    </td>
                    <td>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button className="icon-btn" onClick={() => handleEdit(student)} title="Modifier l'étudiant" style={{ background: 'var(--bg-main)' }}>
                          <i className="fas fa-pencil-alt" style={{ fontSize: '0.875rem',color:'grey' }}></i>
                        </button>
                        <button className="icon-btn" onClick={() => handleDelete(student.id)} title="Supprimer l'étudiant" style={{ color: 'var(--danger)', background: 'var(--danger-light)' }}>
                          <i className="fas fa-trash-alt" style={{ fontSize: '0.875rem' }}></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                        <i className="fas fa-user-slash" style={{ fontSize: '3rem', opacity: 0.1 }}></i>
                        <p>Aucun étudiant ne correspond à vos critères.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button 
                key={i} 
                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              className="page-btn" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}