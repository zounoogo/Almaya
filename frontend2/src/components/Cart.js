import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importer useAuth
import { useNavigate } from 'react-router-dom';
// IMPORTANT : Assurez-vous d'avoir des styles pour 'btn-primary' (Orange ALMAYA) 
// et 'btn-info' (Bleu ALMAYA) dans votre configuration Bootstrap/Tailwind.

const Cart = () => {
    const { cart, setCart, user } = useAuth(); // Accès au panier, à son setter et à l'utilisateur
    const navigate = useNavigate();

    // Fonction pour augmenter la quantité d'un article
    const increaseQuantity = (itemId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    // Fonction pour diminuer la quantité d'un article
    const decreaseQuantity = (itemId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    // Fonction pour retirer un article du panier
    const removeItem = (itemId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== itemId));
    };

    // Calcul du total du panier
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Fonction pour gérer le retour en arrière, quelle que soit la page d'origine
    const handleGoBack = () => {
        navigate(-1); // Simule le bouton "Précédent" du navigateur
    };

    // Cette fonction redirige l'utilisateur vers la page de paiement.
    const handleCheckout = () => {
        if (cart.length === 0) {
            // Utilisation d'alert() ici pour l'environnement de démo
            alert("Votre panier est vide. Veuillez ajouter des articles avant de passer à la caisse.");
            return;
        }

        // Rediriger l'utilisateur vers la page de paiement dédiée.
        navigate('/paidpages'); 
    }; 
    
    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-dark fw-bold">Votre Panier</h2>
            
            {cart.length === 0 ? (
                <div className="alert alert-info text-center fw-bold shadow-sm">
                    Votre panier est vide. <a href="/" className="alert-link text-decoration-underline">Découvrez nos services</a>.
                </div>
            ) : (
                <>
                    <table className="table">
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
                                        {/* Boutons d'action : utiliser btn-info (Bleu ALMAYA) */}
                                        <button onClick={() => decreaseQuantity(item.id)} className="btn btn-sm btn-info me-2 text-white fw-bold shadow-sm">-</button>
                                        {item.quantity}
                                        <button onClick={() => increaseQuantity(item.id)} className="btn btn-sm btn-info ms-2 text-white fw-bold shadow-sm">+</button>
                                    </td>
                                    <td className="text-center">
                                        <button onClick={() => removeItem(item.id)} className="btn btn-sm btn-danger shadow-sm">
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
                        Total du panier : <span className="text-primary">{total} €</span>
                    </div>
                    
                    <div className="d-flex justify-content-between gap-3 mt-4">
                        
                        {/* Nouveau bouton de retour universel utilisant navigate(-1) */}
                        <button 
                            onClick={handleGoBack} 
                            className="btn btn-outline-info btn-lg fw-bold shadow-sm flex-grow-1"
                        >
                            <i className="bi bi-arrow-left me-2"></i> Retour (Continuer mes achats)
                        </button>
                        
                        {/* Bouton de paiement (Orange ALMAYA) */}
                        
                        <button 
                            onClick={handleCheckout} 
                            className="btn btn-primary btn-lg fw-bold shadow-sm flex-grow-1"
                        >
                            <i className="bi bi-cash-stack me-2"></i> Procéder au paiement
                        </button>
                    </div>
                </>
            )}
            
        </div>
    );
};

export default Cart;
