// src/components/Footer.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook
import { Link } from 'react-router-dom'; // Import Link for navigation

// Définition d'une classe pour le survol bleu (à ajouter dans index.css)
// .hover-link-info:hover { color: var(--almaya-blue-secondary) !important; }

const Footer = () => {
    const { user, logout } = useAuth(); // Access user state and logout function

    return (
        // bg-dark et py-4 (padding vertical) sont standards
        <footer className="bg-dark text-white py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 mb-4 mb-md-0">
                        {/* Titre de marque en Orange ALMAYA (text-primary) */}
                        <h5 className="text-primary fw-bold">ALMAYA SERVICES</h5>
                        <p className="text-white opacity-75">TRAVEL : Votre partenaire de croissance.</p>
                        {/* Optionnel : Icônes sociales en Orange */}
                        <div className="mt-3">
                            <a href="https://www.instagram.com/almaya_services?igsh=OXo2NHMza2M0anA1" className="text-primary me-3 fs-4"><i className="bi bi-instagram"></i></a>
                            <a href="https://snapchat.com/t/9WpEITHG " className="text-primary me-3 fs-4"><i className="bi bi-snapchat"></i></a>
                        </div>
                    </div>
                    
                    <div className="col-md-3 mb-4 mb-md-0">
                        <h6>Navigation</h6>
                        <ul className="list-unstyled">
                            {/* Liens pour les visiteurs non connectés */}
                            {!user && (
                                <>
                                    <li><Link to="/login" className="text-white text-decoration-none hover-link-info">Connexion</Link></li>
                                    <li><Link to="/register" className="text-white text-decoration-none hover-link-info">Inscription</Link></li>
                                    <li><a href="#about" className="text-white text-decoration-none hover-link-info">À Propos</a></li>
                                    <li><a href="#contact" className="text-white text-decoration-none hover-link-info">Contact</a></li>
                                </>
                            )}
                            {/* Liens pour l'utilisateur connecté */}
                            {user && (
                                <>
                                    <li><Link to="/profile" className="text-white text-decoration-none hover-link-info">Mon Compte</Link></li>
                                    <li><Link to="/cart" className="text-white text-decoration-none hover-link-info">Panier</Link></li>
                                    <li><a href="#" onClick={logout} className="text-white text-decoration-none hover-link-info">Déconnexion</a></li>
                                </>
                            )}
                        </ul>
                    </div>
                    
                    <div className="col-md-3">
                        <h6>Contact</h6>
                        <ul className="list-unstyled">
                            {/* EMAIL CLICQUABLE (mailto:) */}
                            <li>
                                <a href="mailto:almayaservices@gmail.com" className="text-white text-decoration-none hover-link-info d-flex align-items-center">
                                    <i className="bi bi-envelope-fill text-info me-2"></i> 
                                    almayaservices@gmail.com
                                </a>
                            </li>
                            {/* NUMÉRO CLICQUABLE (tel:) */}
                            <li>
                                <a href="tel:+212690002284" className="text-white text-decoration-none hover-link-info d-flex align-items-center">
                                    <i className="bi bi-phone-fill text-info me-2"></i> 
                                    +212 690002284
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {/* Ligne de séparation plus claire */}
                <hr className="my-4 border-secondary opacity-25" /> 
                
                {/* Copyright en gris discret */}
                <div className="text-center text-muted">
                    <p className="mb-0">&copy; 2025 Almaya. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;