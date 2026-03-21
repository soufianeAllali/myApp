import React, { useState } from "react";
import axios from "axios";
import "./AccountRequestModal.css";

const AccountRequestModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    let newErrors = {};
    if (!formData.first_name || formData.first_name.length < 2)
      newErrors.first_name = "Le prénom est requis (min 2 caractères).";
    if (!formData.last_name || formData.last_name.length < 2)
      newErrors.last_name = "Le nom de famille est requis (min 2 caractères).";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Une adresse e-mail valide est requise.";
    if (!formData.phone || !/^[0-9]+$/.test(formData.phone))
      newErrors.phone =
        "Un numéro de téléphone valide est requis (chiffres uniquement).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/account-requests", formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
        });
        onClose();
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Une erreur s'est produite lors de l'envoi de votre demande.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="arm-overlay">
      <div className="arm-modal animate-in">
        <button className="arm-close" onClick={onClose}>
          &times;
        </button>

        <div className="arm-header">
          <div className="arm-icon">📩</div>
          <h2>Demande de compte</h2>
          <p>Remplissez le formulaire ci-dessous pour rejoindre Tiko School.</p>
        </div>

        {success ? (
          <div className="arm-success-msg animate-pop">
            <div className="arm-tick">✓</div>
            <h3>Demande envoyée !</h3>
            <p>
              Nous examinerons votre demande et vous contacterons bientôt par
              e-mail.
            </p>
          </div>
        ) : (
          <form className="arm-form" onSubmit={handleSubmit}>
            <div className="arm-grid">
              <div className="arm-input-group">
                <label>Prénom</label>
                <div className="arm-input-wrapper">
                  <i className="fas fa-user"></i>
                  <input
                    name="first_name"
                    placeholder="Ex: Jean"
                    value={formData.first_name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.first_name && (
                  <span className="arm-error">{errors.first_name}</span>
                )}
              </div>

              <div className="arm-input-group">
                <label>Nom de famille</label>
                <div className="arm-input-wrapper">
                  <i className="fas fa-signature"></i>
                  <input
                    name="last_name"
                    placeholder="Ex: Dupont"
                    value={formData.last_name}
                    onChange={handleInputChange}
                  />
                </div>
                {errors.last_name && (
                  <span className="arm-error">{errors.last_name}</span>
                )}
              </div>
            </div>

            <div className="arm-input-group">
              <label>E-mail professionnel / personnel</label>
              <div className="arm-input-wrapper">
                <i className="fas fa-envelope"></i>
                <input
                  name="email"
                  type="email"
                  placeholder="exemple@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  style={{ paddingLeft: "50px" }}
                />
              </div>
              {errors.email && (
                <span className="arm-error">{errors.email}</span>
              )}
            </div>

            <div className="arm-input-group">
              <label>Numéro de téléphone</label>
              <div className="arm-input-wrapper">
                <i className="fas fa-phone"></i>
                <input
                  name="phone"
                  placeholder="06 12 34 56 78"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
              {errors.phone && (
                <span className="arm-error">{errors.phone}</span>
              )}
            </div>

            <button type="submit" className="arm-submit-btn" disabled={loading}>
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                "Envoyer la demande"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AccountRequestModal;
