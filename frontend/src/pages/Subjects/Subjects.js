import { useState, useEffect, useMemo } from "react";
import { subjectService } from "../../services/api";

import SubjectForm from "./SubjectForm";
import SubjectTable from "./SubjectTable";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: ""
  });

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const res = await subjectService.getAll();
      setSubjects(res.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ name: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom de la matière est requis";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const request = editingId
      ? subjectService.update(editingId, formData)
      : subjectService.create(formData);

    request
      .then(() => {
        loadSubjects();
        resetForm();
      })
      .catch(error => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      });
  };

  const handleEdit = (subject) => {
    setEditingId(subject.id);
    setFormData({ name: subject.name });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette matière ? Cela peut affecter les classes et les professeurs qui y sont assignés.")) {
      subjectService.delete(id)
        .then(() => {
          setSubjects(subjects.filter(s => s.id !== id));
        });
    }
  };

  const resetForm = () => {
    setFormData({ name: "" });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subjects, searchTerm]);

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage);
  const paginatedSubjects = filteredSubjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="subjects-page">
      <div className="page-header">
        <div>
          <h1>Gestion des matières</h1>
          <p>Gérez et organisez les cours académiques dispensés dans votre établissement.</p>
        </div>
        <button className={`btn ${showForm ? "btn-outline" : "btn-primary"}`} onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          <i className={showForm ? "fas fa-times" : "fas fa-book"}></i>
          {showForm ? "Fermer le formulaire" : "Ajouter une matière"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
          <SubjectForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            errors={errors}
          />
        </div>
      )}

      <div className="table-section">
        <div className="table-header">
          <h3>Catalogue des cours</h3>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher des matières..." 
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
          <SubjectTable
            subjects={paginatedSubjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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