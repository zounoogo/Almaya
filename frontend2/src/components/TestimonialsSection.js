import React from 'react';

const TestimonialsSection = () => {
  const testimonials = [
    { text: "Grâce à Almaya, notre présence en ligne a explosé. Leurs stratégies de marketing sont incroyablement efficaces.", name: "Jean Dupont", role: "PDG de StartUp Innov" },
    { text: "L'équipe d'Almaya a su transformer notre vision en une identité visuelle unique et professionnelle. Un grand merci !", name: "Marie Curie", role: "Fondatrice de DesignArt" }
  ];

  return (
    <div className="container-fluid py-5 bg-light">
      <h2 className="text-center fw-bold mb-5">Ce que disent nos clients</h2>
      <div className="row justify-content-center g-4">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="col-md-6 col-lg-5">
            <div className="card h-100 p-4 border-0 shadow-sm">
              <p className="fst-italic">"{testimonial.text}"</p>
              <div className="mt-auto pt-3 border-top">
                <p className="fw-bold mb-0">{testimonial.name}</p>
                <small className="text-muted">{testimonial.role}</small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestimonialsSection;