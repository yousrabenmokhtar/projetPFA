// frontend/src/components/Footer.tsx
"use client";

import React, { useState, useEffect } from 'react';

// SVG Icons améliorés
const FileTextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500);
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

  // Styles d'animation harmonisés avec le hero
  const footerAnimations = `
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

  const features = [
    "Classification automatique",
    "Extraction d'informations", 
    "Analyse OCR avancée",
    "API REST complète"
  ];

  const documentTypes = [
    "Factures commerciales",
    "Bons de commande", 
    "Rapports d'inventaire",
    "Ordres d'expédition"
  ];

  const stats = [
    { value: "99.9%", label: "Disponibilité" },
    { value: "2s", label: "Temps moyen" },
    { value: "24/7", label: "Support" }
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: footerAnimations }} />
      
      <footer className="relative w-full overflow-hidden">
        {/* Fond dynamique avec gradient animé identique au hero */}
        <div className="absolute inset-0 animate-gradient"></div>

        {/* Overlay avec effet glassmorphism */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

        {/* Formes géométriques flottantes avec parallax identiques au hero */}
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

        {/* Bande latérale droite avec effet néon */}
        <div className="absolute right-0 top-0 h-full w-20 glass-effect shadow-2xl z-10">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>
        </div>

        {/* Contenu principal */}
        <div className="relative z-20 w-full px-6 lg:px-16 py-12">
          
          {/* Section principale */}
          <div className={`grid lg:grid-cols-3 md:grid-cols-2 gap-8 lg:gap-12 transition-all duration-1500 transform ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}>
            
            {/* Logo & Description avec animation */}
            <div className="space-y-4 animate-fadeInScale">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-shimmer hover-3d">
                  <FileTextIcon />
                </div>
                <div>
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent animate-textGlow">
                    DocuClassify 
                  </h3>
                  <p className="text-sm text-blue-300 font-medium">IA Professionnelle</p>
                </div>
              </div>
              
              <p className="text-white/90 leading-relaxed text-sm">
                Solution de classification automatique de documents PDF utilisant l'intelligence artificielle avancée. 
                <span className="font-bold text-yellow-300 animate-pulse"> Transformez votre workflow documentaire</span> avec précision.
              </p>
            </div>

            {/* Fonctionnalités avec animations - sans icônes */}
            <div className="animate-fadeInScale" style={{animationDelay: '0.2s'}}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4 flex items-center space-x-2">
                <StarIcon />
                <span>Fonctionnalités</span>
              </h4>
              <ul className="space-y-3">
                {features.map((feature, i) => (
                  <li key={i} className="text-white/90 hover:text-yellow-300 transition-colors duration-300 group cursor-pointer">
                    <span className="group-hover:translate-x-2 transition-transform duration-300 text-sm font-medium">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact avec réseaux sociaux animés */}
            <div className="animate-fadeInScale" style={{animationDelay: '0.4s'}}>
              <h4 className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4">Contact</h4>
              <div className="space-y-4">
                <a
                  href="mailto:contact@docuclassify.com"
                  className="flex items-center space-x-3 text-white/90 hover:text-cyan-400 transition-all duration-300 group p-3 rounded-lg glass-effect hover:shadow-xl"
                >
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 animate-shimmer">
                    <MailIcon />
                  </div>
                  <span className="group-hover:translate-x-2 transition-transform duration-300 font-medium text-sm">contact@docuclassify.com</span>
                </a>

                {/* Réseaux sociaux avec effets spéciaux */}
                <div className="flex space-x-4 pt-2">
                  <a
                    href="https://github.com/yousrabenmokhtar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-3 glass-effect rounded-full hover:shadow-xl transition-all duration-300 hover:scale-110 hover:-rotate-12 group animate-shimmer hover-3d"
                    onMouseEnter={() => setHoveredSocial('github')}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <GithubIcon />
                    {hoveredSocial === 'github' && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 glass-effect text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap animate-fadeInScale">
                        Code source
                      </div>
                    )}
                  </a>
                  
                  <a
                    href="https://www.linkedin.com/in/yousra-ben-mokhtar-14a5b229a/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:shadow-xl transition-all duration-300 hover:scale-110 hover:rotate-12 group animate-shimmer hover-3d"
                    onMouseEnter={() => setHoveredSocial('linkedin')}
                    onMouseLeave={() => setHoveredSocial(null)}
                  >
                    <LinkedinIcon />
                    {hoveredSocial === 'linkedin' && (
                      <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 glass-effect text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap animate-fadeInScale">
                        LinkedIn
                      </div>
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Séparateur animé avec gradient identique */}
          <div className="my-12 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-pulse"></div>

          {/* Copyright avec animation - centré */}
          <div className={`text-center transition-all duration-1500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <p className="text-white/80 text-sm">
              © 2025 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">DocuClassify</span>. Tous droits réservés.
            </p>
          </div>
        </div>

        {/* Effet de vagues en haut */}
        <div className="absolute top-0 left-0 right-0 transform rotate-180">
          <svg viewBox="0 0 1440 120" className="w-full h-20 fill-white/10">
            <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </footer>
    </>
  );
};

export default Footer;