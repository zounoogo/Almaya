// src/components/HeroSection.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const { user, logout } = useAuth();

    return (
        // Utilise bg-primary (Orange ALMAYA) et text-white pour un header de marque
        <header className="container-fluid bg-primary text-white py-3 shadow-sm">
            <div className="container">
                <nav className="d-flex justify-content-between align-items-center">
                    
                    {/* Brand/Logo Link (ALMAYA SERVICES TRAVEL) */}
                    <div className="d-flex align-items-center">
                        <Link to="/" className="text-white text-decoration-none me-4">
                            {/* ALMAYA SERVICES en Orange/Blanc, TRAVEL en Bleu pour l'accent */}
                            <span className="h4 fw-bold mb-0">ALMAYA SERVICES</span>
                            {/* Le texte-info est le Bleu ALMAYA surchargé */}
                            <span className="small d-block text-info">TRAVEL</span> 
                        </Link>
                        
                        {/* Main Navigation Links */}
                        <ul className="list-unstyled d-flex gap-4 mb-0 d-none d-md-flex">
                            <li>
                                <Link to="/" className="text-white text-decoration-none opacity-75 hover-opacity-100">
                                    Accueil
                                </Link>
                            </li>
                            <li>
                                <Link to="/locations" className="text-white text-decoration-none opacity-75 hover-opacity-100">
                                    Destinations
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* User Info & Actions Section */}
                    <div className="d-flex align-items-center gap-3">
                        {user ? (
                            <>
                                {/* Panier Link - Icône blanche sur fond orange */}
                                <Link to="/cart" className="text-white text-decoration-none" title="Panier">
                                    <i className="bi bi-cart-fill fs-5"></i> 
                                </Link>
                                
                                {/* Profile Link - Texte blanc sur fond orange */}
                                <Link to="/profile" className="text-white text-decoration-none fw-bold">
                                    <i className="bi bi-person-circle me-1"></i> {user.username}
                                </Link>

                                {/* Déconnexion Button - Utilise btn-info (Bleu ALMAYA) pour l'action */}
                                <button onClick={logout} className="btn btn-sm btn-info text-white fw-bold">
                                    Déconnexion
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Boutons de Connexion/Inscription */}
                                <Link to="/login" className="btn btn-sm btn-outline-light me-2">
                                    Connexion
                                </Link>
                                {/* btn-light (blanc) avec text-primary (Orange ALMAYA) */}
                                <Link to="/register" className="btn btn-sm btn-light text-primary fw-bold"> 
                                    Inscription 
                                </Link>
                            </>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default HeroSection;