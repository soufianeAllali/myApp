import { NavLink } from "react-router-dom";

export default function Menu() {
  const menuItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "fas fa-columns" },
    { name: "Étudiants", path: "/students", icon: "fas fa-user-graduate" },
    { name: "Professeurs", path: "/teachers", icon: "fas fa-chalkboard-teacher" },
    { name: "Classes", path: "/classes", icon: "fas fa-layer-group" },
    { name: "Cours", path: "/subjects", icon: "fas fa-book-open" },
    { name: "Créneaux", path: "/timeslots", icon: "fas fa-clock" },
    { name: "Salles", path: "/rooms", icon: "fas fa-door-open" },
    { name: "Emploi du temps", path: "/schedules", icon: "fas fa-calendar-check" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="avatar-box avatar-blue" style={{ width: '40px', height: '40px', borderRadius: '12px' }}>
          <i className="fas fa-graduation-cap"></i>
        </div>
        <span>EduDash Admin</span>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li key={item.path} className="sidebar-menu-item">
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                isActive ? "sidebar-link active" : "sidebar-link"
              }
            >
              <i className={item.icon}></i>
              <span>{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      
      <div style={{ padding: '1.25rem' }}>
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-light), white)', 
          padding: '1.25rem', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          textAlign: 'center',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ 
            width: '32px', 
            height: '32px', 
            borderRadius: '50%', 
            background: 'var(--primary)', 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 0.75rem',
            fontSize: '0.75rem'
          }}>
            <i className="fas fa-crown"></i>
          </div>
          <p style={{ fontSize: '0.8125rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.25rem' }}>Version Pro Active</p>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>Modules illimités & Planification IA</p>
        </div>
      </div>
    </aside>
  );
}
