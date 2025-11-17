import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// IMPORTANT : Ce composant suppose que les fonctions increaseQuantity, 
// decreaseQuantity, et removeItem sont maintenant fournies par useAuth 
// et qu'elles gèrent elles-mêmes l'appel à l'API de synchronisation.

const Cart = () => {
    // Le numéro de téléphone de destination WhatsApp
    const WHATSAPP_NUMBER = "212658810471";
    
    // Récupération des fonctions du panier et de l'état du panier depuis le contexte
    const { 
        cart, 
        increaseQuantity, 
        decreaseQuantity, 
        // Ajout de removeItem à la déstructuration
        removeItem: removeCartItem 
    } = useAuth(); 
    
    const navigate = useNavigate();

    // État pour afficher un message d'erreur custom si le panier est vide au moment du paiement
    const [showCheckoutError, setShowCheckoutError] = React.useState(false);

    // Calcul du total du panier
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Fonction pour gérer le retour en arrière, quelle que soit la page d'origine
    const handleGoBack = () => {
        navigate(-1); // Simule le bouton "Précédent" du navigateur
    };

    // NOUVELLE FONCTION de COMMANDE WHATSAPP
    const handleCheckout = () => {
        if (cart.length === 0) {
            setShowCheckoutError(true);
            return;
        }
        
        setShowCheckoutError(false);

        // 1. Construire le message à envoyer
        let message = `Bonjour, je souhaite passer la commande suivante :\n\n`;
        
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (x${item.quantity})}\n`;
        });
        
        message += `Veuillez confirmer la disponibilité et le processus de livraison.`;

        // 2. Encoder le message pour l'URL
        const encodedMessage = encodeURIComponent(message);

        // 3. Créer le lien WhatsApp
        // J'utilise l'API standard `wa.me`
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // 4. Ouvrir le lien dans un nouvel onglet
        window.open(whatsappUrl, '_blank');
        
        // Optionnel : Après l'envoi, vous pouvez naviguer vers une page de confirmation
        // navigate('/order-sent'); 
    };
    
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-dark fw-bold">Votre Panier</h2>
            
            {/* --- MESSAGE D'ERREUR CUSTOM (Remplace l'alert() problématique) --- */}
            {showCheckoutError && (
                <div className="alert alert-danger d-flex align-items-center justify-content-between fw-bold shadow-sm mb-4" role="alert">
                    <span>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        Votre panier est vide. Veuillez ajouter des articles avant d'**Envoyer nous votre commande par Whatsapp**.
                    </span>
                    <button 
                        type="button" 
                        className="btn-close" 
                        aria-label="Fermer"
                        onClick={() => setShowCheckoutError(false)}
                    ></button>
                </div>
            )}
            {/* ------------------------------------------------------------------- */}
            
            {cart.length === 0 ? (
                // Affichage si le panier est vide
                <div className="alert alert-info text-center fw-bold shadow-sm">
                    Votre panier est vide. <a href="/" className="alert-link text-decoration-underline">Découvrez nos services</a>.
                </div>
            ) : (
                // Affichage si le panier contient des articles
                <>
                    <table className="table align-middle">
                        <thead>
                            <tr>
                                <th className="text-dark">Produit</th>
                                <th className="text-dark">Prix</th>
                                <th className="text-center text-dark">Quantité</th>
                                <th className="text-center text-dark">Actions</th>
                                <th className="text-end text-dark">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map(item => (
                                <tr key={item.id}>
                                    <td>{item.title}</td>
                                    <td className="text-nowrap">{item.price} € {item.infosprice}</td>
                                    <td className="text-center">
                                        <button 
                                            // APPEL À LA FONCTION DU CONTEXTE (persistance serveur)
                                            onClick={() => decreaseQuantity(item.id)} 
                                            className="btn btn-sm btn-info me-2 text-white fw-bold shadow-sm"
                                        >
                                            <i className="bi bi-dash-lg"></i>
                                        </button>
                                        <span className="mx-2">{item.quantity}</span>
                                        <button 
                                            // APPEL À LA FONCTION DU CONTEXTE (persistance serveur)
                                            onClick={() => increaseQuantity(item.id)} 
                                            className="btn btn-sm btn-info ms-2 text-white fw-bold shadow-sm"
                                        >
                                            <i className="bi bi-plus-lg"></i>
                                        </button>
                                    </td>
                                    <td className="text-center">
                                        <button 
                                            // APPEL À LA FONCTION DU CONTEXTE (persistance serveur)
                                            onClick={() => removeCartItem(item.id)} 
                                            className="btn btn-sm btn-danger shadow-sm"
                                        >
                                            <i className="bi bi-trash-fill"></i> Retirer
                                        </button>
                                    </td>
                                    <td className="text-end fw-bold text-nowrap">{item.price * item.quantity} €</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr className="my-4" />
                    <div className="text-end fw-bold fs-4 mt-4 text-dark">
                        Total du panier : <span className="text-primary">{total.toFixed(2)} €</span>
                    </div>
                    
                    <div className="d-flex flex-column flex-md-row justify-content-between gap-3 mt-4">
                        
                        {/* Bouton de retour universel */}
                        <button 
                            onClick={handleGoBack} 
                            className="btn btn-outline-info btn-lg fw-bold shadow-sm flex-grow-1"
                        >
                            <i className="bi bi-arrow-left me-2"></i> Retour (Continuer mes achats)
                        </button>
                        
                        {/* Bouton WhatsApp - Mise à jour de l'action */}
                        <button 
                            onClick={handleCheckout} 
                            className="btn btn-success btn-lg fw-bold shadow-sm flex-grow-1"
                        >
                            <i className="bi bi-whatsapp me-2"></i> Envoyer nous votre commande par Whatsapp
                        </button>
                    </div>
                </>
            )}
            
        </div>
    );
};
export default React.memo(Cart);