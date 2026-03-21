import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { classService } from "../../services/api";

import RoomForm from "./RoomForm";
import RoomTable from "./RoomTable";

export default function Rooms(){

  const [rooms,setRooms] = useState([]);
  const [classes,setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm,setShowForm] = useState(false);
  const [editingId,setEditingId] = useState(null);
  const [errors,setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [formData,setFormData] = useState({
    name:"",
    capacity:"",
    type:"",
    classes:[]
  });

  useEffect(()=>{
    loadData();
  },[]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [roomsRes, classesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/rooms"),
        classService.getAll()
      ]);
      setRooms(roomsRes.data);
      setClasses(classesRes.data);
    } catch (error) {
      console.error("Error loading rooms data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e)=>{
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClassChange = (classId,checked)=>{
    if(checked){
      setFormData({
        ...formData,
        classes:[...formData.classes,classId]
      });
    }else{
      setFormData({
        ...formData,
        classes: formData.classes.filter(id=>id!==classId)
      });
    }
  };

  const validate = ()=>{
    let newErrors = {};
    if(!formData.name.trim())
      newErrors.name="Le nom de la salle est requis";
    if(!formData.capacity)
      newErrors.capacity="La capacité est requise";
    setErrors(newErrors);
    return Object.keys(newErrors).length===0;
  };

  const handleSubmit = (e)=>{
    e.preventDefault();
    if(!validate()) return;

    const request = editingId
    ? axios.put(`http://localhost:8000/api/rooms/${editingId}`, formData)
    : axios.post("http://localhost:8000/api/rooms", formData);

    request.then(()=>{
      loadData();
      resetForm();
    }).catch(err => {
      console.error("Error saving room:", err);
    });
  };

  const handleEdit = (room)=>{
    setEditingId(room.id);
    setFormData({
      name:room.name,
      capacity:room.capacity,
      type:room.type || "",
      classes:room.classes.map(c=>c.id)
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id)=>{
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette salle ?")) {
      axios.delete(`http://localhost:8000/api/rooms/${id}`)
      .then(()=>{
        setRooms(rooms.filter(r=>r.id!==id));
      });
    }
  };

  const resetForm = ()=>{
    setFormData({ name:"", capacity:"", type:"", classes:[] });
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => 
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (room.type || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rooms, searchTerm]);

  const totalPages = Math.ceil(filteredRooms.length / itemsPerPage);
  const paginatedRooms = filteredRooms.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return(
    <div className="rooms-page">
      <div className="page-header">
        <div>
          <h1>Gestion des salles</h1>
          <p>Configurez les installations de l'école, les capacités des salles et les assignations de classes.</p>
        </div>
        <button className={`btn ${showForm ? "btn-outline" : "btn-primary"}`} onClick={() => { if(showForm) resetForm(); else setShowForm(true); }}>
          <i className={showForm ? "fas fa-times" : "fas fa-door-open"}></i>
          {showForm ? "Annuler" : "Enregistrer une salle"}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
          <RoomForm
            formData={formData}
            handleChange={handleChange}
            handleClassChange={handleClassChange}
            handleSubmit={handleSubmit}
            classes={classes}
            editingId={editingId}
            errors={errors}
          />
        </div>
      )}

      <div className="table-section">
        <div className="table-header">
          <h3>Installations du campus</h3>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher des salles..." 
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
          <RoomTable
            rooms={paginatedRooms}
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