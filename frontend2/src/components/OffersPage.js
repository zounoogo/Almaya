// src/components/OffersPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HeroSection from './HeroSection';
import Footer from './Footer';
import { Link } from 'react-router-dom';

const OffersPage = () => {
    const [offers, setOffers] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // This is the line that was missing or commented out
    const { category_id } = useParams(); 

    // Accès au panier et à ses setters via useAuth
    const { cart, setCart, addToCart } = useAuth(); 

    // Fonctions pour gérer la quantité, similaires à celles de Cart.js
    const increaseQuantity = (itemId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    };

    const decreaseQuantity = (itemId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
            )
        );
    };

    useEffect(() => {
        const fetchOffersAndCategory = async () => {
            setLoading(true);
            setError(null);
            try {
                const [offersResponse, categoryResponse] = await Promise.all([
                    fetch(`http://localhost:3001/api/categories/${category_id}/offers`),
                    fetch(`http://localhost:3001/api/categories/${category_id}`)
                ]);

                if (!offersResponse.ok || !categoryResponse.ok) {
                    throw new Error('Erreur lors de la récupération des données.');
                }

                const offersData = await offersResponse.json();
                const categoryData = await categoryResponse.json();

                setOffers(offersData);
                setCategoryName(categoryData.name);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOffersAndCategory();
    }, [category_id]);

    const handleAddToCart = (offer) => {
        addToCart(offer);
        setMessage(`L'offre "${offer.title}" a été ajoutée au panier !`);
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };

    if (loading) {
        return <p className="text-center mt-5">Chargement des offres...</p>;
    }
    if (error) {
        return <p className="text-center mt-5 text-danger">Erreur: {error}</p>;
    }

    return (
        <>
            <HeroSection />
            <div className="container my-5">
                <h2 className="text-center mb-5">{categoryName}</h2>
                <div className="row g-4">
                    {offers.length > 0 ? (
                        offers.map(offer => {
                            const cartItem = cart.find(item => item.id === offer.id);

                            return (
                                <div key={offer.id} className="col-md-6 col-lg-4">
                                    <div className="card h-100 shadow-sm">
                                        <img
                                            src={offer.image}
                                            className="card-img-top"
                                            alt={offer.title}
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title fw-bold">{offer.title}</h5>
                                            <p className="card-text text-muted flex-grow-1">{offer.description}</p>
                                            <p className="card-text fw-bold fs-5 text-primary">{offer.price} € {offer.infosprice}</p>
                                            {cartItem ? (
                                                <div className="d-flex justify-content-center align-items-center mt-auto">
                                                    <button onClick={() => decreaseQuantity(offer.id)} className="btn btn-sm btn-secondary me-2">-</button>
                                                    <span className="fw-bold">{cartItem.quantity}</span>
                                                    <button onClick={() => increaseQuantity(offer.id)} className="btn btn-sm btn-secondary ms-2">+</button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(offer)}
                                                    className="btn btn-warning mt-auto"
                                                >
                                                    Ajouter au panier
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center w-100">Aucune offre disponible pour cette catégorie.</p>
                    )}
                </div>
                <div className="alert alert-info text-center mt-5 d-flex justify-content-between align-items-center w-25 mx-auto">           
                    <div>
                        <a href="/">Découvrez nos autres services</a>.
                    </div>
                    <Link to="/cart" className="btn btn-warning">
                        Voir le panier
                    </Link>
                </div>
            </div>
            <Footer />
            {message && (
                <div className="alert alert-success fixed-bottom text-center mb-4 mx-auto" style={{ width: 'fit-content' }}>
                    {message}
                </div>
            )}
        </>
    );
};

export default OffersPage;