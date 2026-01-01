// src/components/OffersPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import OfferCard from './OfferCard'; 
import { useAuth } from '../contexts/AuthContext'; 

const API_URL = 'http://localhost:3001'; 

const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [categorySlug, setCategorySlug] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Récupère l'ID de la catégorie depuis l'URL (via le paramètre 'category_id' de la route)
    const { category_id } = useParams(); 
    
    const { isAdmin, cart, addToCart, increaseQuantity, decreaseQuantity } = useAuth(); 

    const handleAddToCart = (offer) => {
        addToCart(offer);
        setMessage(`L'offre "${offer.title}" a été ajoutée au panier !`);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };
    
    // --- Fonction pour rafraîchir la liste après une action admin (Suppression) ---
    const fetchOffersAndCategory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // NOTE: On suppose que category_id est en réalité le SLUG de la catégorie pour les appels API
            const [offersResponse, categoryResponse] = await Promise.all([
                fetch(`${API_URL}/api/categories/${category_id}/offers`),
                fetch(`${API_URL}/api/categories/${category_id}`)
            ]);

            if (!offersResponse.ok || !categoryResponse.ok) {
                // Tente de récupérer le message d'erreur le plus pertinent
                const errorData = offersResponse.status !== 200 ? await offersResponse.json() : await categoryResponse.json();
                throw new Error(errorData.message || 'Erreur lors de la récupération des données.');
            }

            const offersData = await offersResponse.json();
            const categoryData = await categoryResponse.json();

            setOffers(offersData);
            setCategoryName(categoryData.name);
            setCategorySlug(categoryData.slug); // ✅ Le SLUG est bien récupéré ici
        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [category_id]); 

    useEffect(() => {
        if (category_id) {
            fetchOffersAndCategory();
        }
    }, [category_id, fetchOffersAndCategory]); 

    if (loading) {
        return <p className="text-center mt-5">Chargement des offres...</p>;
    }
    if (error) {
        return <p className="text-center mt-5 text-danger">Erreur: {error}</p>;
    }
    
    const successMessage = message && (
        <div className="container mt-3">
            <div className="alert alert-success alert-dismissible fade show" role="alert">
                {message}
                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" onClick={() => setMessage(null)}></button>
            </div>
        </div>
    );
    
    return (
        <div className="container py-5">
            {successMessage}
            
            <h1 className="text-center fw-bold mb-3">
                Découvrez nos offres pour : {categoryName}
            </h1>
            
            {/* ✅ ZONE ADMIN : Bouton Ajouter Offre (lié à la catégorie) */}
            {isAdmin && categorySlug && (
                <div className="text-center mb-4">
                    {/* Utilisation du categorySlug dans le chemin d'URL */}
                    <Link 
                        to={`/categories/${categorySlug}/admin/create-offer`} 
                        className="btn btn-warning me-3"
                    >
                        <i className="bi bi-plus-circle me-2"></i> Ajouter une offre dans {categoryName}
                    </Link>
                </div>
            )}
            
            <div className="row g-4">
                {offers.length > 0 ? (
                    offers.map(offer => {
                        const cartItem = cart.find(item => item.id === offer.id); 

                        return (
                            <div key={offer.id} className="col-md-6 col-lg-4">
                                <OfferCard
                                    // MODIFICATION CLÉ: Utilisation des props génériques
                                    item={offer}
                                    itemType="offer"
                                    
                                    cartItem={cartItem}
                                    increaseQuantity={increaseQuantity}
                                    decreaseQuantity={decreaseQuantity}
                                    handleAddToCart={handleAddToCart}
                                    isAdmin={isAdmin} 
                                    // MODIFICATION CLÉ: Passe la fonction de rafraîchissement au composant générique
                                    onItemDeleted={fetchOffersAndCategory} 
                                    
                                    // Le SLUG est toujours utile si OfferCard veut créer un lien d'édition spécifique
                                    categorySlug={categorySlug} 
                                />
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center w-100 mt-4 alert alert-info">
                        Aucune offre disponible pour cette catégorie dans les villes couvertes.
                    </p>
                )}
            </div>
            
            {/* Section "Découvrir nos autres services" */}
            <div className="d-flex justify-content-center mt-5">
                <Link to="/" className="btn btn-outline-secondary me-3">
                    <i className="bi bi-house-door-fill me-2"></i> Retour à l'accueil
                </Link>
                <Link to="/cart" className="btn btn-primary">
                    <i className="bi bi-basket-fill me-2"></i> Voir le panier
                </Link>
            </div>
        </div>
    );
};

export default OffersPage;