// src/components/LocationOffersPage.js
import React, { useState, useEffect, useCallback } from 'react'; // ✅ Ajout de useCallback
import { useParams, Link, useNavigate } from 'react-router-dom'; 
import OfferCard from './OfferCard'; 
import { useAuth } from '../contexts/AuthContext'; 

const LocationOffersPage = () => {
    // Hook pour la navigation programmatique (Retour en arrière)
    const navigate = useNavigate();
    
    // Accès aux fonctions, données du panier et statut Admin via useAuth
    const { 
        isAdmin, // Statut Admin
        cart, 
        // addToCart est retiré de la déstructuration pour corriger l'avertissement ESLint
        increaseQuantity, 
        decreaseQuantity 
    } = useAuth();
    
    // Récupère le slug de la destination depuis l'URL (ex: 'marrakech')
    const { location_slug } = useParams(); 
    
    const [offers, setOffers] = useState([]);
    const [locationName, setLocationName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction de retour en arrière (vers la liste des destinations)
    const handleGoBack = () => {
        navigate('/locations'); 
    };

    // ✅ NOUVEAU : Stabilisation de fetchLocationData avec useCallback
    const fetchLocationData = useCallback(async () => {
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
            if (err.message.includes("404")) {
                 setError(`La destination "${location_slug}" n'existe pas ou n'a pas d'offres.`);
            } else {
                 setError("Impossible de charger les activités. Vérifiez la connexion API.");
            }
        } finally {
            setLoading(false);
        }
    }, [location_slug]); // fetchLocationData ne change que si location_slug change.


    useEffect(() => { // ✅ Ligne 71 de l'avertissement d'origine
        if (location_slug) {
            fetchLocationData();
        }
    }, [location_slug, fetchLocationData]); // ✅ fetchLocationData est maintenant dans les dépendances

    if (loading) {
        return <div className="container py-5 text-center"><p>Chargement des activités pour {location_slug}...</p></div>;
    }

    if (error) {
        return <div className="container py-5 text-center text-danger"><p>Erreur: {error}</p></div>;
    }

    const title = locationName ? `Activités à ${locationName}` : 'Activités par Destination';

    return (
        <div className="container py-5">
            <h1 className="text-center fw-bold mb-3">{title}</h1>
            
            {/* BOUTON AJOUTER UNE OFFRE - Visible seulement par l'admin */}
            {isAdmin && (
                <div className="text-center mb-5">
                    {/* Le lien vers la création d'offre devrait préremplir la destination */}
                    <Link to={`/admin/offers/create?location=${location_slug}`} className="btn btn-warning">
                        <i className="bi bi-plus-circle me-2"></i> Ajouter une offre à {locationName}
                    </Link>
                </div>
            )}

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
                                <OfferCard 
                                    offer={offer}
                                    cartItem={cartItem} 
                                    increaseQuantity={increaseQuantity} 
                                    decreaseQuantity={decreaseQuantity} 
                                    // Passer le statut Admin à l'OfferCard
                                    isAdmin={isAdmin}
                                    // Optionnel : Passer fetchLocationData pour rafraîchir après une suppression
                                    onOfferDeleted={fetchLocationData} 
                                />
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