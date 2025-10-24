import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Database, Server } from 'lucide-react';
import apiService from '../services/api';

const BackendStatus = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(null);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setLoading(true);
    setLastCheck(new Date());
    
    try {
      // Test de la santé de l'API
      const healthResponse = await apiService.healthCheck();
      setApiStatus(healthResponse);
      
      // Test de la base de données via les statistiques
      await apiService.getStats();
      setDbStatus({ status: 'OK', message: 'Base de données connectée' });
    } catch (error) {
      console.error('Erreur lors du test de connexion:', error);
      setApiStatus({ status: 'ERROR', message: error.message });
      setDbStatus({ status: 'ERROR', message: 'Impossible de tester la base de données' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
            <span className="text-sm text-gray-600">Vérification...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">Statut Backend</h4>
          <button
            onClick={checkApiStatus}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            Rafraîchir
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Statut de l'API */}
          <div className="flex items-center space-x-2">
            <Server className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">API:</span>
            {apiStatus?.status === 'OK' ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">OK</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600">Erreur</span>
              </>
            )}
          </div>

          {/* Statut de la base de données */}
          <div className="flex items-center space-x-2">
            <Database className="w-3 h-3 text-gray-600" />
            <span className="text-xs text-gray-600">DB:</span>
            {dbStatus?.status === 'OK' ? (
              <>
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs text-green-600">OK</span>
              </>
            ) : (
              <>
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-600">Erreur</span>
              </>
            )}
          </div>

          {/* Timestamp */}
          {lastCheck && (
            <div className="text-xs text-gray-500 pt-1 border-t border-gray-100">
              Dernière vérification: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Message d'erreur détaillé */}
        {apiStatus?.status === 'ERROR' && (
          <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-800">{apiStatus.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BackendStatus;
