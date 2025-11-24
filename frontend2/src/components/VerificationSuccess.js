import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const VerificationSuccess = () => {
    const navigate = useNavigate();

    // Optionnel: Rediriger automatiquement après quelques secondes
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 8000); // Redirige après 8 secondes

        return () => clearTimeout(timer); // Nettoyage du timer
    }, [navigate]);

    return (
        <div className="container py-5 text-center" style={{ maxWidth: '600px' }}>
            <div className="card p-5 shadow-lg border-success">
                
                {/* Icône de succès */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="60" 
                    height="60" 
                    fill="#198754" 
                    className="bi bi-check-circle-fill mx-auto mb-4" 
                    viewBox="0 0 16 16"
                >
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.423 5.384 7.33a.75.75 0 1 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>

                <h1 className="text-success mb-3">Vérification Réussie !</h1>
                
                <p className="lead">
                    Félicitations ! Votre compte est maintenant activé.
                </p>
                <p className="text-muted">
                    Vous pouvez maintenant vous connecter et accéder à toutes les fonctionnalités d'ALMAYA SERVICES.
                </p>

                <Link to="/login" className="btn btn-success mt-4">
                    Se connecter
                </Link>

                <small className="mt-3 text-secondary">
                    Vous serez redirigé automatiquement dans quelques secondes.
                </small>
            </div>
        </div>
    );
};

export default VerificationSuccess;