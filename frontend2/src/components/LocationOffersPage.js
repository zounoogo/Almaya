// src/components/LocationOffersPages
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom'; // Import de Link et useNavigate
import OfferCard from './OfferCard'; // Assurez-vous d'avoir un composant OfferCard pour l'affichage
import { useAuth } from '../contexts/AuthContext'; 

const LocationOffersPage = () => {
    // Hook pour la navigation programmatique (Retour en arrière)
    const navigate = useNavigate();
    
    // Accès aux fonctions et données du panier via useAuth
    const { 
        cart, 
        addToCart, 
        increaseQuantity, 
        decreaseQuantity // Fonctions nécessaires pour les boutons + et -
    } = useAuth();
    
    // Récupère le slug de la destination depuis l'URL (ex: 'marrakech')
    const { location_slug } = useParams(); 
    
    const [offers, setOffers] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction de retour en arrière (vers la liste des destinations)
    const handleGoBack = () => {
        // Redirige vers la route /locations (la liste des destinations)
        navigate('/locations'); 
    };
    
    // NOTE: handleAddToCart n'est plus utilisé ici car l'OfferCard gère l'ajout/modification du panier.
    // L'OfferCard utilise ses propres props increase/decreaseQuantity et addToCart du useAuth.

    useEffect(() => {
        const fetchLocationData = async () => {
            setLoading(true);
            setError(null);
            
            try {
                // 1. Récupérer le nom complet de la destination
                const nameResponse = await fetch(`http://localhost:3001/api/locations/${location_slug}`);
                if (!nameResponse.ok) {
                    throw new Error("Destination non trouvée (404)");
                }
                const locationData = await nameResponse.json();
                setLocationName(locationData.name);

                // 2. Récupérer les offres spécifiques à cette destination
                const offersResponse = await fetch(`http://localhost:3001/api/locations/${location_slug}/offers`);
                if (!offersResponse.ok) {
                    throw new Error("Erreur lors de la récupération des offres.");
                }
                const offersData = await offersResponse.json();
                setOffers(offersData);

            } catch (err) {
                console.error("Erreur de chargement:", err);
                // Si l'erreur est liée à une destination non trouvée
                if (err.message.includes("404")) {
                     setError(`La destination "${location_slug}" n'existe pas ou n'a pas d'offres.`);
                } else {
                     setError("Impossible de charger les activités. Vérifiez la connexion API.");
                }
            } finally {
                setLoading(false);
            }
        };

        if (location_slug) {
            fetchLocationData();
        }
    }, [location_slug]); // Re-déclenchement si le slug change

    if (loading) {
        return <div className="container py-5 text-center"><p>Chargement des activités pour {location_slug}...</p></div>;
    }

    if (error) {
        return <div className="container py-5 text-center text-danger"><p>Erreur: {error}</p></div>;
    }

    // Le titre utilise le nom complet de la ville récupéré
    const title = locationName ? `Activités à ${locationName}` : 'Activités par Destination';

    return (
        <div className="container py-5">
            <h1 className="text-center fw-bold mb-5">{title}</h1>
            
            {offers.length === 0 ? (
                <div className="alert alert-info text-center">
                    Désolé, aucune activité n'est actuellement disponible pour **{locationName}**.
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
                    {offers.map((offer) => {
                        // Chercher l'offre dans le panier
                        const cartItem = cart.find(item => item.id === offer.id); 

                        return (
                            <div key={offer.id} className="col">
                                {/* OfferCard est responsable du rendu complet des boutons. 
                                    Nous lui repassons toutes les fonctions nécessaires.
                                */}
                                <OfferCard 
                                    offer={offer}
                                    cartItem={cartItem} 
                                    increaseQuantity={increaseQuantity} // Re-passer les fonctions au composant enfant
                                    decreaseQuantity={decreaseQuantity} // Re-passer les fonctions au composant enfant
                                />
                                
                                {/* *** LA LOGIQUE DUPLIQUÉE A ÉTÉ RETIRÉE D'ICI ***
                                    Elle doit résider uniquement dans OfferCard.js 
                                */}

                            </div>
                        )
                    })}
                </div>
            )}

            {/* Section des boutons de navigation en bas */}
            <div className="d-flex justify-content-center mt-5">
                <button
                    onClick={handleGoBack}
                    className="btn btn-outline-secondary me-3"
                >
                    <i className="bi bi-arrow-left me-2"></i> Retour (Voir les destinations)
                </button>
                <Link to="/cart" className="btn btn-primary">
                    <i className="bi bi-basket-fill me-2"></i> Voir le panier
                </Link>
            </div>
        </div>
    );
};

export default LocationOffersPage;