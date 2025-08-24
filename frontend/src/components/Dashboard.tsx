// frontend/src/components/Dashboard.tsx
import React, { useEffect, useState } from 'react';

interface DocumentHistory {
  filename: string;
  type: string;
  confidence: number;
  timestamp: string;
}

interface Stats {
  total_uploads: number;
  avg_confidence: number;
  distribution: Record<string, number>;
  daily_stats: Record<string, number>;
  document_history: DocumentHistory[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/stats');
      if (!res.ok) throw new Error("Erreur réseau");
      const data = await res.json() as Stats;

      const avgConfidence = data.document_history.length > 0
        ? data.document_history.reduce((sum: number, doc) => sum + doc.confidence, 0) / data.document_history.length
        : 0;

      setStats({ ...data, avg_confidence: Number(avgConfidence.toFixed(3)) });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="text-center py-10">Chargement du dashboard...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!stats) return <div className="text-center py-10">Aucune donnée disponible.</div>;

  // 🔹 Obtenir le nombre d'aujourd'hui
  const todayStr = new Date().toISOString().split('T')[0];
  const uploadsToday = stats.daily_stats[todayStr] || 0;

  // 🔹 Préparer les données : 7 derniers jours
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const dailyCounts = last7Days.map(day => {
    const dayStr = day.toISOString().split('T')[0];
    return stats.daily_stats[dayStr] || 0;
  });

  const maxCount = Math.max(...dailyCounts, 1);

  // Format court des jours
  const dayLabels = last7Days.map(d => {
    return new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(d);
  });

  // 🔹 Fonction : Supprimer un document
  const handleDelete = async (filename: string) => {
    if (!window.confirm(`Supprimer ${filename} ?`)) return;

    try {
      const res = await fetch('http://localhost:5000/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });

      if (res.ok) {
        fetchStats(); // Rafraîchir
      }
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  };

  // 🔹 Fonction : Télécharger le document
  const handleDownload = (doc: DocumentHistory) => {
    const blob = new Blob([`Contenu du document: ${doc.filename}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔹 Icône Télécharger
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  // 🔹 Icône Supprimer
  const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  return (
    <section id="dashboard" className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-100 w-full">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          📊 Dashboard en Temps Réel
        </h2>

        {/* Statistiques Globales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg text-gray-600">Total Documents</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {stats.total_uploads}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg text-gray-600">Confiance Moyenne</h3>
            <p className="text-3xl font-bold text-green-600">{(stats.avg_confidence * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg text-gray-600">Types Uniques</h3>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {Object.keys(stats.distribution).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="text-lg text-gray-600">Aujourd'hui</h3>
            <p className="text-3xl font-bold text-orange-600">{uploadsToday}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Répartition par type */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              🔍 Répartition des Documents
            </h3>
            <ul className="space-y-3">
              {Object.entries(stats.distribution).map(([type, count]) => (
                <li key={type} className="flex justify-between items-center py-1 border-b border-gray-100">
                  <span className="font-medium text-gray-700">{type}</span>
                  <span className="px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-full text-sm font-medium">
                    {count}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Histogramme vertical */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              📈 Évolution Quotidienne
            </h3>
            <div className="flex items-end justify-between h-48 space-x-2">
              {dailyCounts.map((count, i) => (
                <div key={i} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm shadow-sm transition-all duration-500 hover:from-blue-600 hover:to-purple-600"
                    style={{
                      height: `${(count / maxCount) * 100}%`,
                      minHeight: '4px',
                    }}
                    title={`${dayLabels[i]}: ${count} document(s)`}
                  ></div>
                  <span className="text-xs font-medium text-gray-700 mt-1">{count}</span>
                  <span className="text-xs text-gray-500 mt-1">{dayLabels[i].charAt(0).toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Historique des documents */}
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            📄 Historique des Documents
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 font-medium text-gray-700">Fichier</th>
                  <th className="text-left py-3 font-medium text-gray-700">Type</th>
                  <th className="text-left py-3 font-medium text-gray-700">Confiance</th>
                  <th className="text-left py-3 font-medium text-gray-700">Date</th>
                  <th className="text-left py-3 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {stats.document_history.slice(-10).reverse().map((doc, i) => (
                  <tr key={i} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">
                    <td className="py-3 text-gray-800">{doc.filename}</td>
                    <td className="py-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-3 text-green-600 font-medium">{(doc.confidence * 100).toFixed(1)}%</td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(doc.timestamp).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 space-x-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        title="Télécharger"
                      >
                        <DownloadIcon />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.filename)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                        title="Supprimer"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;