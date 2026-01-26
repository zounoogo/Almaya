// src/components/admin/LocationCreateForm.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

const LocationCreateForm = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [region, setRegion] = useState('');
    const [image, setImage] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info'); 
    const [isSubmitting, setIsSubmitting] = useState(false); // 🔑 NOUVEL ÉTAT

    // --- 1. Protection Côté Frontend ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (authLoading) {
        return <div className="text-center py-5">Vérification des permissions...</div>;
    }

    // --- 2. Fonction de Soumission du Formulaire ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // 🔑 COMMENCE LA SOUMISSION
        setMessage('Création en cours...');
        setMessageType('info');

        try {
            const response = await fetch(`${API_URL}/api/admin/locations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name, slug, region, image }),
            });

            const data = await response.json();

            if (response.ok || response.status === 201) {
                setMessage(data.message || 'Destination créée avec succès !');
                setMessageType('success');
                
                setName('');
                setSlug('');
                setRegion('');
                setImage('');
                
                setTimeout(() => {
                    navigate('/locations');
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la création de la destination.');
                setMessageType('danger');
                setIsSubmitting(false); // 🔑 ÉCHEC: RÉACTIVER LE BOUTON
            }
        } catch (error) {
            console.error('Erreur réseau/serveur:', error);
            setMessage('Échec de la connexion au serveur.');
            setMessageType('danger');
            setIsSubmitting(false); // 🔑 ERREUR RÉSEAU: RÉACTIVER LE BOUTON
        }
        // Pas de setIsSubmitting(false) ici pour le succès, car la redirection gère la fin du cycle.
    };

    return (
        <div className="container py-5">
            <div className="mx-auto card p-4 shadow-lg" style={{ maxWidth: '600px' }}>
                <h2 className="fw-bold text-primary text-center mb-4">Ajouter une Nouvelle Destination</h2>

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
                        <label className="form-label">Slug (Utilisé dans l'URL)</label>
                        <input 
                            type="text" 
                            value={slug} 
                            onChange={(e) => setSlug(e.target.value)} 
                            className="form-control" 
                            required 
                        />
                        <div className="form-text">Ex: paris-france (doit être unique)</div>
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
                        <div className="form-text">Laissez vide pour utiliser l'image par défaut.</div>
                    </div>
                    
                    {/* Message d'état */}
                    {message && <div className={`alert alert-${messageType} mt-3`}>{message}</div>}

                    {/* Bouton de soumission */}
                    <button 
                        type="submit" 
                        className="btn btn-primary w-100 mt-4 fw-bold"
                        disabled={isSubmitting} // 🔑 UTILISE isSubmitting
                    >
                        {isSubmitting ? 'Enregistrement...' : 'Créer la Destination'}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate('/locations')}
                        className="btn btn-outline-secondary w-100 mt-2"
                        disabled={isSubmitting} // Optionnel: désactiver l'annulation pendant la soumission
                    >
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LocationCreateForm;
