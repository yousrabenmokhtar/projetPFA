import React from 'react';

const Features: React.FC = () => {
  const features = [
    {
      title: "IA BERT Avancée",
      description: "Modèle de deep learning entraîné spécifiquement pour la classification de documents d'entreprise",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707-.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgColor: "bg-blue-50",
    },
    {
      title: "Traitement Ultra-Rapide",
      description: "Classification et extraction d'informations en moins de 2 secondes par document",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      bgColor: "bg-amber-50",
    },
    {
      title: "Sécurité Garantie",
      description: "Vos documents sont traités de manière sécurisée et ne sont jamais stockés sur nos serveurs",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgColor: "bg-emerald-50",
    },
    {
      title: "Précision Élevée",
      description: "94% de précision moyenne sur tous les types de documents avec amélioration continue",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section id="features" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Pourquoi Choisir Notre Solution ?</h2>
        <p className="text-lg text-gray-600 mb-12">
          Une technologie de pointe pour automatiser votre traitement documentaire
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md ${feature.bgColor} transition-transform hover:-translate-y-2 hover:shadow-lg`}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;