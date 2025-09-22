// src/Home.js
import React from 'react';
import HeroSection from './components/HeroSection';
import Categories from './components/Categories'; // Le composant a été renommé
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';

function Home() {
  return (
    <div className="Home">
      <HeroSection />
      <Categories />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
}
export default Home;