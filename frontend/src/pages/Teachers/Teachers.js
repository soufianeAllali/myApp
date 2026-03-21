import { useState, useEffect, useMemo } from "react";
import { teacherService, subjectService } from "../../services/api";
import TeacherForm from "./TeacherForm";
import TeacherTable from "./TeacherTable";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    subjects: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachersRes, subjectsRes] = await Promise.all([
        teacherService.getAll(),
        subjectService.getAll()
      ]);
      setTeachers(teachersRes.data);
      setSubjects(subjectsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubjectsChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({ ...formData, subjects: selected });
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

    if (!formData.phone.trim()) newErrors.phone = "Le téléphone est requis";
    if (formData.subjects.length === 0) newErrors.subjects = "Sélectionnez au moins une matière";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const request = editingId
      ? teacherService.update(editingId, formData)
      : teacherService.create(formData);

    request
      .then(() => {
        loadData();
        resetForm();
      })
      .catch(error => {
        if (error.response?.data?.errors) {
          setErrors(error.response.data.errors);
        }
      });
  };

  const handleEdit = (teacher) => {
    setEditingId(teacher.id);
    setFormData({
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects.map(s => s.id)
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce professeur ?")) {
      teacherService.delete(id)
        .then(() => {
          setTeachers(teachers.filter(t => t.id !== id));
        });
    }
  };

  const resetForm = () => {
    setFormData({ first_name: "", last_name: "", email: "", phone: "", subjects: [] });
    setErrors({});
    setEditingId(null);
    setShowForm(false);
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter(t => 
      `${t.first_name} ${t.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subjects.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [teachers, searchTerm]);

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="teachers-page">
      <div className="page-header">
        <div>
          <h1>Gestion des professeurs</h1>
          <p>Gérez le personnel de l'école, les membres du corps professoral et les matières qui leur sont assignées.</p>
        </div>
        <button style={{width:'210px'}} className={`btn ${showForm ? "btn-outline" : "btn-primary"}`} onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          <i className={showForm ? "fas fa-times" : "fas fa-chalkboard-teacher"}></i>
          {showForm ? "Annuler" : "Ajouter professeur"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
          <TeacherForm
            formData={formData}
            handleChange={handleChange}
            handleSubjectsChange={handleSubjectsChange}
            handleSubmit={handleSubmit}
            subjects={subjects}
            editingId={editingId}
            errors={errors}
          />
        </div>
      )} 

      <div className="table-section">
        <div className="table-header">
          <h3>Annuaire du corps professoral</h3>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher des professeurs..." 
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
          <TeacherTable
            teachers={paginatedTeachers}
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
              <i className="fas fa-chevron-left" ></i>
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