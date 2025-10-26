import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Endpoint pour récupérer toutes les destinations
        // NOTE: Cet endpoint doit être implémenté dans votre server.js (voir la section suivante)
        const response = await fetch('http://localhost:3001/api/locations');
        
        if (!response.ok) {
          throw new Error('Erreur de réseau ou de serveur lors du chargement des destinations.');
        }

        const data = await response.json();
        setLocations(data);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("Impossible de charger les destinations. Vérifiez la connexion API et le serveur.");
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []); // Exécuté une seule fois au montage

  if (loading) {
    return <div className="text-center py-5"><p>Chargement des destinations...</p></div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger"><p>Erreur: {error}</p></div>;
  }
  
  if (locations.length === 0) {
    return <div className="text-center py-5"><p>Aucune destination n'est disponible pour l'instant.</p></div>;
  }

  return (
    <div id="locations" className="container py-5">
      <h2 className="text-center fw-bold mb-5">Explorez nos Destinations</h2>
      <div className="row g-4 justify-content-center">
        {locations.map((location) => (
          <div key={location.id} className="col-md-4 col-lg-3 text-center">
            {/* Lien vers la page d'offres de cette destination.
              Assurez-vous d'avoir une route React correspondante dans votre App.js, par exemple:
              <Route path="/locations/:location_slug" element={<LocationOffersPage />} /> 
            */}
            <Link to={`/locations/${location.slug}`} className="text-decoration-none text-dark">
              <div className="card h-100 p-3 shadow-sm border-0 hover-shadow-lg transition-300ms">
                {/* Vous pouvez ajouter une icône spécifique ici si votre DB la supporte, 
                  sinon nous utilisons le nom de la ville.
                */}
                <i className="bi bi-geo-alt-fill text-primary display-6 mb-2"></i>
                <h3 className="h6 fw-bold mb-0">{location.name}</h3>
                {location.region && <small className="text-muted">{location.region}</small>}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Locations;