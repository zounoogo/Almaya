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

// Importez les composants de formulaire d'administration
import LocationCreateForm from './components/admin/LocationCreateForm'; 
import LocationEditForm from './components/admin/LocationEditForm';   
import OfferCreateForm from './components/admin/OfferCreateForm';     
import OfferEditForm from './components/admin/OfferEditForm';         
import CategoryCreateForm from './components/admin/CategoryCreateForm';
import CategoryEditForm from './components/admin/CategoryEditForm';

// Composant de route protégée (pour tous les utilisateurs connectés)
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

// Composant de route Admin (double protection : connecté ET isAdmin)
const AdminRoute = ({ children }) => {
    const { user, isAdmin, loading } = useAuth();
    
    if (loading) {
        return <div className="text-center mt-5">Vérification des permissions...</div>;
    }
    
    if (!user || !isAdmin) {
        return <Navigate to="/" replace />;
    }
    return children;
};


function App() {
    const { loading } = useAuth(); 

    if (loading) {
        return <div className="text-center mt-5">Chargement de la session...</div>;
    }

    const WrappedRoute = ({ children }) => (
        <ProtectedRoute>
            <MainLayout>{children}</MainLayout>
        </ProtectedRoute>
    );
    
    const AdminWrappedRoute = ({ children }) => (
        <AdminRoute>
            <MainLayout>{children}</MainLayout>
        </AdminRoute>
    );

    return (
        <Routes>
            {/* ------------------------------------------- */}
            {/* ROUTES UTILISATEURS / PUBLIQUES */}
            {/* ------------------------------------------- */}
            <Route path="/" element={<WrappedRoute><Home /></WrappedRoute>} />
            
            {/* Catégories et Offres par Catégorie */}
            {/* NOTE: On laisse category_id ici pour la compatibilité, mais on utilise le slug pour l'admin */}
            <Route path="/categories/:category_id" element={<WrappedRoute><OffersPage /></WrappedRoute>} />
            
            <Route path="/locations" element={<WrappedRoute><Locations /></WrappedRoute>} /> 
            <Route path="/locations/:location_slug" element={<WrappedRoute><LocationOffersPage /></WrappedRoute>} /> 
            <Route path="/profile" element={<WrappedRoute><Profile /></WrappedRoute>} />
            <Route path="/cart" element={<WrappedRoute><Cart /></WrappedRoute>} />
            <Route path="/paidpages" element={<WrappedRoute><PaidPages /></WrappedRoute>} />
            
            {/* ------------------------------------------- */}
            {/* ROUTES D'ADMINISTRATION PROTÉGÉES */}
            {/* ------------------------------------------- */}

            {/* Destinations CRUD */}
            <Route path="/admin/locations/create" element={<AdminWrappedRoute><LocationCreateForm /></AdminWrappedRoute>} />
            <Route path="/admin/locations/edit/:slug" element={<AdminWrappedRoute><LocationEditForm /></AdminWrappedRoute>} />

            {/* Offres CRUD (Global ou par Destination) */}
            {/* Routes génériques (si l'offre n'est pas attachée à une catégorie spécifique) */}
            <Route path="/admin/offers/create" element={<AdminWrappedRoute><OfferCreateForm /></AdminWrappedRoute>} />
            <Route path="/admin/offers/edit/:id" element={<AdminWrappedRoute><OfferEditForm /></AdminWrappedRoute>} />

            {/* 👇 NOUVELLES ROUTES ADMIN POUR OFFRES LIÉES À UNE CATÉGORIE (via SLUG) */}
            <Route 
                path="/categories/:categorySlug/admin/create-offer" 
                element={<AdminWrappedRoute><OfferCreateForm /></AdminWrappedRoute>} 
            />
            <Route 
                path="/categories/:categorySlug/admin/edit-offer/:offer_id" 
                element={<AdminWrappedRoute><OfferEditForm /></AdminWrappedRoute>} 
            />
            
            {/* Catégories CRUD */}
            <Route path="/admin/categories/create" element={<AdminWrappedRoute><CategoryCreateForm /></AdminWrappedRoute>} />
            <Route path="/admin/categories/edit/:slug" element={<AdminWrappedRoute><CategoryEditForm /></AdminWrappedRoute>} />
            
            {/* ------------------------------------------- */}
            {/* Routes SANS mise en page (Auth, Success) */}
            {/* ------------------------------------------- */}
            <Route path="/login" element={<AuthForm />} />
            <Route path="/register" element={<AuthForm />} />
            <Route path="/verification-success" element={<VerificationSuccess />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;