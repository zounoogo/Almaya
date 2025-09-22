import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  // Données de catégories statiques, codées directement dans le fichier
  const categories = [
    { id: "guide-touristique", name: "Guide Touristique", description: "Accompagnement personnalisé et visites guidées inoubliables.", icon: "bi-compass-fill" },
    { id: "attractions", name: "Attractions", description: "Réservation et découverte des lieux incontournables.", icon: "bi-geo-alt-fill" },
    { id: "transport", name: "Transport", description: "Organisation de vos déplacements, du bus au taxi.", icon: "bi-bus-front-fill" },
    { id: "hebergement", name: "Hébergement", description: "Sélection des meilleurs hôtels et hébergements pour votre séjour.", icon: "bi-house-heart-fill" }
  ];

  return (
    <div id="categories" className="container py-5">
      <h2 className="text-center fw-bold mb-5">Nos Catégories de Services</h2>
      <div className="row g-4">
        {categories.map((category) => (
          <div key={category.id} className="col-md-6 col-lg-3 text-center">
            <Link to={`/categories/${category.id}`} className="text-decoration-none text-dark">
              <div className="card h-100 p-4 shadow-sm border-0">
                <i className={`bi ${category.icon} text-primary display-4 mb-3`}></i>
                <h3 className="h5 fw-bold">{category.name}</h3>
                <p className="text-muted">{category.description}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Categories;