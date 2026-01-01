// src/components/admin/OfferEditForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const API_URL = 'http://localhost:3001'; 

const OfferEditForm = () => {
    // Hooks
    const { isAdmin, loading: authLoading } = useAuth();
    // Récupère l'ID générique (id) OU offer_id, et categorySlug
    const { id, offer_id, categorySlug } = useParams(); 
    const offerToEditId = id || offer_id; 
    const navigate = useNavigate();

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [infosPrice, setInfosPrice] = useState('');
    const [image, setImage] = useState('');
    const [duration, setDuration] = useState('');
    const [serviceTypeId, setServiceTypeId] = useState('');
    
    // États pour les données externes et chargement
    const [categories, setCategories] = useState([]);
    const [locationId, setLocationId] = useState(null); 
    const [locationSlug, setLocationSlug] = useState(''); 
    const [locationName, setLocationName] = useState(''); 
    const [formLoading, setFormLoading] = useState(true); 
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Détermine la redirection finale : soit vers la catégorie, soit vers la destination.
    const determineRedirectPath = useCallback(() => {
        if (categorySlug) {
            return `/categories/${categorySlug}`;
        }
        return `/locations/${locationSlug}`;
    }, [categorySlug, locationSlug]);


    // --- 2. Fonctions de Chargement des Données ---
    const fetchDependencies = useCallback(async () => {
        if (!offerToEditId) {
            setFormLoading(false);
            setMessage("ID de l'offre non spécifié.");
            setMessageType('danger');
            return;
        }

        setMessage('Chargement des données existantes...');
        setMessageType('info');

        try {
            // Requête simultanée pour les catégories et les détails de l'offre
            const [categoriesResponse, offerResponse] = await Promise.all([
                fetch(`${API_URL}/api/categories`),
                fetch(`${API_URL}/api/offers/${offerToEditId}`) 
            ]);

            const categoriesData = await categoriesResponse.json();
            const offerDetail = await offerResponse.json(); 

            if (!offerResponse.ok) {
                const errorStatus = offerResponse.status;
                let errorMessage = `Détails de l'offre non trouvés (Statut: ${errorStatus}).`;
                if (errorStatus === 404) {
                     errorMessage += " L'ID de l'offre est probablement introuvable sur le serveur.";
                } else if (offerDetail.message) {
                     errorMessage = `Erreur API (${errorStatus}): ${offerDetail.message}`;
                }
                throw new Error(errorMessage);
            }
            
            // Pré-remplir les champs
            setTitle(offerDetail.title || '');
            setDescription(offerDetail.description || '');
            setPrice(offerDetail.price !== null ? String(offerDetail.price) : ''); 
            setInfosPrice(offerDetail.infos_price || '');
            setImage(offerDetail.image || '');
            setDuration(offerDetail.duration || '');
            setServiceTypeId(String(offerDetail.service_type_id)); 
            
            setLocationId(offerDetail.location_id);
            setLocationName(offerDetail.location_name || 'Destination inconnue');
            setLocationSlug(offerDetail.location_slug); 
            
            setCategories(categoriesData);
            
            setMessage(null);
            setMessageType(null); 

        } catch (error) {
            console.error('Erreur de chargement:', error);
            setMessage(error.message || 'Impossible de charger les données de configuration.');
            setMessageType('danger');
        } finally {
            setFormLoading(false); 
        }
    }, [offerToEditId]); 

    // --- 3. useEffect : Déclenchement du chargement après Auth ---
    useEffect(() => {
        if (!authLoading && isAdmin && offerToEditId) {
            fetchDependencies();
        }
    }, [authLoading, isAdmin, offerToEditId, fetchDependencies]);


    // --- 4. Protection (Après les Hooks) ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    // Affichage de l'état de chargement ou de l'erreur
    if (authLoading || formLoading) {
        return <div className="text-center py-5">
            {message && messageType === 'danger' && !authLoading ? (
                <div className={`alert alert-danger mx-auto`} style={{ maxWidth: '600px' }}>
                    {message}
                </div>
            ) : (
                authLoading ? 'Vérification des permissions...' : 'Chargement des données de l\'offre...'
            )}
        </div>;
    }
    
    // --- 5. Fonction de Soumission de la Mise à Jour ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); 
        setMessage('Mise à jour de l\'offre en cours...');
        setMessageType('info');

        // Conversion des données avant l'envoi
        const dataToSend = {
            title, description, infos_price: infosPrice, image, duration,
            service_type_id: Number(serviceTypeId),
            location_id: Number(locationId),
            // Envoie null si le prix est vide
            price: price === '' ? null : parseFloat(price), 
        };

        try {
            const response = await fetch(`${API_URL}/api/admin/offers/${offerToEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok || response.status === 200) {
                setMessage(data.message || 'Offre mise à jour avec succès !');
                setMessageType('success');
                
                const redirectPath = determineRedirectPath(); 
                
                setTimeout(() => {
                    navigate(redirectPath); 
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la mise à jour de l\'offre.');
                setMessageType('danger');
                setIsSubmitting(false); 
            }
        } catch (error) {
            console.error('Erreur réseau/serveur:', error);
            setMessage('Échec de la connexion au serveur.');
            setMessageType('danger');
            setIsSubmitting(false); 
        }
    };

    return (
        <div className="container py-5">
            <div className="mx-auto card p-4 shadow-lg" style={{ maxWidth: '800px' }}>
                <h2 className="fw-bold text-info text-center mb-4">
                    ✏️ Modifier l'Offre #{offerToEditId} à : <span className="text-primary">{locationName}</span>
                </h2>

                <form onSubmit={handleSubmit}>
                    
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Catégorie/Type de Service</label>
                            <select 
                                value={serviceTypeId} 
                                onChange={(e) => setServiceTypeId(e.target.value)} 
                                className="form-select" 
                                required
                                disabled={isSubmitting}
                            >
                                <option value="" disabled>Sélectionnez une catégorie</option> 
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Titre de l'Offre</label>
                            <input 
                                type="text" 
                                value={title} 
                                onChange={(e) => setTitle(e.target.value)} 
                                className="form-control" 
                                required 
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Description Détaillée</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="form-control" 
                            rows="3"
                            required
                            disabled={isSubmitting}
                        ></textarea>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Prix (en DH)</label>
                            <input 
                                type="number" 
                                step="0.01"
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                                className="form-control" 
                                placeholder="Laisser vide si 'Prix sur demande'"
                                disabled={isSubmitting}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Durée (Ex: 4 heures, 2 jours)</label>
                            <input 
                                type="text" 
                                value={duration} 
                                onChange={(e) => setDuration(e.target.value)} 
                                className="form-control" 
                                placeholder="Facultatif"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">Informations Supplémentaires sur le Prix</label>
                        <input 
                            type="text" 
                            value={infosPrice} 
                            onChange={(e) => setInfosPrice(e.target.value)} 
                            className="form-control" 
                            placeholder="Ex: Prix par personne, ou : hors taxes"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    <div className="mb-3">
                        <label className="form-label">URL de l'Image</label>
                        <input 
                            type="url" 
                            value={image} 
                            onChange={(e) => setImage(e.target.value)} 
                            className="form-control" 
                            placeholder="Ex: https://votresite.com/offre.jpg"
                            disabled={isSubmitting}
                        />
                    </div>
                    
                    {message && <div className={`alert alert-${messageType || 'info'} mt-3`}>{message}</div>}

                    <button 
                        type="submit" 
                        className="btn btn-info w-100 mt-4 fw-bold text-white"
                        disabled={isSubmitting} 
                    >
                        {isSubmitting ? "Sauvegarde en cours..." : "Sauvegarder les Modifications"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(determineRedirectPath())}
                        className="btn btn-outline-secondary w-100 mt-2"
                        disabled={isSubmitting}
                    >
                        Annuler
                    </button>
                </form>
            </div>
        </div>
    );
};

export default OfferEditForm;