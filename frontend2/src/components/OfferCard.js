import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// Importation du vrai hook de contexte de panier (AuthContext.js)
// Ajout de increaseQuantity et decreaseQuantity au destructuring
import { useAuth } from '../contexts/AuthContext';

// Les props doivent inclure increaseQuantity et decreaseQuantity (passées par LocationOffersPage)
const OfferCard = ({ offer, cartItem, increaseQuantity, decreaseQuantity }) => {
    // 1. Définition des états locaux
    const [message, setMessage] = useState(null);

    // 2. Utilisation du contexte pour les fonctions de panier
    // Récupération de addToCart, increaseQuantity et decreaseQuantity du contexte
    const { addToCart } = useAuth(); // Note: decrease/increase are also passed as props from parent for this component

    // Vérifiez que l'objet 'offer' est bien passé
    if (!offer) return null;

    // 3. Définition de la fonction locale handleAddToCart
    const handleAddToCart = (offer) => {
        // Appelle la fonction addToCart du Contexte Global
        addToCart(offer);
        setMessage(`L'offre "${offer.title}" a été ajoutée au panier !`);

        // Efface le message après 3 secondes
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };


    // Détermine l'URL de l'image (ajustez si votre chemin d'image est différent)
    const imageUrl = offer.image ? `/assets/images/${offer.image}` : `https://placehold.co/400x250/505763/FFFFFF?text=${offer.title.substring(0, 15)}...`;

    // Formate le prix (en utilisant le DH comme devis, comme dans l'historique)
    const formattedPrice = offer.price
        ? `${offer.price} DH`
        : 'Prix sur demande';

    return (
        <div
            className="card h-100 shadow-sm border-0 offer-card-hover"
            style={{
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
            }}
        >
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
                    {offer.description || 'Pas de description disponible.'}
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
                             <Link to="/cart" className="btn btn-success ms-3 fw-bold shadow-sm">
                                <i className="bi bi-cart-check-fill me-1"></i> 
                            </Link>
                        </div>
                    ) : (
                        // Affiche le bouton "Ajouter au panier"
                        <button
                            onClick={() => handleAddToCart(offer)}
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