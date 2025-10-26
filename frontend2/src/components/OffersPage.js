// src/components/OffersPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// ASSUMPTION: increaseQuantity and decreaseQuantity are available from useAuth
import { useAuth } from '../contexts/AuthContext'; 

// Assurez-vous que cette page est bien routée dans App.js avec un path comme /categories/:category_id
const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Récupération du slug de la catégorie dans l'URL (e.g., 'guide-touristique' ou 'activites')
    const { category_id } = useParams(); 

    // Accès aux fonctions du panier via useAuth
    // NOTE: Ajout de increaseQuantity et decreaseQuantity ici (supposées disponibles)
    const { cart, addToCart, increaseQuantity, decreaseQuantity } = useAuth(); 

    const handleAddToCart = (offer) => {
        // Ajoute l'offre avec une quantité de 1 par défaut, ou augmente la quantité si elle existe déjà
        addToCart(offer);
        setMessage(`L'offre "${offer.title}" a été ajoutée au panier !`);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    useEffect(() => {
        const fetchOffersAndCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                // NOTE IMPORTANTE: L'API doit être configurée pour accepter les slugs (ex: activites)
                // et retourner les données des offres (incluant la location_name) et de la catégorie.
                const [offersResponse, categoryResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/categories/${category_id}/offers`),
                    fetch(`http://localhost:3001/api/categories/${category_id}`)
                ]);

                if (!offersResponse.ok || !categoryResponse.ok) {
                    throw new Error('Erreur lors de la récupération des données. Vérifiez l\'API.');
                }

                const offersData = await offersResponse.json();
                const categoryData = await categoryResponse.json();

                setOffers(offersData);
                setCategoryName(categoryData.name);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffersAndCategory();
    }, [category_id]); // Re-fetch quand l'ID de la catégorie change

    if (loading) {
        return <p className="text-center mt-5">Chargement des offres...</p>;
    }
    if (error) {
        return <p className="text-center mt-5 text-danger">Erreur: {error}</p>;
    }
    
    // Affichage d'un message temporaire de succès
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
            
            <h1 className="text-center fw-bold mb-5">
                Découvrez nos offres pour : {categoryName}
            </h1>

            <div className="row g-4">
                {offers.length > 0 ? (
                    offers.map(offer => {
                        // Chercher l'offre dans le panier pour déterminer le rendu du bouton
                        const cartItem = cart.find(item => item.id === offer.id); 

                        return (
                            <div key={offer.id} className="col-md-6 col-lg-4">
                                <div className="card h-100 shadow-sm border-0 hover-shadow-lg">
                                    <img
                                        src={offer.image || '/path/to/default-image.jpg'} // Chemin d'image par défaut
                                        className="card-img-top"
                                        alt={offer.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title fw-bold text-primary">{offer.title}</h5>
                                        
                                        {/* Afficher la ville si disponible (suppose que l'API renvoie offer.location_name) */}
                                        {offer.location_name && (
                                            <p className="card-subtitle text-muted mb-2">
                                                <i className="bi bi-pin-map-fill me-1"></i> {offer.location_name}
                                            </p>
                                        )}

                                        <p className="card-text text-muted flex-grow-1">{offer.description || 'Description non disponible.'}</p>
                                        
                                        {/* Afficher la durée si disponible */}
                                        {offer.duration && (
                                            <p className="card-text small text-secondary">
                                                <i className="bi bi-clock-fill me-1"></i> Durée: {offer.duration}
                                            </p>
                                        )}

                                        {/* Utilisation de offer.infos_price selon votre schéma SQL */}
                                        <p className="card-text fw-bold fs-4 text-danger mt-2">
                                            {offer.price ? `${offer.price} €` : 'Prix sur demande'} 
                                            {offer.infos_price && <span className="small text-muted ms-1">{offer.infos_price}</span>}
                                        </p>
                                        
                                        {cartItem ? (
                                            <div className="d-flex justify-content-center align-items-center mt-auto">
                                                <button 
                                                    onClick={() => decreaseQuantity(cartItem.id)} 
                                                    className="btn btn-sm btn-info me-2 text-white fw-bold shadow-sm"
                                                >
                                                    -
                                                </button>
                                                <span className="fw-bold">
                                                    {cartItem.quantity}
                                                </span>
                                                <button 
                                                    onClick={() => increaseQuantity(cartItem.id)} 
                                                    className="btn btn-sm btn-info ms-2 text-white fw-bold shadow-sm"
                                                >
                                                    +
                                                </button>
                                                <Link to="/cart" className="btn btn-success ms-3">
                                                    <i className="bi bi-cart-check-fill me-1"></i> Voir Panier
                                                </Link>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(offer)}
                                                className="btn btn-warning mt-auto fw-bold"
                                            >
                                                <i className="bi bi-cart-plus-fill me-2"></i> 
                                                Ajouter au panier
                                            </button>
                                        )}
                                    </div>
                                </div>
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