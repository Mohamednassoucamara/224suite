import React, { useState } from 'react';
import apiService from '../services/api';

const RegisterTest: React.FC = () => {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        phone: '+224611925997',
        password: 'P@ssw0rd1',
        role: 'user'
      };

      console.log('Envoi des données:', userData);
      const response = await apiService.register(userData);
      console.log('Réponse reçue:', response);
      
      setResult(`✅ Succès: ${response.message}`);
    } catch (error) {
      console.error('Erreur détaillée:', error);
      setResult(`❌ Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const userData = {
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
        phone: '+224611925997',
        password: 'P@ssw0rd1',
        role: 'user'
      };

      console.log('Test direct fetch avec:', userData);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      console.log('Status:', response.status);
      console.log('Headers:', response.headers);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur HTTP:', errorText);
        setResult(`❌ Erreur HTTP ${response.status}: ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Données reçues:', data);
      setResult(`✅ Succès direct: ${data.message}`);
    } catch (error) {
      console.error('Erreur fetch direct:', error);
      setResult(`❌ Erreur fetch: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Test d'Inscription API
      </h3>
      
      <div className="space-y-4">
        <button
          onClick={testRegister}
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? 'Test en cours...' : 'Test via apiService'}
        </button>

        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="btn-secondary w-full"
        >
          {loading ? 'Test en cours...' : 'Test direct fetch'}
        </button>

        {result && (
          <div className={`p-3 rounded-lg ${
            result.startsWith('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {result}
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>Vérifiez la console du navigateur pour plus de détails.</p>
      </div>
    </div>
  );
};

export default RegisterTest;
