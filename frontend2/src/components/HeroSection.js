// src/components/HeroSection.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { user, logout } = useAuth(); // Access user and logout function

  return (
    <div className="container-fluid bg-primary text-white text-center py-5 position-relative">
      {/* User Info Section (Top-Right) */}
      {user && (
        <div className="position-absolute top-0 end-0 p-3">
          <h5 className="mb-2">{user.username}</h5>
          <ul className="list-unstyled d-flex gap-3">
            <li>
              <Link to="/profile" className="text-white text-decoration-none">
                Mon Compte
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-white text-decoration-none">
                Panier
              </Link>
            </li>
            <li>
              <button onClick={logout} className="btn btn-link text-white text-decoration-none p-0">
                Déconnexion
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Hero Content Section (Center) */}
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <h1 className="display-3 fw-bold mb-3">
            Almaya : Des services qui font grandir votre entreprise.
          </h1>
          <p className="lead mb-4">
            Nous offrons des solutions sur mesure en marketing, design et gestion pour les entrepreneurs et les PME.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;