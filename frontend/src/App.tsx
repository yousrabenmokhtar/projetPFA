// frontend/src/App.tsx
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import UploadSection from './components/UploadSection';
function App() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setResult({ error: "Erreur de connexion au serveur." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <HeroSection />

        <Features />
      <div id="upload-section" className="mt-6 p-4 text-red-700 rounded-lg">
          <UploadSection onFileUpload={handleFileUpload} />
          <ResultDisplay result={result} loading={loading} />
        </div>
        
        <Dashboard />
      </main>

      <Footer />
    </div>
  );
}

export default App;