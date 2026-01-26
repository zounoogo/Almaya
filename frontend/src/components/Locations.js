// src/components/Locations.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; 

const Locations = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAdmin } = useAuth(); 

    // --- Fonction de suppression pour l'Admin ---
    const handleDeleteLocation = async (locationSlug, locationName) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la destination "${locationName}" ? Cette action est irréversible.`)) {
            return;
        }

        try {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            const response = await fetch(`${API_URL}/api/admin/locations/${locationSlug}`, {
                method: 'DELETE',
                credentials: 'include', 
            });

            if (response.ok) {
                setLocations(prev => prev.filter(loc => loc.slug !== locationSlug));
                alert(`Destination ${locationName} supprimée !`);
            } else if (response.status === 403) {
                 alert("Erreur: Vous n'avez pas la permission de supprimer cette destination.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la suppression.');
            }
        } catch (err) {
            console.error("Delete Error:", err);
            setError(err.message || "Erreur lors de la suppression de la destination.");
        }
    };


    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/api/locations`);
                
                if (!response.ok) {
                    throw new Error('Erreur de réseau ou de serveur lors du chargement des destinations.');
                }

                const data = await response.json();
                setLocations(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Impossible de charger les destinations. Vérifiez la connexion API et le serveur.");
            } finally {
                setLoading(false);
            }
        };

        fetchLocations();
    }, []); 

    if (loading) {
        return <div className="text-center py-5"><p>Chargement des destinations...</p></div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger"><p>Erreur: {error}</p></div>;
    }
    
    if (locations.length === 0) {
        return (
            <div className="text-center py-5">
                <p>Aucune destination n'est disponible pour l'instant.</p>
                {isAdmin && (
                    <Link to="/admin/locations/create" className="btn btn-success mt-3">
                        <i className="bi bi-plus-circle me-2"></i> Ajouter une Nouvelle Destination
                    </Link>
                )}
            </div>
        );
    }

    return (
        <div id="locations" className="container py-5">
            <h2 className="text-center fw-bold mb-5">Explorez nos Destinations</h2>
            
            {/* BOUTON AJOUTER UNE DESTINATION - Visible seulement par l'admin */}
            {isAdmin && (
                <div className="text-center mb-5">
                    <Link to="/admin/locations/create" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2"></i> Ajouter une Nouvelle Destination
                    </Link>
                </div>
            )}
            
            <div className="row g-4 justify-content-center">
                {locations.map((location) => (
                    <div key={location.id} className="col-6 col-md-4 col-lg-3 text-center">
                        <Link to={`/locations/${location.slug}`} className="text-decoration-none text-dark">
                            <div className="card h-100 p-2 shadow-sm border-0 hover-shadow-lg transition-300ms overflow-hidden position-relative">
                                
                                {/* BOUTONS ADMIN SUR LA CARTE */}
                                {isAdmin && (
                                    <div className="position-absolute top-0 end-0 p-2 z-1">
                                        {/* Bouton Éditer */}
                                        <Link 
                                            to={`/admin/locations/edit/${location.slug}`} 
                                            className="btn btn-sm btn-primary me-2"
                                            onClick={(e) => e.stopPropagation()} 
                                        >
                                            <i className="bi bi-pencil"></i>
                                        </Link>
                                        {/* Bouton Supprimer */}
                                        <button 
                                            className="btn btn-sm btn-danger" 
                                            onClick={(e) => { 
                                                e.preventDefault(); 
                                                e.stopPropagation(); 
                                                handleDeleteLocation(location.slug, location.name); 
                                            }}
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </div>
                                )}

                                {/* AFFICHAGE CORRIGÉ DE L'IMAGE AVEC FALLBACK */}
                                {location.image ? ( // Si location.image existe (URL valide)
                                    <img 
                                        src={location.image} 
                                        alt={`Vue de ${location.name}`} 
                                        className="img-fluid rounded mb-3" 
                                        style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                                    />
                                ) : ( // Sinon (NULL ou vide), affiche le fallback de l'icône
                                    <div className="d-flex justify-content-center align-items-center mb-3 bg-light rounded" style={{ height: '150px' }}>
                                        <i className="bi bi-geo-alt-fill text-primary display-6"></i>
                                    </div>
                                )}

                                <h3 className="h6 fw-bold mb-0 mt-2">{location.name}</h3>
                                {location.region && <small className="text-muted">{location.region}</small>}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default React.memo(Locations);