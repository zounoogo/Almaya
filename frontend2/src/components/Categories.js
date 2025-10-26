import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // L'API a été configurée pour retourner les catégories
                const response = await fetch('http://localhost:3001/api/categories');
                
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des catégories de l'API.");
                }
                
                const data = await response.json();
                // Le code serveur est configuré pour renvoyer (id, name, slug, icon, description)
                setCategories(data);
            } catch (err) {
                console.error("Fetch Error:", err);
                setError("Impossible de charger les catégories. Veuillez vérifier le serveur.");
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
                {/* Couleur Orange ALMAYA pour le spinner */}
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
            {/* Titre en couleur de texte sombre par défaut */}
            <h2 className="text-center fw-bold mb-5">Nos Catégories de Services</h2>
            <div className="row g-4 justify-content-center">
                {categories.map((category) => (
                    // Utilisation du 'slug' pour le lien, qui est l'ID de catégorie dans l'URL
                    <div key={category.slug} className="col-md-6 col-lg-4 text-center">
                        {/* Le texte-dark assure que le texte est en couleur sombre ALMAYA */}
                        <Link to={`/categories/${category.slug}`} className="text-decoration-none text-dark">
                            <div className="card h-100 p-4 shadow-sm border-0 transition-300ms hover-shadow-lg">
                                {/* L'icône utilise text-primary (Orange ALMAYA) */}
                                <i className={`bi ${category.icon || 'bi-bookmark-heart-fill'} text-primary display-4 mb-3`}></i>
                                <h3 className="h5 fw-bold">{category.name}</h3>
                                <p className="text-muted flex-grow-1">{category.description}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            
            {/* Suggestion d'exploration par ville */}
            <div className="text-center mt-5">
                <p className="lead">
                    Vous cherchez une activité dans une ville spécifique ? 
                    {/* Lien en couleur Bleu ALMAYA (text-info) */}
                    <Link to="/locations" className="text-info fw-bold">Explorez par destination ici</Link>!
                </p>
            </div>
        </div>
    );
};
export default Categories;