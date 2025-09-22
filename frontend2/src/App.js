// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import OffersPage from './components/OffersPage';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import Cart from './components/Cart';
import { useAuth } from './contexts/AuthContext';

// Composant de route protégée (inchangé)
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    const { loading } = useAuth(); // Récupération de l'état de chargement

    if (loading) {
        return <div className="text-center mt-5">Chargement de la session...</div>;
    }

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/categories/:category_id" element={<ProtectedRoute><OffersPage /></ProtectedRoute>} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm />} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        </Routes>
    );
    
}

export default App;