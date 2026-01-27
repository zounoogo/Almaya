// src/Home.js
import Categories from './components/Categories'; // Le composant a été renommé
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';


function Home() {
  return (
    <div className="Home">
      <Categories />
      <AboutSection />
      <TestimonialsSection />
    </div>
  );
}
export default Home;