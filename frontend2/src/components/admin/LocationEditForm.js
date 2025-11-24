// src/components/admin/LocationEditForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:3001'; 

const LocationEditForm = () => {
    // ✅ 1. Tous les Hooks sont remontés au début
    const { isAdmin, loading: authLoading } = useAuth();
    const { slug } = useParams(); 
    const navigate = useNavigate();

    // États du formulaire
    const [name, setName] = useState('');
    const [newSlug, setNewSlug] = useState(''); 
    const [region, setRegion] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info'); 
    const [initialLoad, setInitialLoad] = useState(true);
    const [originalSlug, setOriginalSlug] = useState(slug); 

    // ✅ 2. useCallback doit être défini avant le return conditionnel
    const fetchLocationData = useCallback(async () => {
        if (!slug) return;
        setMessage('Chargement des données existantes...');
        setMessageType('info');

        try {
            const response = await fetch(`${API_URL}/api/locations/${slug}`);
            
            if (!response.ok) {
                throw new Error('Destination non trouvée.');
            }

            const data = await response.json();
            
            setName(data.name);
            setNewSlug(data.slug); 
            setRegion(data.region || '');
            setImage(data.image || '');
            setOriginalSlug(data.slug); 
            
            setMessage(null);

        } catch (error) {
            console.error('Erreur de chargement:', error);
            setMessage(error.message || 'Impossible de charger les données de la destination.');
            setMessageType('danger');
        } finally {
            setInitialLoad(false);
        }
    }, [slug]); // Dépend de slug, qui est stable car issu de useParams()

    // ✅ 3. useEffect doit être défini avant le return conditionnel
    useEffect(() => {
        fetchLocationData();
    }, [fetchLocationData]); 

    // --- 4. Protection (Le return conditionnel est maintenant après les Hooks) ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (authLoading || initialLoad) {
        return <div className="text-center py-5">
            {initialLoad ? 'Chargement des données...' : 'Vérification des permissions...'}
        </div>;
    }
    
    // --- Reste de la fonction de Soumission (handleSubmit) inchangé ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Mise à jour en cours...');
        setMessageType('info');

        const dataToSend = { 
            name, 
            region, 
            image,
            new_slug: (newSlug !== originalSlug) ? newSlug : undefined
        };

        try {
            const response = await fetch(`${API_URL}/api/admin/locations/${originalSlug}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok || response.status === 200) {
                setMessage(data.message || 'Destination mise à jour avec succès !');
                setMessageType('success');
                
                if (data.newSlug) {
                    navigate(`/admin/locations/edit/${data.newSlug}`, { replace: true });
                }
                
                setTimeout(() => {
                    navigate('/locations');
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la mise à jour de la destination.');
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
                <h2 className="fw-bold text-info text-center mb-4">Modifier la Destination: {name}</h2>

                <form onSubmit={handleSubmit}>
                    
                    {/* Nom de la Destination */}
                    <div className="mb-3">
                        <label className="form-label">Nom</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="form-control" 
                            required 
                        />
                    </div>

                    {/* Slug (URL Friendly) */}
                    <div className="mb-3">
                        <label className="form-label">Slug (URL Friendly)</label>
                        <input 
                            type="text" 
                            value={newSlug} 
                            onChange={(e) => setNewSlug(e.target.value)} 
                            className="form-control" 
                            required 
                        />
                        <div className="form-text">Actuel: {originalSlug}. La modification change l'URL.</div>
                    </div>

                    {/* Région */}
                    <div className="mb-3">
                        <label className="form-label">Région/Pays</label>
                        <input 
                            type="text" 
                            value={region} 
                            onChange={(e) => setRegion(e.target.value)} 
                            className="form-control" 
                            required 
                        />
                    </div>

                    {/* URL de l'Image */}
                    <div className="mb-3">
                        <label className="form-label">URL de l'Image</label>
                        <input 
                            type="url" 
                            value={image} 
                            onChange={(e) => setImage(e.target.value)} 
                            className="form-control" 
                            placeholder="Ex: https://votresite.com/image.jpg"
                        />
                    </div>
                    
                    {/* Message d'état */}
                    {message && <div className={`alert alert-${messageType} mt-3`}>{message}</div>}

                    {/* Bouton de soumission */}
                    <button 
                        type="submit" 
                        className="btn btn-info w-100 mt-4 fw-bold text-white"
                        disabled={messageType === 'info' && message !== null}
                    >
                        Sauvegarder les Modifications
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/locations')}
                        className="btn btn-outline-secondary w-100 mt-2"
                    >
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LocationEditForm;