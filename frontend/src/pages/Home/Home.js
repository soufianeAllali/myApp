import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AccountRequestModal from '../../components/AccountRequestModal';
import './Home.css';


const HERO_IMAGE = "/assets/tiko_school_hero.png";
const PREVIEW_IMAGE = "/assets/tiko_dashboard_preview.png";

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isAccountRequestOpen, setIsAccountRequestOpen] = useState(false);
  const navigate = useNavigate();



  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsLoginOpen(false);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });

      const { access_token, user, role } = response.data;

      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_email', user.email);

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'teacher') {
        navigate('/teacher/timetable');
      } else if (role === 'student') {
        navigate('/student/timetable');
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setError(err.response.data.errors.email ? err.response.data.errors.email[0] : 'Login failed.');
      } else {
        setError('An unexpected error occurred. Please check your connection.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="home-container">
      <nav className={`home-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="nav-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Tiko School</span>
          </div>
          <div className="nav-actions">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="nav-login-btn"
              style={{ border: 'none', cursor: 'pointer' }}
            >
              Login
            </button>
          </div>
        </div>
      </nav>

      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <span className="badge-new">Nouveau : Emploi du temps intelligent 2.0</span>
            <h1>Bienvenue sur <span>Tiko School</span></h1>
            <h2>Votre Plateforme d'Emploi du Temps Intelligent</h2>
            <p>Accédez à votre emploi du temps, restez organisé et ne manquez plus jamais de cours. La façon moderne de gérer votre parcours scolaire.</p>
            <div className="hero-btns">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="btn-primary-home"
                style={{ border: 'none', cursor: 'pointer' }}
              >
                Connexion au Tableau de bord
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
          <div className="hero-image-container">
            <div className="hero-blob"></div>
            <img src={HERO_IMAGE} alt="Tiko School Hero" className="hero-img" />
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-header">
          <h2>Tout ce dont vous avez besoin pour rester à jour</h2>
          <p>Conçu pour les étudiants et les professeurs qui apprécient l'organisation et la clarté.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <h3>Emploi du temps intelligent</h3>
            <p>Consultez instantanément votre emploi du temps hebdomadaire grâce à une interface claire et intuitive.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green">
              <i className="fas fa-book"></i>
            </div>
            <h3>Matières organisées</h3>
            <p>Toutes vos classes et matières clairement organisées par heure, salle et faculté.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon orange">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Accès facile</h3>
            <p>Étudiants et professeurs peuvent consulter rapidement leur emploi du temps depuis n'importe quel appareil, n'importe où.</p>
          </div>
        </div>
      </section>

      <section className="preview-section">
        <div className="preview-card">
          <div className="preview-text">
            <h2>Visualisez votre emploi du temps dans un tableau de bord magnifique</h2>
            <p>Découvrez un tableau de bord puissant conçu pour vous donner une vue d'ensemble de toute votre semaine de cours.</p>
          </div>
          <div className="preview-mockup">
            <img src={PREVIEW_IMAGE} alt="Dashboard Preview" className="dashboard-preview-img" />
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="cta-content">
          <h2>Prêt à consulter votre emploi du temps ?</h2>
          <p>Rejoignez Tiko School dès aujourd'hui et simplifiez votre organisation académique.</p>
          <button
            onClick={() => setIsLoginOpen(true)}
            className="btn-cta"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            Connexion
          </button>
        </div>
        <div className="cta-bg-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <i className="fas fa-graduation-cap"></i>
            <span>Tiko School</span>
          </div>
          <p>Plateforme d'Emploi du Temps Intelligent</p>
          <div className="footer-actions" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
            <button
              onClick={() => window.open("https://www.google.com/maps?q=31.550982268763807,-7.980950266105538")}
              className="btn-location"
            >
              <i className="fas fa-map-marker-alt"></i> Lieu de l'école
            </button>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Tiko School. Tous droits réservés.</span>
          </div>
        </div>
      </footer>

      {isLoginOpen && (
        <div className="login-overlay" onClick={() => setIsLoginOpen(false)}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setIsLoginOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
            <div className="login-modal-header">
              <i className="fas fa-graduation-cap"></i>
              <h3>Bon retour</h3>
              <p>Connectez-vous pour accéder à votre tableau de bord Tiko School</p>
              {error && <div className="login-error-message" style={{ color: '#ff4d4f', marginTop: '10px', fontSize: '14px' }}>{error}</div>}
            </div>
            <form className="login-modal-form" onSubmit={handleLogin}>
              <div className="form-input-group">
                <label>Adresse e-mail</label>
                <div className="input-with-icon">
                  <i className="fas fa-envelope"></i>
                  <input type="email" placeholder="Entrez votre e-mail" required style={{ paddingLeft: '50px' }} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
              </div>
              <div className="form-input-group">
                <label>Mot de passe</label>
                <div className="input-with-icon">
                  <i className="fas fa-lock"></i>
                  <input type="password" placeholder="Entrez votre mot de passe" required style={{ paddingLeft: '50px' }} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </div>
              <button type="submit" className="login-submit-btn" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    Connexion en cours... <i className="fas fa-spinner fa-spin"></i>
                  </>
                ) : (
                  <>
                    Connexion <i className="fas fa-sign-in-alt"></i>
                  </>
                )}
              </button>
            </form>
            <div className="login-modal-footer">
              <p>Vous n'avez pas de compte ? <span onClick={() => { setIsAccountRequestOpen(true); setIsLoginOpen(false); }} style={{ color: '#6366f1', fontWeight: 'bold', cursor: 'pointer' }}>Contacter l'administrateur</span></p>
            </div>
          </div>
        </div>
      )}

      <AccountRequestModal
        isOpen={isAccountRequestOpen}
        onClose={() => setIsAccountRequestOpen(false)}
      />
    </div>
  );
};

export default Home;