// frontend/src/components/ResultDisplay.tsx
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface Result {
  predicted_class: string;
  confidence: number;
  extracted_info: Record<string, any>;
}

interface Props {
  result: Result | null;
  loading: boolean;
}

const ResultDisplay: React.FC<Props> = ({ result, loading }) => {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!result || !result.predicted_class) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mt-8 text-center">
        <p className="text-gray-500">Aucun résultat disponible.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Résultat de classification</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Type de document</h3>
          <p className="text-2xl text-blue-600 font-bold">{result.predicted_class}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">Confiance</h3>
          <p className="text-2xl text-green-600 font-bold">{Math.round(result.confidence * 100)}%</p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Informations extraites</h3>
        {Object.keys(result.extracted_info).length === 0 ? (
          <p className="text-gray-500">Aucune information trouvée.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(result.extracted_info).map(([key, value]) => (
              <li key={key} className="flex justify-between border-b pb-1">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-600">{Array.isArray(value) ? `${value.length} éléments` : value || '–'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ResultDisplay;