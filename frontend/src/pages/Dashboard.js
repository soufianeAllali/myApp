import React, { useState, useEffect, useMemo } from 'react';
import SpeechForm from '../components/Voix';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { dashboardService } from '../services/api';
import './FuturisticStats.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [data, setData] = useState({
    studentsCount: 0,
    teachersCount: 0,
    classesCount: 0,
    subjectsCount: 0,
    recentStudents: [],
    allStudents: [],
    allClasses: [],
    allSubjects: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const overview = await dashboardService.getOverview();
        setData({
          studentsCount: overview.studentsCount,
          teachersCount: overview.teachersCount,
          classesCount: overview.classesCount,
          subjectsCount: overview.subjectsCount,
          recentStudents: overview.recentStudents,
          allStudents: overview.allStudents,
          allClasses: overview.allClasses,
          allSubjects: overview.allSubjects,
        });
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  
  const stats = [
    { title: 'Total Étudiants',navigate:'/students', value: data.studentsCount, icon: 'fas fa-user-graduate', class: 'card-students animate-float' },
    { title: 'Total Professeurs',navigate:'/teachers', value: data.teachersCount, icon: 'fas fa-chalkboard-teacher', class: 'card-teachers animate-shine' },
    { title: 'Total Classes',navigate:'/classes', value: data.classesCount, icon: 'fas fa-layer-group', class: 'card-classes animate-float' },
    { title: 'Total Matières',navigate:'/subjects', value: data.subjectsCount, icon: 'fas fa-book-open', class: 'card-subjects animate-pulse' },
  ];

  const barData = useMemo(() => {
    const classCounts = {};
    data.allStudents.forEach(student => {
      const className = student.class?.name || 'Non assigné';
      classCounts[className] = (classCounts[className] || 0) + 1;
    });

    const labels = Object.keys(classCounts);
    const chartData = Object.values(classCounts);

    return {
      labels: labels.length > 0 ? labels : ['Pas de données'],
      datasets: [
        {
          label: 'Étudiants',
          data: chartData.length > 0 ? chartData : [0],
          backgroundColor: 'rgba(79, 70, 229, 0.8)',
          hoverBackgroundColor: 'rgba(79, 70, 229, 1)',
          borderRadius: 6,
          barThickness: 40,
        },
      ],
    };
  }, [data.allStudents]);

  const pieData = useMemo(() => {
    const subjectHours = {};
    data.allClasses.forEach(cl => {
      cl.subjects?.forEach(subj => {
        const hours = subj.pivot?.hours_per_week || 0;
        subjectHours[subj.name] = (subjectHours[subj.name] || 0) + hours;
      });
    });

    const labels = Object.keys(subjectHours);
    const chartData = Object.values(subjectHours);

    return {
      labels: labels.length > 0 ? labels : ['Pas de données'],
      datasets: [
        {
          data: chartData.length > 0 ? chartData : [1],
          backgroundColor: [
            '#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', 
            '#EC4899', '#06B6D4', '#6366F1', '#F97316', '#84CC16'
          ],
          borderWidth: 0,
          hoverOffset: 15,
        },
      ],
    };
  }, [data.allClasses]);

  const filteredStudents = useMemo(() => {
    return data.allStudents.filter(student => 
      `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.class?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.allStudents, searchTerm]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getInitials = (first, last) => {
    return `${first?.charAt(0) || ''}${last?.charAt(0) || ''}`.toUpperCase();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-content">
      <SpeechForm/>
      <div className="page-header">
        <div>
          <h1>Bon retour !!</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => window.location.href='http://127.0.0.1:8000/api/export-students'}
            className="btn-export-students"
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: 'white',
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-file-excel"></i> Exporter les étudiants
          </button>
          <button 
            onClick={() => window.location.href='http://127.0.0.1:8000/api/export-teachers'}
            className="btn-export-teachers"
            style={{
              padding: '0.6rem 1.2rem',
              fontSize: '0.875rem',
              fontWeight: '700',
              color: 'white',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <i className="fas fa-file-excel"></i> Exporter les professeurs
          </button>
        </div>
      </div>
      
      <div className="futuristic-stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className={`holographic-card ${stat.class}`} onClick={()=>navigate(stat.navigate)}>
            <div className="card-icon">
              <i className={stat.icon}></i>
            </div>
            <div className="stat-metric-name">{stat.title}</div>
            <div className="stat-metric-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Inscriptions par classe</h3>
          </div>
          {data.allStudents.length > 0 ? (
             <div style={{ height: '300px', width: '100%', position: 'relative' }}>
               <Bar data={barData} options={{ 
                 responsive: true, 
                 maintainAspectRatio: false,
                 plugins: { 
                   legend: { display: false },
                   tooltip: {
                     backgroundColor: '#1e293b',
                     padding: 12,
                     titleFont: { size: 14, weight: 'bold' },
                     bodyFont: { size: 13 },
                     cornerRadius: 8,
                   }
                 },
                 scales: {
                   y: { 
                     beginAtZero: true, 
                     grid: { color: 'rgba(0, 0, 0, 0.05)', drawBorder: false },
                     ticks: { font: { size: 11, weight: '500' }, color: '#64748b' }
                   },
                   x: { 
                     grid: { display: false },
                     ticks: { font: { size: 11, weight: '500' }, color: '#64748b' }
                   }
                 }
               }} />
             </div>
          ) : (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Aucune donnée d'inscription disponible
            </div>
          )}
        </div>
        <div className="chart-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Charge horaire hebdomadaire</h3>
          </div>
          {Object.keys(pieData.labels).length > 0 && pieData.labels[0] !== 'Pas de données' ? (
            <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Pie data={pieData} options={{ 
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      usePointStyle: true,
                      padding: 20,
                      font: { size: 12, weight: '500' }
                    }
                  }
                }
              }} />
            </div>
          ) : (
             <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Aucune donnée de charge horaire disponible
            </div>
          )}
        </div>
      </div>

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
        <div style={{ overflowX: 'auto' }}>
          <table className="modern-table">
            <thead>
              <tr>
                <th>Étudiant</th>
                <th>ID</th>
                <th>Classe</th>
                <th>Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.length > 0 ? paginatedStudents.map((student) => (
                <tr key={student.id} className="row-card">
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="avatar-box avatar-blue">
                        {getInitials(student.first_name, student.last_name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{student.first_name} {student.last_name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <code style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>#{student.id.toString().padStart(3, '0')}</code>
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontWeight: 600 }}>
                      {student.class?.name || 'Non assigné'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.875rem' }}>{student.email}</div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                                     <button onClick={()=>navigate('/students')} style={{
                        padding: '0.4rem 1rem',
                        fontSize: '0.8125rem',
                        fontWeight: '700',
                        color: 'white',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }} 
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(79, 70, 229, 0.4), 0 4px 6px -2px rgba(79, 70, 229, 0.2)';
                        e.currentTarget.style.filter = 'brightness(1.1)';
                      }} 
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(79, 70, 229, 0.2), 0 2px 4px -1px rgba(79, 70, 229, 0.1)';
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}>
                        Gérer <i className="fas fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                      <i className="fas fa-search" style={{ fontSize: '2rem', opacity: 0.2 }}></i>
                      <p>Aucun étudiant correspondant à votre recherche n'a été trouvé.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
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
};

export default Dashboard;
