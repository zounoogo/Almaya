// src/components/admin/CategoryEditForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:3001'; 

const CategoryEditForm = () => {
    // ✅ 1. Tous les Hooks sont remontés au sommet
    const { isAdmin, loading: authLoading } = useAuth();
    const { slug } = useParams(); // Slug actuel de la catégorie
    const navigate = useNavigate();

    // États du formulaire
    const [name, setName] = useState('');
    const [newSlug, setNewSlug] = useState(''); 
    const [icon, setIcon] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info'); 
    const [initialLoad, setInitialLoad] = useState(true);
    const [originalSlug, setOriginalSlug] = useState(slug); 

    // --- 2. Chargement des données existantes (useCallback) ---
    // ✅ Doit être défini avant les retours conditionnels
    const fetchCategoryData = useCallback(async () => {
        if (!slug) return;
        setMessage('Chargement des données existantes...');
        setMessageType('info');

        try {
            const response = await fetch(`${API_URL}/api/categories/${slug}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Catégorie non trouvée.');
            }

            const data = await response.json();
            
            setName(data.name);
            setNewSlug(data.slug); 
            setIcon(data.icon || '');
            setDescription(data.description || '');
            setOriginalSlug(data.slug); 
            
            setMessage(null);

        } catch (error) {
            console.error('Erreur de chargement:', error);
            setMessage(error.message || 'Impossible de charger les données de la catégorie.');
            setMessageType('danger');
        } finally {
            setInitialLoad(false);
        }
    }, [slug]);

    // --- 3. useEffect (Doit être défini avant les retours conditionnels) ---
    useEffect(() => {
        fetchCategoryData();
    }, [fetchCategoryData]); 

    // --- 4. Logique de protection (Après TOUS les Hooks) ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (authLoading || initialLoad) {
        return <div className="text-center py-5">
            {message && messageType === 'danger' ? <div className={`alert alert-danger`}>{message}</div> : (initialLoad ? 'Chargement des données...' : 'Vérification des permissions...')}
        </div>;
    }
    
    // --- 5. Fonction de Soumission de la Mise à Jour ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Mise à jour en cours...');
        setMessageType('info');

        const dataToSend = { name, new_slug: newSlug, icon, description };

        try {
            // Utiliser le SLUG ORIGINAL pour l'URL de la requête PUT
            const response = await fetch(`${API_URL}/api/admin/categories/${originalSlug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok || response.status === 200) {
                setMessage(data.message || 'Catégorie mise à jour avec succès !');
                setMessageType('success');
                
                // Mettre à jour l'URL si le slug a été modifié
                if (data.newSlug && data.newSlug !== originalSlug) {
                    navigate(`/admin/categories/edit/${data.newSlug}`, { replace: true });
                }
                
                setTimeout(() => {
                    navigate('/categories');
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la mise à jour de la catégorie.');
                setMessageType('danger');
            }
        } catch (error) {
            console.error('Erreur réseau/serveur:', error);
            setMessage('Échec de la connexion au serveur.');
            setMessageType('danger');
        }
    };

    return (
        <div className="container py-5">
            <div className="mx-auto card p-4 shadow-lg" style={{ maxWidth: '600px' }}>
                <h2 className="fw-bold text-info text-center mb-4">Modifier la Catégorie: {name}</h2>

                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="form-label">Nom</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Slug (URL)</label>
                        <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value)} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">URL d'Icône</label>
                        <input type="url" value={icon} onChange={(e) => setIcon(e.target.value)} className="form-control" placeholder="URL de l'icône ou de l'image" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="3" required />
                    </div>
                    
                    {message && <div className={`alert alert-${messageType} mt-3`}>{message}</div>}

                    <button type="submit" className="btn btn-info w-100 mt-4 fw-bold text-white">
                        Sauvegarder les Modifications
                    </button>
                    <button type="button" onClick={() => navigate('/categories')} className="btn btn-outline-secondary w-100 mt-2">
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryEditForm;