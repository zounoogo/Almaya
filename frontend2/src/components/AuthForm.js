// src/components/AuthForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
            <h2 className="text-center">{isLogin ? 'Connexion' : 'Inscription'}</h2>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '400px' }}>
                {!isLogin && (
                    <div className="mb-3">
                        <label className="form-label">Nom d'utilisateur</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-control" required />
                    </div>
                )}
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mot de passe</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" required />
                </div>
                <button type="submit" className={`btn btn-${isLogin ? 'primary' : 'success'} w-100`}>
                    {isLogin ? 'Se connecter' : 'S\'inscrire'}
                </button>
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </form>
            <div className="text-center mt-3">
                <p>
                    {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
                    <button onClick={handleToggleForm} className="btn btn-link p-0">
                        {isLogin ? 'Inscrivez-vous' : 'Connectez-vous'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default AuthForm;