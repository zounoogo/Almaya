// src/components/MainLayout.js
import React from 'react';
import HeroSection from './HeroSection'; // Le header/navbar
import Footer from './Footer';         // Le footer

// Utilise la propriété 'children' pour injecter le contenu de la page
const MainLayout = ({ children }) => {
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* L'équivalent de votre Header ou Navbar */}
            <HeroSection /> 
            
            {/* Le contenu spécifique à la route (Home, OffersPage, Profile, etc.) */}
            <main className="flex-grow-1">
                {children}
            </main>

            {/* Le Footer */}
            <Footer />
        </div>
    );
};

export default MainLayout;