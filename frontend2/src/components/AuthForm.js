import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import de Link
import { useAuth } from '../contexts/AuthContext';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    // Fonction pour réinitialiser les champs du formulaire
    const resetForm = () => {
        setEmail('');
        setPassword('');
        setUsername('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        const endpoint = isLogin ? 'http://localhost:3001/api/login' : 'http://localhost:3001/api/register';
        const body = isLogin ? { email, password } : { username, email, password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    login(data.token);
                    navigate('/');
                } else {
                    setMessage(data.message + ' Vous pouvez maintenant vous connecter.');
                    setIsLogin(true);
                    resetForm(); // Réinitialise les champs après une inscription réussie
                }
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage(`Erreur de ${isLogin ? 'connexion' : 'inscription'}. Veuillez réessayer.`);
        }
    };

    // Gère le changement de formulaire (Login/Register)
    const handleToggleForm = () => {
        setIsLogin(!isLogin);
        resetForm(); // Réinitialise les champs lors du changement de formulaire
        setMessage('');
    };

    return (
        <div className="container py-5">
            {/* Section Logo ALMAYA */}
            <div className="text-center mb-4">
                <Link to="/" className="text-decoration-none">
                    {/* ALMAYA SERVICES en Orange ALMAYA (text-primary) */}
                    <h2 className="fw-bold mb-0 text-primary">ALMAYA SERVICES</h2>
                    {/* TRAVEL en Bleu ALMAYA (text-info) */}
                    <span className="small d-block text-info">TRAVEL</span>
                </Link>
            </div>
            
            <h3 className="text-center text-dark mb-4 fw-light">{isLogin ? 'Connexion à votre compte' : 'Créer un nouveau compte'}</h3>

            {/* Formulaire dans une carte Bootstrap pour le style */}
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
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                
                {/* Bouton de soumission : Orange (primary) pour la connexion, Bleu (info) pour l'inscription */}
                <button 
                    type="submit" 
                    className={`btn btn-${isLogin ? 'primary' : 'info'} w-100 fw-bold`}
                >
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </button>
                
                {/* Message d'erreur/succès : utilise alert-info (Bleu ALMAYA) */}
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </form>
            
            {/* Lien de bascule : utilise text-info (Bleu ALMAYA) pour le lien */}
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