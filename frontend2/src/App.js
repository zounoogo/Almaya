// src/App.js
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Home';
import OffersPage from './components/OffersPage';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import Cart from './components/Cart';
import Locations from './components/Locations';
import LocationOffersPage from './components/LocationOffersPage';
import MainLayout from './components/MainLayout'; // <-- NOUVEL IMPORT DU LAYOUT
import { useAuth } from './contexts/AuthContext';
import PaidPages from './components/PaidPages';

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

    // Les composants protégés et affichés dans la mise en page commune
    const WrappedRoute = ({ children }) => (
        <ProtectedRoute>
            <MainLayout>{children}</MainLayout>
        </ProtectedRoute>
    );

    return (
        <Routes>
            {/* Routes qui utilisent la mise en page (Header/Footer) ET sont protégées */}
            <Route path="/" element={<WrappedRoute><Home /></WrappedRoute>} />
            <Route path="/categories/:category_id" element={<WrappedRoute><OffersPage /></WrappedRoute>} />
            <Route path="/locations" element={<WrappedRoute><Locations /></WrappedRoute>} /> 
            <Route path="/locations/:location_slug" element={<WrappedRoute><LocationOffersPage /></WrappedRoute>} /> 
            <Route path="/profile" element={<WrappedRoute><Profile /></WrappedRoute>} />
            <Route path="/cart" element={<WrappedRoute><Cart /></WrappedRoute>} />
            <Route path="/paidpages" element={<WrappedRoute><PaidPages /></WrappedRoute>} />

            {/* Routes SANS mise en page (souvent pour le plein écran comme AuthForm) */}
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm />} />
        </Routes>
    );
}

export default App;