// src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
                const response = await fetch(`${API_URL}/api/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data.');
                }
                const data = await response.json();
                setProfileData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const handleLogout = () => {
        logout();
        navigate('/'); // Redirect to the homepage after logging out
    };

    if (loading) {
        return <div className="text-center py-5">Chargement du profil...</div>;
    }

    if (error) {
        return <div className="text-center py-5 text-danger">Erreur : {error}</div>;
    }

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Your Account Profile</h2>
            <hr className="mb-4" />
            {profileData ? (
                <div className="card p-4 mx-auto" style={{ maxWidth: '500px' }}>
                    <p className="lead">Bienvenue, **{profileData.username}** !</p>
                    <hr />
                    <p><strong>Email:</strong> {profileData.email}</p>
                    {/* Ajoutez ici d'autres informations de profil si vous le souhaitez */}
                    <button onClick={handleLogout} className="btn btn-danger mt-3">
                        Se déconnecter
                    </button>
                </div>
            ) : (
                <div className="text-center">
                    <p>Veuillez vous connecter pour voir votre profil.</p>
                </div>
            )}
        </div>
    );
};

export default Profile;