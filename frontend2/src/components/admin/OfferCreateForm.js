// src/components/admin/OfferCreateForm.js

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:3001'; 

const OfferCreateForm = () => {
    // Hooks
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const locationSlug = searchParams.get('location');

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [infosPrice, setInfosPrice] = useState('');
    const [image, setImage] = useState('');
    const [duration, setDuration] = useState('');
    const [serviceTypeId, setServiceTypeId] = useState('');
    
    // États pour les données externes (Catégories et Lieu)
    const [categories, setCategories] = useState([]);
    const [locationId, setLocationId] = useState(null);
    const [locationName, setLocationName] = useState('');
    const [formLoading, setFormLoading] = useState(true);

    // États du processus
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null); // Changé à null pour ne pas désactiver le bouton
    const [isSubmitting, setIsSubmitting] = useState(false); // 🔑 NOUVEL ÉTAT DE SOUMISSION

    // --- 2. Chargement des données (useCallback) ---
    const fetchDependencies = useCallback(async () => {
        if (!locationSlug) {
            setMessage("Erreur : Le slug de la destination est manquant dans l'URL.");
            setMessageType('danger');
            setFormLoading(false);
            return;
        }

        try {
            const [categoriesResponse, locationResponse] = await Promise.all([
                fetch(`${API_URL}/api/categories`),
                fetch(`${API_URL}/api/locations/${locationSlug}`)
            ]);

            const categoriesData = await categoriesResponse.json();
            const locationData = await locationResponse.json();
            
            if (!locationResponse.ok) {
                throw new Error(`Destination '${locationSlug}' non trouvée.`);
            }

            setCategories(categoriesData);
            setLocationName(locationData.name);
            setLocationId(locationData.id);
            
            if(categoriesData.length > 0) {
                setServiceTypeId(categoriesData[0].id.toString());
            } else {
                setServiceTypeId('');
            }
            setMessage(null);
            setMessageType(null); // Réinitialiser le type de message après chargement

        } catch (error) {
            console.error('Erreur de chargement des données:', error);
            setMessage(error.message || 'Impossible de charger les configurations.');
            setMessageType('danger');
        } finally {
            setFormLoading(false);
        }
    }, [locationSlug]);

    // --- 3. useEffect ---
    useEffect(() => {
        if (!authLoading && isAdmin) {
            fetchDependencies();
        }
    }, [authLoading, isAdmin, fetchDependencies]);


    // --- 4. Protection (Après les Hooks) ---
    if (!authLoading && !isAdmin) {
        return <Navigate to="/" replace />;
    }
    if (authLoading || formLoading) {
        return <div className="text-center py-5">
            {authLoading ? 'Vérification des permissions...' : 'Chargement des données de configuration...'}
        </div>;
    }
    
    // --- 5. Fonction de Soumission du Formulaire ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true); // 🔑 DÉBUT DE LA SOUMISSION
        setMessage('Création de l\'offre en cours...');
        setMessageType('info');

        if (!locationId || !serviceTypeId) {
             setMessage('Erreur: IDs de configuration manquants (Destination ou Catégorie).');
             setMessageType('danger');
             setIsSubmitting(false); // 🔑 ÉCHEC: RÉACTIVER LE BOUTON
             return;
        }

        // Conversion des données avant l'envoi
        const dataToSend = {
            title,
            description,
            // CRITIQUE : Envoyer null si vide, sinon Number(price)
            price: price === '' ? null : parseFloat(price), 
            infos_price: infosPrice,
            image,
            duration,
            service_type_id: Number(serviceTypeId), // S'assurer que c'est un nombre
            location_id: Number(locationId), // S'assurer que c'est un nombre
        };

        try {
            const response = await fetch(`${API_URL}/api/admin/offers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(dataToSend),
            });

            const data = await response.json();

            if (response.ok || response.status === 201) {
                setMessage(data.message || `Offre "${title}" créée avec succès !`);
                setMessageType('success');
                
                // Nettoyer les champs textuels
                setTitle(''); setDescription(''); setPrice(''); setInfosPrice('');
                setImage(''); setDuration('');
                
                setTimeout(() => {
                    navigate(`/locations/${locationSlug}`);
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la création de l\'offre.');
                setMessageType('danger');
                setIsSubmitting(false); // 🔑 ÉCHEC: RÉACTIVER LE BOUTON
            }
        } catch (error) {
            console.error('Erreur réseau/serveur:', error);
            setMessage('Échec de la connexion au serveur.');
            setMessageType('danger');
            setIsSubmitting(false); // 🔑 ERREUR RÉSEAU: RÉACTIVER LE BOUTON
        }
    };

    return (
        <div className="container py-5">
            <div className="mx-auto card p-4 shadow-lg" style={{ maxWidth: '800px' }}>
                <h2 className="fw-bold text-warning text-center mb-4">
                    Ajouter une Offre à : <span className="text-primary">{locationName || locationSlug}</span>
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
                            >
                                <option value="" disabled>Sélectionner une catégorie</option>
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
                        />
                    </div>

                    <input type="hidden" value={locationId || ''} />
                    
                    {message && <div className={`alert alert-${messageType || 'info'} mt-3`}>{message}</div>}

                    <button 
                        type="submit" 
                        className="btn btn-warning w-100 mt-4 fw-bold text-dark"
                        disabled={isSubmitting || formLoading || (categories.length === 0)} // 🔑 DÉSACTIVER PENDANT LE CHARGEMENT ET LA SOUMISSION
                    >
                        {isSubmitting ? "Enregistrement en cours..." : "Créer l'Offre"}
                    </button>
                    <button 
                        type="button" 
                        onClick={() => navigate(`/locations/${locationSlug}`)}
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

export default OfferCreateForm;