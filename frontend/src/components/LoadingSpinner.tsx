// frontend/src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center py-8">
    {/* Spinner */}
    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    
    {/* Titre */}
    <h3 className="text-lg font-semibold text-gray-700 mt-4">Analyzing Your Document</h3>
    
    {/* Sous-titre */}
    <p className="text-sm text-gray-500 mt-1">Our AI is processing your PDF and extracting key information</p>
    
    {/* Barre de progression */}
    <div className="w-40 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" style={{ width: '60%' }}></div>
    </div>
  </div>
);

export default LoadingSpinner;