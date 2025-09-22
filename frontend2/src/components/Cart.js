// src/components/Cart.js
import React from 'react';
import { useAuth } from '../contexts/AuthContext'; // Importer useAuth
import { useNavigate } from 'react-router-dom';

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

  const handleCheckout = () => {
    // Cette fonction serait le point de départ d'un processus de paiement réel.
    // Pour l'instant, on se contente d'afficher une alerte et de vider le panier.
    alert(`Merci pour votre achat, ${user.username}! Le total est de ${total} €. Votre commande a été passée.`);
    setCart([]); // Vider le panier après le "paiement"
    navigate('/'); // Rediriger l'utilisateur vers la page d'accueil
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Votre Panier</h2>
      
        <div className="alert alert-info text-center">
          <a href="/">Découvrez nos services</a>.
        </div>
      
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th className="text-center">Quantité</th>
                <th className="text-center">Actions</th>
                <th className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price} € {item.infosprice}</td>
                  <td className="text-center">
                    <button onClick={() => decreaseQuantity(item.id)} className="btn btn-sm btn-secondary me-2">-</button>
                    {item.quantity}
                    <button onClick={() => increaseQuantity(item.id)} className="btn btn-sm btn-secondary ms-2">+</button>
                  </td>
                  <td className="text-center">
                    <button onClick={() => removeItem(item.id)} className="btn btn-sm btn-danger">Retirer</button>
                  </td>
                  <td className="text-end">{item.price * item.quantity} €</td>
                </tr>
              ))}
            </tbody>
          </table>
          <hr />
          <div className="text-end fw-bold fs-4 mt-4">
            Total du panier : {total} €
          </div>
          <div className="d-grid gap-2 col-6 mx-auto mt-4">
            <button onClick={handleCheckout} className="btn btn-success btn-lg">Procéder au paiement</button>
          </div>
        </>
      
    </div>
  );
};

export default Cart;