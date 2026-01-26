// src/components/admin/CategoryCreateForm.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

const CategoryCreateForm = () => {
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [icon, setIcon] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState('info'); 

    // --- Protection ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (authLoading) {
        return <div className="text-center py-5">Vérification des permissions...</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Création en cours...');
        setMessageType('info');

        const dataToSend = { name, slug, icon, description };

        try {
            const response = await fetch(`${API_URL}/api/admin/categories`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok || response.status === 201) {
                setMessage(data.message || 'Catégorie créée avec succès !');
                setMessageType('success');
                
                // Réinitialiser
                setName(''); setSlug(''); setIcon(''); setDescription('');
                
                setTimeout(() => {
                    navigate('/categories');
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la création de la catégorie.');
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
                <h2 className="fw-bold text-primary text-center mb-4">Ajouter une Nouvelle Catégorie</h2>

                <form onSubmit={handleSubmit}>
                    
                    <div className="mb-3">
                        <label className="form-label">Nom</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Slug (URL)</label>
                        <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="form-control" required />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">URL d'Icône (Ex: Font Awesome/Bootstrap Icons URL)</label>
                        <input type="url" value={icon} onChange={(e) => setIcon(e.target.value)} className="form-control" placeholder="URL de l'icône ou de l'image" />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="form-control" rows="3" required />
                    </div>
                    
                    {message && <div className={`alert alert-${messageType} mt-3`}>{message}</div>}

                    <button type="submit" className="btn btn-primary w-100 mt-4 fw-bold">
                        Créer la Catégorie
                    </button>
                    <button type="button" onClick={() => navigate('/categories')} className="btn btn-outline-secondary w-100 mt-2">
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CategoryCreateForm;