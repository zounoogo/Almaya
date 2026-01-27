import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate, useNavigate, useSearchParams, useParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

const OfferCreateForm = () => {
    // Hooks
    const { isAdmin, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    
    // Récupération des paramètres :
    const [searchParams] = useSearchParams();
    const { categorySlug: paramCategorySlug } = useParams(); // Nouveau: vient de la route /categories/:categorySlug/admin/create-offer
    
    // Ancien: vient de la route /admin/offers/create?location=slug-du-lieu
    const searchLocationSlug = searchParams.get('location'); 
    
    // Détermine le type d'identification et la valeur à utiliser (priorité au categorySlug pour la cohérence)
    const activeSlug = paramCategorySlug || searchLocationSlug;
    const isCategoryContext = !!paramCategorySlug;

    // États du formulaire
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [infosPrice, setInfosPrice] = useState('');
    const [image, setImage] = useState('');
    const [duration, setDuration] = useState('');
    const [serviceTypeId, setServiceTypeId] = useState('');
    
    // États pour les données externes (Catégories, Lieux et ID/Nom de référence)
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]); // 🔑 NOUVEAU: Stocke toutes les destinations
    const [locationId, setLocationId] = useState(''); // Changé à '' pour la sélection par défaut
    const [locationName, setLocationName] = useState('');
    const [categoryId, setCategoryId] = useState(null); 
    
    const [formLoading, setFormLoading] = useState(true);

    // États du processus
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); 

    // Détermine la redirection finale
    const determineRedirectPath = useCallback(() => {
        if (isCategoryContext) {
            // Contexte Catégorie: Retourne à la page d'offres de cette catégorie
            return `/categories/${paramCategorySlug}`; 
        } else if (searchLocationSlug) {
            // Contexte Lieu: Retourne à la page d'offres de cette destination
            return `/locations/${searchLocationSlug}`;
        }
        return '/'; // Fallback
    }, [isCategoryContext, paramCategorySlug, searchLocationSlug]);


    // --- 2. Chargement des données (useCallback) ---
    const fetchDependencies = useCallback(async () => {
        if (!activeSlug) {
            setMessage("Erreur : Le slug de la destination ou de la catégorie est manquant dans l'URL.");
            setMessageType('danger');
            setFormLoading(false);
            return;
        }

        try {
            // 🔑 AJOUT du fetch des destinations
            const [categoriesResponse, locationsResponse] = await Promise.all([
                fetch(`${API_URL}/api/categories`, { credentials: 'include' }),
                fetch(`${API_URL}/api/locations`, { credentials: 'include' }) // Récupère toutes les destinations
            ]);

            const categoriesData = await categoriesResponse.json();
            const locationsData = await locationsResponse.json(); // Données des destinations

            setCategories(categoriesData);
            setLocations(locationsData); // Stocke les destinations
            
            let currentCategoryId = null;
            let currentCategoryName = null;

            if (isCategoryContext) {
                // 🔑 NOUVELLE LOGIQUE: Contexte Catégorie
                const matchingCategory = categoriesData.find(cat => cat.slug === paramCategorySlug);
                
                if (matchingCategory) {
                    currentCategoryId = matchingCategory.id;
                    currentCategoryName = matchingCategory.name;
                    setCategoryId(currentCategoryId);
                    setLocationName(currentCategoryName); // Affiche le nom de la catégorie dans le titre
                    
                    // Pré-sélectionner la première destination disponible
                    if (locationsData.length > 0) {
                        setLocationId(locationsData[0].id.toString());
                    } else {
                        // Gérer l'erreur s'il n'y a aucune destination
                        throw new Error("Aucune destination disponible.");
                    }
                } else {
                    throw new Error(`Catégorie '${paramCategorySlug}' non trouvée.`);
                }
            } else {
                // ANCIENNE LOGIQUE: Contexte Destination (via Query Param)
                const locationResponse = await fetch(`${API_URL}/api/locations/${searchLocationSlug}`, { credentials: 'include' });
                const locationData = await locationResponse.json();
                
                if (!locationResponse.ok) {
                    throw new Error(`Destination '${searchLocationSlug}' non trouvée.`);
                }
                
                setLocationName(locationData.name);
                setLocationId(locationData.id.toString()); // Pré-sélectionne le lieu de l'URL
            }
            
            // Si des catégories existent, pré-sélectionner la première
            if (categoriesData.length > 0) {
                // Si on est dans le contexte Catégorie, l'ID de la catégorie est déjà trouvé.
                const defaultCategoryId = currentCategoryId ? currentCategoryId.toString() : categoriesData[0].id.toString();
                setServiceTypeId(defaultCategoryId);
            } else {
                setServiceTypeId('');
            }
            
            setMessage(null);
            setMessageType(null); 

        } catch (error) {
            console.error('Erreur de chargement des données:', error);
            setMessage(error.message || 'Impossible de charger les configurations.');
            setMessageType('danger');
        } finally {
            setFormLoading(false);
        }
    }, [isCategoryContext, paramCategorySlug, searchLocationSlug, activeSlug]);

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
        setIsSubmitting(true);
        setMessage('Création de l\'offre en cours...');
        setMessageType('info');

        // Validation ID obligatoire : locationId ET serviceTypeId
        if (!serviceTypeId || !locationId) {
             setMessage('Erreur: Les IDs de catégorie et de destination sont obligatoires.');
             setMessageType('danger');
             setIsSubmitting(false);
             return;
        }

        // Conversion des données avant l'envoi
        const dataToSend = {
            title,
            description,
            price: price === '' ? null : parseFloat(price), 
            infos_price: infosPrice,
            image,
            duration,
            service_type_id: Number(serviceTypeId),
            // location_id est maintenant OBLIGATOIRE et est toujours envoyé
            location_id: Number(locationId),
            
            // category_id est toujours envoyé si disponible (seulement dans le contexte Catégorie pour l'instant)
            category_id: categoryId ? Number(categoryId) : null, 
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
                
                // Nettoyer les champs textuels (sauf la catégorie sélectionnée)
                setTitle(''); setDescription(''); setPrice(''); setInfosPrice('');
                setImage(''); setDuration('');
                
                const redirectPath = determineRedirectPath();
                
                setTimeout(() => {
                    navigate(redirectPath);
                }, 2000);

            } else {
                setMessage(data.message || 'Erreur lors de la création de l\'offre.');
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
                <h2 className="fw-bold text-warning text-center mb-4">
                    Ajouter une Offre pour : <span className="text-primary">{locationName || activeSlug}</span>
                </h2>
                
                {isCategoryContext && (
                    <div className="alert alert-info border-primary text-center">
                        Création d'offre pour la catégorie **{locationName}**. Veuillez sélectionner la destination où elle sera disponible.
                    </div>
                )}


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
                                <option value="" disabled>Sélectionner une catégorie</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* 🔑 NOUVEAU CHAMP : Sélection de la destination, obligatoire */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Destination (Ville/Lieu)</label>
                            <select 
                                value={locationId} 
                                onChange={(e) => setLocationId(e.target.value)} 
                                className="form-select" 
                                required
                                disabled={isSubmitting || !isCategoryContext}
                            >
                                <option value="" disabled>Sélectionner une destination</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>
                                        {loc.name}
                                    </option>
                                ))}
                            </select>
                            {!isCategoryContext && (
                                <small className="text-muted">Destination fixe : {locationName}</small>
                            )}
                        </div>
                        {/* Fin du NOUVEAU CHAMP */}
                    </div>
                    
                    <div className="mb-3">
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

                    {/* Champs cachés pour le contexte de l'offre (pour l'API) */}
                    {locationId && <input type="hidden" value={locationId} />}
                    {categoryId && <input type="hidden" value={categoryId} />}
                    
                    {message && <div className={`alert alert-${messageType || 'info'} mt-3`}>{message}</div>}

                    <button 
                        type="submit" 
                        className="btn btn-warning w-100 mt-4 fw-bold text-dark"
                        disabled={isSubmitting || formLoading || (categories.length === 0) || (isCategoryContext && !locationId)}
                    >
                        {isSubmitting ? "Enregistrement en cours..." : "Créer l'Offre"}
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

export default OfferCreateForm;