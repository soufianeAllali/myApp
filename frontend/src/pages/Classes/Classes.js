import { useState, useEffect, useMemo } from "react";
import { classService, subjectService } from "../../services/api";

import ClassForm from "./ClassForm";
import ClassTable from "./ClassTable";

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData, setFormData] = useState({
    name: "",
    level: "",
    subjects: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [classesRes, subjectsRes] = await Promise.all([
        classService.getAll(),
        subjectService.getAll()
      ]);
      setClasses(classesRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubjectChange = (subjectId, checked) => {
    if (checked) {
      setFormData({
        ...formData,
        subjects: [...formData.subjects, { subject_id: subjectId, hours_per_week: 1 }]
      });
    } else {
      setFormData({
        ...formData,
        subjects: formData.subjects.filter(s => s.subject_id !== subjectId)
      });
    }
  };

  const handleHourChange = (subjectId, value) => {
    setFormData({
      ...formData,
      subjects: formData.subjects.map(s =>
        s.subject_id === subjectId
          ? { ...s, hours_per_week: parseInt(value) || 1 }
          : s
      )
    });
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Le nom de la classe est requis";
    if (!formData.level.trim()) newErrors.level = "Le niveau est requis";
    if (formData.subjects.length === 0)
      newErrors.subjects = "Sélectionnez au moins une matière pour cette classe";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const request = editingId
      ? classService.update(editingId, formData)
      : classService.create(formData);

    request.then(() => {
      loadData();
      resetForm();
    }).catch(err => {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      }
    });
  };

  const handleEdit = (cl) => {
    setEditingId(cl.id);
    setFormData({
      name: cl.name,
      level: cl.level,
      subjects: cl.subjects.map(s => ({
        subject_id: s.id,
        hours_per_week: s.pivot.hours_per_week
      }))
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette classe ? Toutes les assignations d'étudiants à cette classe seront effacées.")) {
      classService.delete(id)
        .then(() => {
          setClasses(classes.filter(c => c.id !== id));
        });
    }
  };

  const resetForm = () => {
    setFormData({ name: "", level: "", subjects: [] });
    setEditingId(null);
    setErrors({});
    setShowForm(false);
  };

  const filteredClasses = useMemo(() => {
    return classes.filter(cl => 
      cl.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cl.level.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [classes, searchTerm]);

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage);
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="classes-page">
      <div className="page-header">
        <div>
          <h1>Gestion des classes</h1>
          <p>Définissez les niveaux scolaires et personnalisez leur programme hebdomadaire.</p>
        </div>
        <button className={`btn ${showForm ? "btn-outline" : "btn-primary"}`} onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          <i className={showForm ? "fas fa-times" : "fas fa-layer-group"}></i>
          {showForm ? "Fermer le formulaire" : "Créer une nouvelle classe"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
          <ClassForm
            formData={formData}
            handleChange={handleChange}
            handleSubjectChange={handleSubjectChange}
            handleHourChange={handleHourChange}
            handleSubmit={handleSubmit}
            editingId={editingId}
            subjects={subjects}
            errors={errors}
          />
        </div>
      )}

      <div className="table-section">
        <div className="table-header">
          <h3>Groupes académiques</h3>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher des classes..." 
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
          <ClassTable
            classes={paginatedClasses}
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