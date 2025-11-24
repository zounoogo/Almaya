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
import MainLayout from './components/MainLayout';
import { useAuth } from './contexts/AuthContext';
import PaidPages from './components/PaidPages';
import VerificationSuccess from './components/VerificationSuccess'; 

// Importez les nouveaux composants de formulaire d'administration (à créer)
import LocationCreateForm from './components/admin/LocationCreateForm'; // A créer
import LocationEditForm from './components/admin/LocationEditForm';   // A créer
import OfferCreateForm from './components/admin/OfferCreateForm';     // A créer
import OfferEditForm from './components/admin/OfferEditForm';         // A créer


// Composant de route protégée (pour tous les utilisateurs connectés)
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// ✅ NOUVEAU : Composant de route Admin (double protection)
const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();
    
    // Si la session est encore en chargement, attendez
    if (loading) {
        return <div className="text-center mt-5">Vérification des permissions...</div>;
    }
    
    // Si l'utilisateur n'est pas connecté OU s'il n'est pas admin, rediriger vers l'accueil
    if (!user || !isAdmin) {
        // NOTE : On redirige vers l'accueil ou le login pour masquer l'existence des pages
        return <Navigate to="/" replace />;
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
    
    // ✅ NOUVEAU : Wrapper pour les routes Admin avec MainLayout
    const AdminWrappedRoute = ({ children }) => (
        <AdminRoute>
            <MainLayout>{children}</MainLayout>
        </AdminRoute>
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
            
            {/* ======================================= */}
            {/* ✅ ROUTES D'ADMINISTRATION PROTÉGÉES */}
            {/* ======================================= */}

            {/* Destinations CRUD */}
            <Route path="/admin/locations/create" element={<AdminWrappedRoute><LocationCreateForm /></AdminWrappedRoute>} />
            <Route path="/admin/locations/edit/:slug" element={<AdminWrappedRoute><LocationEditForm /></AdminWrappedRoute>} />

            {/* Offres CRUD */}
            <Route path="/admin/offers/create" element={<AdminWrappedRoute><OfferCreateForm /></AdminWrappedRoute>} />
            <Route path="/admin/offers/edit/:id" element={<AdminWrappedRoute><OfferEditForm /></AdminWrappedRoute>} />
            
            {/* ======================================= */}
            {/* Routes SANS mise en page (souvent pour le plein écran comme AuthForm) */}
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            
            {/* Route Catch-all (si vous en avez besoin) */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;