// frontend/src/components/HeroSection.tsx
import React, { useState, useEffect } from 'react';

const HeroSection: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Textes qui défilent
  const dynamicTexts = [
    "Classification Intelligente",
    "Analyse Automatisée", 
    "IA de Pointe",
    "Précision Maximale"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  // Effet typewriter pour les textes dynamiques
  useEffect(() => {
    const currentText = dynamicTexts[textIndex];
    let charIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (charIndex <= currentText.length) {
        setDisplayText(currentText.slice(0, charIndex));
        charIndex++;
      } else {
        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % dynamicTexts.length);
          setDisplayText('');
        }, 2000);
        clearInterval(typeInterval);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [textIndex]);

  // Suivi de la souris pour les effets parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fonction pour scroller vers la zone d'upload
  const scrollToUpload = () => {
    const uploadSection = document.getElementById('upload-section');
    if (uploadSection) {
      uploadSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Styles d'animation personnalisés
  const heroAnimations = `
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
    .typewriter-cursor::after {
      content: '|';
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0; }
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
      <style dangerouslySetInnerHTML={{ __html: heroAnimations }} />
      
      <section id="home" className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Fond dynamique avec gradient animé */}
        <div className="absolute inset-0 animate-gradient"></div>

        {/* Overlay avec effet glassmorphism */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

        {/* Bande latérale gauche avec effet néon */}
        <div className="absolute left-0 top-0 h-full w-20 glass-effect shadow-2xl z-10">
          <div className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Formes géométriques flottantes avec parallax */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cercles morphing */}
          <div 
            className="absolute w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-600/30 rounded-full blur-xl animate-morphing"
            style={{
              top: '20%',
              left: '10%',
              transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`
            }}
          ></div>
          <div 
            className="absolute w-24 h-24 bg-gradient-to-r from-pink-400/30 to-cyan-500/30 rounded-full blur-lg animate-float"
            style={{
              top: '60%',
              right: '15%',
              transform: `translate(${mousePosition.x * -0.015}px, ${mousePosition.y * 0.01}px)`
            }}
          ></div>
          <div 
            className="absolute w-40 h-40 bg-gradient-to-r from-green-400/20 to-blue-500/20 rounded-full blur-2xl animate-float-delayed-2"
            style={{
              bottom: '20%',
              left: '20%',
              transform: `translate(${mousePosition.x * 0.025}px, ${mousePosition.y * -0.02}px)`
            }}
          ></div>

          {/* Particules brillantes améliorées */}
          {[...Array(20)].map((_, i) => (
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

        {/* Contenu principal avec effets 3D */}
        <div className={`relative z-20 text-center px-6 sm:px-12 lg:px-24 xl:px-32 w-full transition-all duration-1500 transform ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          
          {/* Badge IA avec effet shimmer */}
          <div className="inline-block mb-8 px-6 py-3 glass-effect rounded-full text-base font-semibold text-white shadow-2xl animate-fadeInScale animate-shimmer hover-3d group">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                 IA Avancée • Classification Automatique
              </span>
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
            </div>
          </div>

          {/* Titre principal avec effet glow */}
          <div className="space-y-4 mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-black leading-none bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-textGlow">
              Classification
            </h1>
            
            {/* Texte dynamique avec typewriter */}
            <div className="h-20 flex items-center justify-center">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent typewriter-cursor">
                {displayText}
              </h2>
            </div>
          </div>

          {/* Sous-titre avec animation wave */}
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-10 leading-relaxed max-w-5xl mx-auto font-medium animate-fadeInScale">
            Transformez vos documents PDF en données structurées avec notre 
            <span className="font-bold text-yellow-300 animate-pulse"> IA de pointe</span>. 
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-bold">Classification précise</span> et 
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">extraction automatique</span> en quelques secondes.
          </p>

          {/* Boutons avec effets 3D améliorés */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fadeInScale mb-12">
            <button
              onClick={scrollToUpload}
              className="group px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 flex items-center gap-3 hover-3d animate-shimmer"
            >
              <svg className="w-6 h-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span> Commencer l'analyse</span>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            </button>
            
            <button
              onClick={() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' })}
              className="group px-8 py-4 glass-effect text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 transition-all duration-500 flex items-center gap-3 hover-3d"
            >
              <svg className="w-6 h-6 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Voir le Dashboard</span>
            </button>
          </div>

          {/* Stats avec compteurs animés */}
          <div className="flex flex-wrap justify-center gap-8 lg:gap-16 animate-fadeInScale">
            {[
              { value: '2,677+', label: 'Documents traités', icon: '📄', color: 'from-green-400 to-emerald-500' },
              { value: '94%', label: 'Précision moyenne', icon: '🎯', color: 'from-blue-400 to-cyan-500' },
              { value: '2s', label: 'Temps d\'analyse', icon: '⚡', color: 'from-purple-400 to-pink-500' }
            ].map((stat, i) => (
              <div key={i} className="group text-center cursor-pointer hover-3d">
                <div className="glass-effect p-4 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 transform group-hover:scale-110">
                  <div className="text-3xl mb-2 animate-bounce" style={{animationDelay: `${i * 0.2}s`}}>
                    {stat.icon}
                  </div>
                  <div className={`text-2xl lg:text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent animate-pulse`}>
                    {stat.value}
                  </div>
                  <div className="text-sm lg:text-base text-white/80 font-medium mt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Indicateur de scroll avec animation personnalisée */}
          <div className="mt-16 flex flex-col items-center space-y-4">
            <div className="text-white/60 text-sm font-medium animate-pulse">
              Découvrez nos fonctionnalités
            </div>
            <div 
              className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center cursor-pointer hover:border-white/80 transition-colors duration-300"
              onClick={scrollToUpload}
            >
              <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </div>

        {/* Flèche améliorée avec effet pulsant */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer group" onClick={scrollToUpload}>
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-ping"></div>
            <div className="relative p-4 glass-effect rounded-full group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 text-white animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Effet de vagues en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white/10">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default HeroSection;