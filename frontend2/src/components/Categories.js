// src/components/Categories.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Utiliser une constante pour l'URL de l'API (pour la cohérence et le déploiement)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Utilisation de la constante API_URL
                const response = await fetch(`${API_URL}/api/categories`);
                
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des catégories de l'API.");
                }
                
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Impossible de charger les catégories. Veuillez vérifier la disponibilité de l'API."); 
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <p>Chargement des catégories...</p>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5 text-center alert alert-danger">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div id="categories" className="container py-5">
            <h2 className="text-center fw-bold mb-5">Nos Catégories de Services</h2>
            <div className="row g-4 justify-content-center">
                {categories.map((category) => (
                    <div key={category.slug} className="col-md-6 col-lg-4 text-center">
                        <Link to={`/categories/${category.slug}`} className="text-decoration-none text-dark">
                            <div className="card h-100 p-4 shadow-sm border-0 transition-300ms hover-shadow-lg">
                                <img 
                                    src={category.icon} 
                                    alt={category.name}
                                    className="img-fluid mb-3 mx-auto d-block" 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '100%' }}
                                />
                                <h3 className="h5 fw-bold">{category.name}</h3>
                                <p className="text-muted flex-grow-1">{category.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-5">
                <p className="lead">
                    Vous cherchez une activité dans une ville spécifique ? 
                    <Link to="/locations" className="text-info fw-bold">Explorez par destination ici</Link>!
                </p>
            </div>
        </div>
    );
};
export default Categories;