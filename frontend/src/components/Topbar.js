import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NotificationDropdown from './NotificationDropdown';

const Topbar = () => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.setAttribute('data-theme', 'dark');
    }
    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 60000); 
    return () => clearInterval(interval);
  }, []);

  const fetchPendingCount = async () => {
    const token = localStorage.getItem('auth_token');
    const role = localStorage.getItem('user_role');
    if (token && role === 'admin') {
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/admin/account-requests', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPendingCount(res.data.length);
      } catch (err) {
        console.error("Notif fetch error", err);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDark ? 'dark' : 'light';
    setIsDark(!isDark);
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_email');
    navigate('/');
  };

  return (
    <header className="topbar">
      <div>
      </div>

      <div className="topbar-actions">
        <div className="action-group">
          <button 
            className="icon-btn" 
            title="Notifications" 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <i className="fas fa-bell"></i>
            {pendingCount > 0 && (
              <span className="notification-badge">
                {pendingCount}
              </span>
            )}
          </button>
          
          <NotificationDropdown 
            isOpen={isNotifOpen} 
            onClose={() => setIsNotifOpen(false)} 
          />
          <button className="icon-btn theme-toggle-btn" onClick={toggleTheme} title="Basculer l'apparence">
            <i className={isDark ? 'fas fa-sun' : 'fas fa-moon'}></i>
          </button>
          <button className="icon-btn logout-btn" onClick={handleLogout} title="Déconnexion">
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
        
        <div className="user-profile">
          <div className="user-avatar">
            SA
          </div>
          <div className="user-info">
            <span className="user-name">Soufiane Allali</span>
            <span className="user-role">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
