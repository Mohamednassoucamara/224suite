import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2, Database, Server } from 'lucide-react';
import apiService from '../services/api';

const ApiStatus = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    setLoading(true);
    
    try {
      // Test de la santé de l'API
      const healthResponse = await apiService.healthCheck();
      setApiStatus(healthResponse);
      
      // Test de la connexion à la base de données
      const dbResponse = await apiService.testDatabaseConnection();
      setDbStatus(dbResponse);
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
      <div className="card p-6 text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary-600" />
        <p className="text-gray-600">Vérification de la connexion...</p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold mb-4">Statut de l'API</h3>
      
      <div className="space-y-4">
        {/* Statut de l'API */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Server className="w-5 h-5 text-gray-600" />
            <span className="font-medium">API Backend</span>
          </div>
          <div className="flex items-center space-x-2">
            {apiStatus?.status === 'OK' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 text-sm">Opérationnel</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600 text-sm">Erreur</span>
              </>
            )}
          </div>
        </div>

        {/* Statut de la base de données */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-gray-600" />
            <span className="font-medium">Base de données</span>
          </div>
          <div className="flex items-center space-x-2">
            {dbStatus?.status === 'OK' ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 text-sm">Connectée</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-600 text-sm">Erreur</span>
              </>
            )}
          </div>
        </div>

        {/* Détails de l'API */}
        {apiStatus && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Détails de l'API</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>Message:</strong> {apiStatus.message}</p>
              <p><strong>Base de données:</strong> {apiStatus.database}</p>
              <p><strong>Timestamp:</strong> {new Date(apiStatus.timestamp).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Détails de la base de données */}
        {dbStatus && dbStatus.status === 'OK' && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Détails de la base de données</h4>
            <div className="text-sm text-green-800 space-y-1">
              <p><strong>Message:</strong> {dbStatus.message}</p>
              <p><strong>Base de données:</strong> {dbStatus.database}</p>
              <p><strong>Hôte:</strong> {dbStatus.host}</p>
              <p><strong>Port:</strong> {dbStatus.port}</p>
            </div>
          </div>
        )}

        {/* Bouton de rafraîchissement */}
        <div className="mt-4">
          <button
            onClick={checkApiStatus}
            className="btn-primary w-full"
          >
            Rafraîchir le statut
          </button>
        </div>

        {/* Messages d'erreur */}
        {apiStatus?.status === 'ERROR' && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-900 mb-2">Erreur de connexion</h4>
            <p className="text-sm text-red-800">{apiStatus.message}</p>
            <div className="mt-2 text-xs text-red-700">
              <p>Vérifiez que :</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Le serveur backend est démarré</li>
                <li>L'URL de l'API est correcte</li>
                <li>Votre connexion internet fonctionne</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiStatus;
