// src/components/Categories.js

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ✅ Import du hook d'auth

// Utiliser une constante pour l'URL de l'API (pour la cohérence et le déploiement)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Récupération du statut Admin
    const { isAdmin } = useAuth(); 

    // --- Fonction de suppression pour l'Admin ---
    const handleDeleteCategory = async (categorySlug, categoryName) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie "${categoryName}" ? (Ceci peut affecter les offres liées!)`)) {
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/categories/${categorySlug}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                // Mettre à jour l'état local pour retirer la catégorie
                setCategories(prev => prev.filter(cat => cat.slug !== categorySlug));
                alert(`Catégorie ${categoryName} supprimée !`);
            } else if (response.status === 403) {
                 alert("Erreur: Vous n'avez pas la permission de supprimer cette catégorie.");
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Échec de la suppression.');
            }
        } catch (err) {
            console.error("Delete Error:", err);
            setError(err.message || "Erreur lors de la suppression de la catégorie.");
        }
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
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

            {/* ✅ ZONE ADMIN : Bouton Ajouter Catégorie */}
            {isAdmin && (
                <div className="text-center mb-4">
                    <Link to="/admin/categories/create" className="btn btn-success">
                        <i className="bi bi-plus-circle me-2"></i> Ajouter une Nouvelle Catégorie
                    </Link>
                </div>
            )}

            <div className="row g-4 justify-content-center">
                {categories.map((category) => (
                    <div key={category.slug} className="col-md-6 col-lg-4 text-center">
                        <div className="card h-100 p-4 shadow-sm border-0 transition-300ms hover-shadow-lg position-relative">
                            
                            {/* ✅ ZONE ADMIN : Boutons Modifier/Supprimer Catégorie */}
                            {isAdmin && (
                                <div className="position-absolute top-0 end-0 p-2 z-1">
                                    <Link 
                                        to={`/admin/categories/edit/${category.slug}`} 
                                        className="btn btn-sm btn-primary me-2"
                                        title="Modifier la catégorie"
                                        onClick={(e) => e.stopPropagation()} // Empêche la navigation sous-jacente
                                    >
                                        <i className="bi bi-pencil"></i>
                                    </Link>
                                    <button 
                                        className="btn btn-sm btn-danger" 
                                        title="Supprimer la catégorie"
                                        onClick={(e) => { 
                                            e.stopPropagation(); // Empêche la navigation
                                            handleDeleteCategory(category.slug, category.name); 
                                        }}
                                    >
                                        <i className="bi bi-trash"></i>
                                    </button>
                                </div>
                            )}

                            <Link to={`/categories/${category.slug}`} className="text-decoration-none text-dark">
                                <img 
                                    src={category.icon} 
                                    alt={category.name}
                                    className="img-fluid mb-3 mx-auto d-block" 
                                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '100%' }}
                                />
                                <h3 className="h5 fw-bold">{category.name}</h3>
                                <p className="text-muted flex-grow-1">{category.description}</p>
                            </Link>
                        </div>
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