import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001'; 

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('info'); // 'info', 'success', 'danger'

    const { login } = useAuth(); 
    const navigate = useNavigate();

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
    };
    
    // Fonction pour gérer le renvoi de l'email de vérification
    const handleResendEmail = async () => {
        if (!email) {
            setMessage('Veuillez saisir votre email pour renvoyer le lien.');
            setMessageType('danger');
            return;
        }
        
        setMessage('Envoi en cours...');
        setMessageType('info');

        try {
            const endpoint = `${API_URL}/api/resend-verification`;
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            
            if (response.ok || response.status === 200) { 
                setMessage(data.message || 'Nouvel email de vérification envoyé ! Vérifiez votre boîte de réception.');
                setMessageType('success');
            } else {
                setMessage(data.message || 'Échec du renvoi de l\'e-mail.');
                setMessageType('danger');
            }
        } catch (error) {
            setMessage('Erreur réseau lors du renvoi de l\'e-mail.');
            setMessageType('danger');
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setMessageType('info');

        const endpoint = isLogin ? `${API_URL}/api/login` : `${API_URL}/api/register`;
        const body = isLogin ? { email, password } : { username, email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify(body),
            });

            const data = await response.json();
            
            // ✅ MISE À JOUR : Vérifie si la réponse est OK (2xx) ou si c'est spécifiquement un 202
            if (response.ok || response.status === 202) { 
                if (isLogin) {
                    await login(); 
                    setMessageType('success');
                    setMessage(data.message || 'Connexion réussie !');
                    navigate('/');
                } else {
                    // INSCRIPTION RÉUSSIE: Gère 201 (e-mail OK) et 202 (e-mail échoué)
                    
                    if (response.status === 202) {
                        // Statut 202 du backend (Inscription OK, mais échec d'envoi d'e-mail)
                        setMessage(data.message || 'Inscription réussie, mais échec de l\'envoi de l\'e-mail. Veuillez contacter le support.');
                        setMessageType('danger');
                    } else { // Statut 201 (Inscription et e-mail OK)
                        setMessage(data.message || 'Inscription réussie ! Un email de vérification vous a été envoyé. Veuillez cliquer sur le lien pour activer votre compte.');
                        setMessageType('success'); 
                    }
                    
                    setIsLogin(true); // Basculer vers le formulaire de connexion
                    resetForm(); 
                }
            } else {
                const errorMessage = data.message || `Erreur de ${isLogin ? 'connexion' : 'inscription'}.`;

                if (response.status === 403) {
                    // ERREUR COMPTE NON VÉRIFIÉ (403)
                    setMessage(`⚠️ ${errorMessage} Veuillez vérifier votre boîte de réception (et vos spams) pour le lien d'activation.`);
                    setMessageType('danger'); 
                } else if (response.status === 409) {
                    // ERREUR DUPLICATION (409)
                    setMessage(`❌ ${errorMessage}`);
                    setMessageType('danger');
                } else {
                    // Autres erreurs (Mot de passe incorrect, 400, 500)
                    setMessage(`❌ ${errorMessage}`);
                    setMessageType('danger');
                }
            }
        } catch (error) {
            setMessage(`❌ Erreur de ${isLogin ? 'connexion' : 'inscription'} (réseau). Veuillez réessayer.`);
            setMessageType('danger');
        }
    };

    const handleToggleForm = () => {
        setIsLogin(!isLogin);
        resetForm(); 
        setMessage('');
        setMessageType('info');
    };

    return (
        <div className="container py-5">
            {/* ... Logo/Titre (inchangé) ... */}
            <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none d-inline-block">
                    {
                    <img 
                        src="https://res.cloudinary.com/dwcozj2tc/image/upload/v1763472224/WhatsApp_Image_2025-10-18_%C3%A0_20.31.50_c1eb53c2_ctcvfw.jpg" 
                        alt="Logo Almaya Services" 
                        style={{ height: '100px', marginBottom: '5px' }} 
                        className="d-block mx-auto"
                    />
                    }
                    <h2 className="fw-bold mb-0 text-primary">ALMAYA SERVICES</h2>
                </Link>
            </div>
            
            <h3 className="text-center text-dark mb-4 fw-light">{isLogin ? 'Connexion à votre compte' : 'Créer un nouveau compte'}</h3>

            <form onSubmit={handleSubmit} className="mx-auto card p-4 shadow-sm" style={{ maxWidth: '400px' }}>
                
                {!isLogin && (
                    <div className="mb-3">
                        <label className="form-label text-dark">Nom d'utilisateur</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label text-dark">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Mot de passe</label>
                    {/* CORRECTION: Suppression de la prop 'onChange' dupliquée */}
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="form-control" 
                        required 
                    />
                </div>
                
                <button 
                    type="submit" 
                    className={`btn btn-${isLogin ? 'primary' : 'info'} w-100 fw-bold`}
                >
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </button>
                
                {/* Message d'erreur/succès */}
                {message && <div className={`alert alert-${messageType} mt-3`}>{message}</div>}
                
                {/* Bouton de renvoi d'email conditionnel (Visible si erreur 403 en mode Login) */}
                {isLogin && messageType === 'danger' && message.includes('activé') && (
                    <div className="text-center mt-2">
                        <button 
                            onClick={handleResendEmail} 
                            className="btn btn-sm btn-outline-secondary"
                            disabled={!email} 
                        >
                            Renvoyer le lien de vérification
                        </button>
                    </div>
                )}

            </form>
            
            {/* Lien de bascule (inchangé) */}
            <div className="text-center mt-3">
                <p className="text-muted">
                    {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                    <button 
                        onClick={handleToggleForm} 
                        className="btn btn-link text-info fw-bold p-0 text-decoration-none"
                    >
                        {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;