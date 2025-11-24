// src/components/OfferCard.js (Code mis à jour)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importation du vrai hook de contexte de panier (AuthContext.js)
import { useAuth } from '../contexts/AuthContext';

// MODIFICATION: Ajout de la prop 'isAdmin'
const OfferCard = ({ offer, cartItem, increaseQuantity, decreaseQuantity, isAdmin }) => {
    const [message, setMessage] = useState(null);
    const { addToCart } = useAuth(); 

    if (!offer) return null;

    // --- Fonction de suppression pour l'Admin ---
    const handleDeleteOffer = async (offerId, offerTitle) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'offre "${offerTitle}" ? Cette action est irréversible et nécessite le rôle Admin.`)) {
            return;
        }

        try {
            // Utilisation du endpoint DELETE protégé par authorizeRole(['admin'])
            const response = await fetch(`http://localhost:3001/api/admin/offers/${offerId}`, {
                method: 'DELETE',
                credentials: 'include', // Nécessaire pour envoyer le cookie JWT
            });

            if (response.ok) {
                alert(`Offre ${offerTitle} supprimée avec succès. Veuillez recharger la page pour mettre la liste à jour.`);
                // Note: La liste des offres doit être re-fetchee dans LocationOffersPage pour une mise à jour propre.
            } else if (response.status === 403) {
                 alert("Erreur: Vous n'avez pas la permission de supprimer cette offre.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la suppression de l\'offre.');
            }
        } catch (err) {
            console.error("Delete Error:", err);
            setMessage(`Erreur: ${err.message || "Problème lors de la suppression."}`);
            setTimeout(() => setMessage(null), 5000);
        }
    };
    
    
    // NOUVEAU : Fonction utilitaire pour gérer les actions du panier (pour encapsuler le scroll)
    const handleCartAction = (actionType, itemId, offerDetails = null) => {
        // 1. Sauvegarde la position de défilement (de la fenêtre, avant l'update)
        const currentScroll = window.scrollY;

        // 2. Exécute l'action de modification du panier
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

        // 3. Utilisez setTimeout pour restaurer le scroll LÉGÈREMENT après l'exécution synchrone
        setTimeout(() => {
            // Si la position a été perdue (i.e. est revenue à 0), restaurez-la
            if (window.scrollY < currentScroll) {
                window.scrollTo(0, currentScroll);
            }
        }, 0); 
    };

    // Détermine l'URL de l'image (ajustez si votre chemin d'image est différent)
    const imageUrl = offer.image ? `${offer.image}` : `https://placehold.co/400x250/505763/FFFFFF?text=${offer.title.substring(0, 15)}...`;

    // Formate le prix (en utilisant le DH comme devis, comme dans l'historique)
    const formattedPrice = offer.price
        ? `${offer.price} DH`
        : 'Prix sur demande';

    return (
        <div
            className="card h-100 shadow-sm border-0 offer-card-hover position-relative" // Ajout de position-relative
            style={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
            }}
        >
            
            {/* ✅ ZONE ADMIN : Boutons d'édition/suppression */}
            {isAdmin && (
                <div className="position-absolute top-0 end-0 p-2 z-1">
                    {/* Bouton Éditer (Redirige vers un formulaire d'édition) */}
                    <Link 
                        to={`/admin/offers/edit/${offer.id}`} 
                        className="btn btn-sm btn-info me-2 text-white"
                        title="Modifier l'offre"
                    >
                        <i className="bi bi-pencil"></i>
                    </Link>
                    {/* Bouton Supprimer */}
                    <button 
                        className="btn btn-sm btn-danger" 
                        title="Supprimer l'offre"
                        onClick={() => handleDeleteOffer(offer.id, offer.title)}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            )}
            {/* FIN ZONE ADMIN */}

            <img
                src={imageUrl}
                className="card-img-top"
                alt={offer.title}
                style={{ height: '200px', objectFit: 'cover' }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title fw-bold text-primary">{offer.title}</h5>

                {/* Affiche la catégorie si elle est disponible */}
                {offer.category_name && (
                    <p className="card-subtitle mb-2 text-muted small">
                        Catégorie : <Link to={`/categories/${offer.category_slug}`} className="text-decoration-none text-info fw-semibold">{offer.category_name}</Link>
                    </p>
                )}

                {/* Description avec limitation de hauteur */}
                <p className="card-text flex-grow-1 text-secondary" style={{ maxHeight: '4.5em', overflow: 'hidden' }}>
                    {offer.description || ''}
                </p>

                {/* Affichage des détails si disponibles */}
                <ul className="list-unstyled small mt-2 mb-3 text-dark">
                    {offer.location_name && <li><i className="bi bi-geo-alt me-2 text-info"></i> Lieu: **{offer.location_name}**</li>}
                    {offer.duration && <li><i className="bi bi-clock me-2 text-info"></i> Durée: {offer.duration}</li>}
                </ul>

                <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bolder fs-5 text-success">
                        {formattedPrice}
                    </span>

                    {/* Logique d'affichage conditionnelle du bouton MODIFIÉE */}
                    {cartItem ? (
                        // Affiche les boutons de quantité si l'article est dans le panier
                        <div className="d-flex align-items-center">
                            <button 
                                onClick={() => handleCartAction('decrease', cartItem.id)} // <-- Utilisation de handleCartAction
                                className="btn btn-sm btn-info me-2 text-white fw-bold shadow-sm"
                            >
                                -
                            </button>
                            <span className="fw-bold">
                                {cartItem.quantity}
                            </span>
                            <button 
                                onClick={() => handleCartAction('increase', cartItem.id)} // <-- Utilisation de handleCartAction
                                className="btn btn-sm btn-info ms-2 text-white fw-bold shadow-sm"
                            >
                                +
                            </button>
                            <Link to="/cart" className="btn btn-success ms-3 fw-bold shadow-sm">
                                <i className="bi bi-cart-check-fill me-1"></i> 
                            </Link>
                        </div>
                    ) : (
                        // Affiche le bouton "Ajouter au panier"
                        <button
                            onClick={() => handleCartAction('add', null, offer)} // <-- Utilisation de handleCartAction
                            className="btn btn-warning mt-auto fw-bold shadow-sm"
                        >
                            <i className="bi bi-cart-plus-fill me-2"></i>
                            Ajouter au panier
                        </button>
                    )}
                </div>

                {/* Affichage d'une information sur le prix s'il existe des détails supplémentaires */}
                {offer.infos_price && (
                    <div className="text-muted small mt-1 text-end">
                        <i className="bi bi-info-circle me-1"></i> {offer.infos_price}
                    </div>
                )}
            </div>
            {/* Affichage du message d'ajout au panier */}
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