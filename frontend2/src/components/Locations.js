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
          <div key={location.id} className="col-6 col-md-4 col-lg-3 text-center">
            {/* Lien vers la page d'offres de cette destination. */}
            <Link to={`/locations/${location.slug}`} className="text-decoration-none text-dark">
              <div className="card h-100 p-2 shadow-sm border-0 hover-shadow-lg transition-300ms overflow-hidden">
                {/* Affiche l'image de la destination ou un fallback */}
                {location.image ? (
                  <img 
                    src={location.image} 
                    alt={`Vue de ${location.name}`} 
                    className="img-fluid rounded mb-3" 
                    style={{ height: '150px', width: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  // Fallback si la colonne 'image' est NULL (affiche l'icône originale)
                  <div className="d-flex justify-content-center align-items-center mb-3 bg-light rounded" style={{ height: '150px' }}>
                    <i className="bi bi-geo-alt-fill text-primary display-6"></i>
                  </div>
                )}

                <h3 className="h6 fw-bold mb-0 mt-2">{location.name}</h3>
                {location.region && <small className="text-muted">{location.region}</small>}
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default React.memo(Locations);