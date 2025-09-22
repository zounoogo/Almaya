import React from 'react';

const AboutSection = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        <div className="col-lg-6 mb-4 mb-lg-0">
          <h2 className="fw-bold mb-3">Pourquoi choisir Almaya ?</h2>
          <p className="text-muted">
            Chez Almaya, nous ne nous contentons pas de fournir des services ; nous construisons des partenariats. Notre équipe d'experts est dédiée à la réussite de votre projet, en vous offrant une approche sur mesure, une expertise certifiée et une transparence totale.
          </p>
          <ul className="list-unstyled mt-4">
            <li><i className="bi bi-person-fill-check text-success me-2"></i> Approche personnalisée et centrée sur le client</li>
            <li><i className="bi bi-trophy-fill text-success me-2"></i> Expertise de pointe dans chaque domaine</li>
            <li><i className="bi bi-eye-fill text-success me-2"></i> Transparence et communication à chaque étape</li>
          </ul>
        </div>
        <div className="col-lg-6 text-center">
          
        </div>
      </div>
    </div>
  );
};

export default AboutSection;