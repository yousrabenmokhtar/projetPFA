import React, { useState, useEffect } from 'react';

interface Props {
  onFileUpload: (file: File) => void;
}

const UploadSection: React.FC<Props> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Suivi de la souris pour les effets parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      onFileUpload(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf' && file.size <= 10 * 1024 * 1024) {
      onFileUpload(file);
    }
  };

  // Styles d'animation identiques au footer
  const uploadAnimations = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-10px) rotate(1deg); }
      50% { transform: translateY(-5px) rotate(0deg); }
      75% { transform: translateY(-15px) rotate(-1deg); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes shimmer {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.8) translateY(30px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
    @keyframes textGlow {
      0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
      50% { text-shadow: 0 0 20px rgba(147, 51, 234, 0.7), 0 0 30px rgba(59, 130, 246, 0.5); }
    }
    @keyframes morphing {
      0%, 100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.3); }
      50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.3); }
    }
    .animate-gradient {
      background: linear-gradient(-45deg, #8b5cf6, #3b82f6, #06b6d4, #10b981);
      background-size: 400% 400%;
      animation: gradientShift 6s ease infinite;
    }
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    .animate-float-delayed {
      animation: float 6s ease-in-out infinite;
      animation-delay: -2s;
    }
    .animate-float-delayed-2 {
      animation: float 6s ease-in-out infinite;
      animation-delay: -4s;
    }
    .animate-shimmer {
      position: relative;
      overflow: hidden;
    }
    .animate-shimmer::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      animation: shimmer 3s infinite;
    }
    .animate-fadeInScale {
      animation: fadeInScale 0.8s ease-out forwards;
    }
    .animate-textGlow {
      animation: textGlow 3s ease-in-out infinite;
    }
    .animate-morphing {
      animation: morphing 8s ease-in-out infinite;
    }
    .animate-pulse-glow {
      animation: pulse-glow 2s ease-in-out infinite;
    }
    .glass-effect {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .hover-3d {
      transform-style: preserve-3d;
      transition: transform 0.3s ease;
    }
    .hover-3d:hover {
      transform: perspective(1000px) rotateX(10deg) rotateY(-10deg) translateZ(20px);
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: uploadAnimations }} />
      
      <div className="relative py-16 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Fond dynamique avec gradient animé identique au footer */}
        <div className="absolute inset-0 animate-gradient"></div>

        {/* Overlay avec effet glassmorphism */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

        {/* Formes géométriques flottantes avec parallax */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cercles morphing */}
          <div 
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-xl animate-morphing"
            style={{
              top: '15%',
              left: '10%',
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          ></div>
          <div 
            className="absolute w-24 h-24 bg-gradient-to-r from-pink-400/30 to-cyan-500/30 rounded-full blur-lg animate-float"
            style={{
              top: '70%',
              right: '15%',
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.01}px)`
            }}
          ></div>
          <div 
            className="absolute w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-float-delayed-2"
            style={{
              bottom: '10%',
              left: '20%',
              transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.02}px)`
            }}
          ></div>

          {/* Particules brillantes */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)',
                transform: `translate(${mousePosition.x * (0.01 + Math.random() * 0.02)}px, ${mousePosition.y * (0.01 + Math.random() * 0.02)}px)`
              }}
            ></div>
          ))}
        </div>

        {/* Contenu principal */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-6">
          <div className={`transition-all duration-1500 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            
            {/* Titre avec effet glow */}
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-textGlow mb-4">
              Téléchargez votre document
            </h2>
            <p className="text-white/80 mb-12 font-medium">
              Formats supportés: <span className="text-yellow-300 font-bold">PDF</span> • Taille max: <span className="text-cyan-300 font-bold">10MB</span>
            </p>

            {/* Zone de téléchargement avec glassmorphism */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative p-12 rounded-3xl shadow-2xl border-2 transition-all duration-500 transform hover:scale-105 animate-fadeInScale glass-effect hover-3d ${
                isDragging 
                  ? 'border-yellow-400 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse-glow' 
                  : 'border-white/30 hover:border-purple-400/50'
              }`}
            >
              {/* Icône avec animation */}
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-lg transition-all duration-300 animate-shimmer ${
                  isDragging ? 'animate-pulse scale-110' : 'hover:scale-110 hover:rotate-12'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
              </div>

              <p className="text-xl text-white font-bold mb-2">
                {isDragging ? 'Déposez votre fichier ici !' : 'Glissez-déposez votre PDF'}
              </p>
              <p className="text-white/70 mb-8 font-medium">ou cliquez pour sélectionner</p>

              {/* Bouton stylé */}
              <label
                htmlFor="pdf-upload"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white font-bold rounded-full cursor-pointer hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 animate-shimmer hover-3d"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Sélectionner un fichier
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={handleChange}
                className="hidden"
                id="pdf-upload"
              />

              {/* Effet de brillance au survol */}
              <div className="absolute inset-0 rounded-3xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-3xl"></div>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/60 text-sm">
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Sécurisé</span>
              </div>
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Traitement rapide</span>
              </div>
              <div className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>IA avancée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadSection;