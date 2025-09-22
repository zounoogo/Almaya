// src/components/Footer.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { Link } from 'react-router-dom'; // Import Link for navigation

const Footer = () => {
  const { user, logout } = useAuth(); // Access user state and logout function

  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <h5>Almaya Services</h5>
            <p className="text-muted">Votre partenaire de croissance.</p>
          </div>
          <div className="col-md-3 mb-3 mb-md-0">
            <h6>Navigation</h6>
            <ul className="list-unstyled">
              {/* Liens pour les visiteurs non connectés */}
              {!user && (
                <>
                  <li><Link to="/login" className="text-white text-decoration-none">Connexion</Link></li>
                  <li><Link to="/register" className="text-white text-decoration-none">Inscription</Link></li>
                  <li><a href="#about" className="text-white text-decoration-none">À Propos</a></li>
                  <li><a href="#contact" className="text-white text-decoration-none">Contact</a></li>
                </>
              )}
              {/* Liens pour l'utilisateur connecté */}
              {user && (
                <>
                  <li><Link to="/profile" className="text-white text-decoration-none">Mon Compte</Link></li>
                  <li><Link to="/cart" className="text-white text-decoration-none">Panier</Link></li>
                  <li><a href="#" onClick={logout} className="text-white text-decoration-none">Déconnexion</a></li>
                </>
              )}
            </ul>
          </div>
          <div className="col-md-3">
            <h6>Contact</h6>
            <ul className="list-unstyled">
              <li><i className="bi bi-geo-alt-fill me-2"></i> 123 Rue de l'Agence, Ville, Pays</li>
              <li><i className="bi bi-envelope-fill me-2"></i> contact@almaya.com</li>
              <li><i className="bi bi-phone-fill me-2"></i> +1 (234) 567-890</li>
            </ul>
          </div>
        </div>
        <hr className="my-3 border-white-50" />
        <div className="text-center text-muted">
          <p className="mb-0">&copy; 2025 Almaya. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;