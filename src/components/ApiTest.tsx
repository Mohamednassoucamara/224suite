import React, { useState } from 'react';
import apiService from '../services/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testHealthCheck = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.healthCheck();
      setHealthStatus(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Test API Backend</h3>
      
      <button
        onClick={testHealthCheck}
        disabled={loading}
        className="btn-primary mb-4"
      >
        {loading ? 'Test en cours...' : 'Tester la connexion API'}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">Erreur: {error}</p>
        </div>
      )}

      {healthStatus && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <h4 className="font-medium text-green-800 mb-2">✅ API Connectée</h4>
          <pre className="text-sm text-green-700">
            {JSON.stringify(healthStatus, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
