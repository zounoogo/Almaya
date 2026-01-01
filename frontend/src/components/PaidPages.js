import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Assurez-vous que le chemin est correct
import { useNavigate } from 'react-router-dom';
// Supposons que vous utilisez des icônes Bootstrap (bi) pour les cartes et la validation.

const PaidPages = () => {
    // 1. Accès au contexte (panier et utilisateur) et à la navigation
    const { cart, setCart, user } = useAuth();
    const navigate = useNavigate();

    // 2. Calcul du total (répété par sécurité, ou pourrait être passé via state)
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // 3. État pour la simulation de paiement (ex: méthode de paiement, chargement)
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [isLoading, setIsLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    // 4. Redirection si le panier est vide (l'utilisateur ne devrait pas être là)
    useEffect(() => {
        if (cart.length === 0 && !paymentSuccess) {
            // Si le panier est vide et que le paiement n'est pas déjà un succès
            navigate('/cart'); // Rediriger vers le panier ou la page d'accueil
            // On pourrait aussi ajouter un message d'erreur si la redirection n'était pas immédiate.
        }
    }, [cart.length, navigate, paymentSuccess]);

    // 5. Fonction de simulation de paiement
    const handlePayment = (e) => {
        e.preventDefault(); // Empêche la soumission classique du formulaire
        if (total === 0) return; // Ne rien faire si le total est 0 (car le check useEffect devrait déjà avoir redirigé)

        // **Démarrer la simulation de l'API de paiement**
        setIsLoading(true);

        setTimeout(() => {
            setIsLoading(false);
            
            // --- Logique de paiement réussie ---
            
            setPaymentSuccess(true);

            // 1. Vider le panier
            setCart([]); 

            // 2. Message de succès et redirection
            const username = user && user.username ? user.username : 'Client';
            
            // NOTE: Remplacer cette alerte par une modale ou une page de confirmation
            alert(`Paiement de ${total} € réussi ! Merci ${username} pour votre commande. Vous allez être redirigé.`);

            // Rediriger vers une page de confirmation ou la page d'accueil après un court délai
            setTimeout(() => {
                navigate('/'); 
            }, 1000); 

        }, 2000); // Délai de 2 secondes pour simuler le temps de traitement
    };

    // 6. Gestion du retour en arrière
    const handleGoBack = () => {
        navigate(-1); // Revenir à la page précédente (probablement le panier)
    };
    
    // **Affichage si le panier est vide ou le paiement est réussi (devrait être géré par useEffect)**
    if (cart.length === 0 && !paymentSuccess) {
         return (
             <div className="container my-5 text-center">
                 <div className="alert alert-warning">
                     <h4 className="alert-heading">Panier vide !</h4>
                     <p>Veuillez ajouter des articles à votre panier pour procéder au paiement.</p>
                     <button onClick={() => navigate('/')} className="btn btn-outline-info mt-3">Retour à l'accueil</button>
                 </div>
             </div>
         );
     }


    return (
        <div className="container my-5">
            <h2 className="text-center mb-4 text-dark fw-bold">Paiement de la Commande</h2>

            <div className="row justify-content-center">
                <div className="col-lg-8">

                    {/* Bloc Récapitulatif de la Commande */}
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-info text-white fw-bold">
                            Récapitulatif de la Commande
                        </div>
                        <div className="card-body">
                            <ul className="list-group list-group-flush">
                                {cart.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        {item.title} x {item.quantity}
                                        <span className="fw-bold text-dark">{item.price * item.quantity} €</span>
                                    </li>
                                ))}
                            </ul>
                            <hr />
                            <div className="d-flex justify-content-between align-items-center fw-bold fs-5 mt-3">
                                Total à Payer : 
                                <span className="text-primary">{total.toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Bloc Formulaire de Paiement */}
                    <div className="card shadow mb-4">
                        <div className="card-header bg-primary text-white fw-bold">
                            Informations de Paiement
                        </div>
                        <div className="card-body">
                            
                            <form onSubmit={handlePayment}>
                                
                                {/* Choix de la Méthode de Paiement (simulé) */}
                                <div className="mb-3">
                                    <label className="form-label fw-bold">Méthode de Paiement</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="cardRadio" 
                                                value="card"
                                                checked={paymentMethod === 'card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="cardRadio">
                                                <i className="bi bi-credit-card-fill me-1"></i> Carte Bancaire
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input 
                                                className="form-check-input" 
                                                type="radio" 
                                                name="paymentMethod" 
                                                id="paypalRadio" 
                                                value="paypal"
                                                checked={paymentMethod === 'paypal'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <label className="form-check-label" htmlFor="paypalRadio">
                                                <i className="bi bi-paypal me-1"></i> PayPal
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Détails de la Carte (simulés) */}
                                {paymentMethod === 'card' && (
                                    <>
                                        <div className="mb-3">
                                            <label htmlFor="cardNumber" className="form-label">Numéro de Carte</label>
                                            <input type="text" className="form-control" id="cardNumber" placeholder="XXXX XXXX XXXX XXXX" required />
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="expiryDate" className="form-label">Date d'Expiration</label>
                                                <input type="text" className="form-control" id="expiryDate" placeholder="MM/AA" required />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label htmlFor="cvv" className="form-label">CVV</label>
                                                <input type="text" className="form-control" id="cvv" placeholder="123" required />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Boutons d'action */}
                                <div className="d-flex justify-content-between gap-3 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={handleGoBack} 
                                        className="btn btn-outline-info btn-lg fw-bold flex-grow-1"
                                        disabled={isLoading}
                                    >
                                        <i className="bi bi-arrow-left me-2"></i> Annuler et Revenir
                                    </button>
                                    
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary btn-lg fw-bold flex-grow-1"
                                        disabled={isLoading || total === 0}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Paiement en cours...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-lock-fill me-2"></i> Payer {total.toFixed(2)} €
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaidPages;