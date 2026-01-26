// src/components/OfferCard.js (Code mis à jour et rendu générique)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// MODIFICATION:
// - Désactivation des boutons Admin si itemType === 'offer'.
const OfferCard = ({ 
    item: offer, // On renomme l'élément 'offer' en 'item' pour la lisibilité
    itemType = 'offer', 
    cartItem, 
    increaseQuantity, 
    decreaseQuantity, 
    isAdmin,
    onItemDeleted 
}) => {
    const [message, setMessage] = useState(null);
    const { addToCart } = useAuth(); 

    if (!offer) return null;

    // --- Fonction de suppression générique pour l'Admin ---
    const handleDeleteItem = async () => {
        const itemId = offer.id;
        const itemTitle = offer.title || offer.name || `l'élément #${itemId}`;

        // Laisse cette fonction comme support pour les suppressions de catégorie/destination
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${itemTitle} (${itemType}) ? Cette action est irréversible et nécessite le rôle Admin.`)) {
            return;
        }

        try {
            // URL de l'API construite dynamiquement
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
            let apiUrl = '';
            
            if (itemType === 'offer') {
                apiUrl = `${API_URL}/api/admin/offers/${itemId}`;
            } else if (itemType === 'location') {
                 // Supposons que les destinations utilisent le slug pour la suppression (si l'API le permet)
                apiUrl = `${API_URL}/api/admin/locations/${offer.slug}`;
            } else if (itemType === 'category') {
                // Supposons que les catégories utilisent le slug pour la suppression
                apiUrl = `${API_URL}/api/admin/categories/${offer.slug}`;
            } else {
                 throw new Error("Type d'élément inconnu pour la suppression.");
            }

            const response = await fetch(apiUrl, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert(`${itemTitle} supprimé(e) avec succès.`);
                if (onItemDeleted) {
                    onItemDeleted(); // Rafraîchit la liste parente
                }
            } else if (response.status === 403) {
                 alert("Erreur: Vous n'avez pas la permission de supprimer cet élément.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la suppression de l\'élément.');
            }
        } catch (err) {
            console.error("Delete Error:", err);
            setMessage(`Erreur: ${err.message || "Problème lors de la suppression."}`);
            setTimeout(() => setMessage(null), 5000);
        }
    };
    
    // NOUVEAU : Construction de l'URL d'édition basée sur le type
    const getEditLink = () => {
        if (itemType === 'offer') {
            // Utilise l'ID pour l'édition d'offre générique
            return `/admin/offers/edit/${offer.id}`;
        } else if (itemType === 'location') {
            // Utilise le slug pour l'édition de destination
            return `/admin/locations/edit/${offer.slug}`;
        } else if (itemType === 'category') {
            // Utilise le slug pour l'édition de catégorie
            return `/admin/categories/edit/${offer.slug}`;
        }
        return '#'; 
    };
    
    // --- Fonction utilitaire pour gérer les actions du panier (Inchangée) ---
    const handleCartAction = (actionType, itemId, offerDetails = null) => {
        const currentScroll = window.scrollY;

        switch (actionType) {
            case 'add':
                addToCart(offerDetails);
                setMessage(`L'offre "${offerDetails.title}" a été ajoutée au panier !`);
                setTimeout(() => setMessage(null), 3000);
                break;
            case 'increase':
                increaseQuantity(itemId);
                break;
            case 'decrease':
                decreaseQuantity(itemId);
                break;
            default:
                break;
        }

        setTimeout(() => {
            if (window.scrollY < currentScroll) {
                window.scrollTo(0, currentScroll);
            }
        }, 0); 
    };

    // Détermine l'URL de l'image (utilise 'image' ou un placeholder)
    const imageUrl = offer.image 
        ? `${offer.image}` 
        : `https://placehold.co/400x250/505763/FFFFFF?text=${(offer.title || offer.name || 'Image').substring(0, 15)}...`;

    // Formate le prix (spécifique aux offres)
    const formattedPrice = offer.price
        ? `${offer.price} DH`
        : 'Prix sur demande';

    // Rendu conditionnel des boutons admin
    // MODIFICATION CLÉ ICI: N'affiche les boutons que si l'utilisateur est Admin ET que ce N'EST PAS une offre.
    const adminButtons = (isAdmin && itemType !== 'offer') && (
        <div className="position-absolute top-0 end-0 p-2 z-1">
            {/* Bouton Éditer */}
            <Link 
                to={getEditLink()} 
                className="btn btn-sm btn-info me-2 text-white"
                title={`Modifier l'élément (${itemType})`}
            >
                <i className="bi bi-pencil"></i>
            </Link>
            {/* Bouton Supprimer */}
            <button 
                className="btn btn-sm btn-danger" 
                title={`Supprimer l'élément (${itemType})`}
                onClick={handleDeleteItem}
            >
                <i className="bi bi-trash"></i>
            </button>
        </div>
    );
    
    // Rendu minimal si ce n'est pas une offre (pour éviter les erreurs de props manquantes comme 'price')
    const isOffer = itemType === 'offer';
    const primaryTitle = offer.title || offer.name || 'Détail';
    
    return (
        <div
            className="card h-100 shadow-sm border-0 offer-card-hover position-relative"
            style={{ transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}
        >
            
            {/* Boutons Admin : Ne s'affiche plus pour les offres */}
            {adminButtons} 

            <img
                src={imageUrl}
                className="card-img-top"
                alt={primaryTitle}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-primary">{primaryTitle}</h5>
                
                {/* Contenu spécifique aux Offres */}
                {isOffer ? (
                    <>
                        {offer.category_name && (
                            <p className="card-subtitle mb-2 text-muted small">
                                Catégorie : <Link to={`/categories/${offer.category_slug}`} className="text-decoration-none text-info fw-semibold">{offer.category_name}</Link>
                            </p>
                        )}
                        <p className="card-text flex-grow-1 text-secondary" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
                            {offer.description || ''}
                        </p>
                        <ul className="list-unstyled small mt-2 mb-3 text-dark">
                            {offer.location_name && <li><i className="bi bi-geo-alt me-2 text-info"></i> Lieu: **{offer.location_name}**</li>}
                            {offer.duration && <li><i className="bi bi-clock me-2 text-info"></i> Durée: {offer.duration}</li>}
                        </ul>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                            <span className="fw-bolder fs-5 text-success">
                                {formattedPrice}
                            </span>

                            {/* Logique du Panier (uniquement pour les offres) */}
                            {cartItem ? (
                                <div className="d-flex align-items-center">
                                    <button onClick={() => handleCartAction('decrease', cartItem.id)} className="btn btn-sm btn-info me-2 text-white fw-bold shadow-sm">-</button>
                                    <span className="fw-bold">{cartItem.quantity}</span>
                                    <button onClick={() => handleCartAction('increase', cartItem.id)} className="btn btn-sm btn-info ms-2 text-white fw-bold shadow-sm">+</button>
                                    <Link to="/cart" className="btn btn-success ms-3 fw-bold shadow-sm"><i className="bi bi-cart-check-fill me-1"></i></Link>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCartAction('add', null, offer)}
                                    className="btn btn-warning mt-auto fw-bold shadow-sm"
                                >
                                    <i className="bi bi-cart-plus-fill me-2"></i> Ajouter au panier
                                </button>
                            )}
                        </div>
                        {offer.infos_price && (
                            <div className="text-muted small mt-1 text-end">
                                <i className="bi bi-info-circle me-1"></i> {offer.infos_price}
                            </div>
                        )}
                    </>
                ) : (
                    // Contenu minimal pour les autres types (catégories, destinations)
                    <p className="card-text text-secondary">{offer.description || offer.region || 'Aucune description disponible.'}</p>
                )}
            </div>
            {/* Affichage du message */}
            {message && (
                <div
                    className="alert alert-success position-absolute bottom-0 start-50 translate-middle-x fw-bold shadow-lg"
                    style={{ zIndex: 1000, width: '90%', bottom: '15px' }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default OfferCard;