import React from 'react';
import { FileText, Shield, Users, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigation } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const TermsPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Conditions d\'utilisation', page: 'terms' }]} />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Conditions d'utilisation</h1>
          <p className="text-xl text-gray-600">Dernière mise à jour : 1er janvier 2024</p>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
          <p className="text-gray-600 mb-4">
            Bienvenue sur 224Suite, la plateforme immobilière de référence à Conakry. 
            Ces conditions d'utilisation régissent votre utilisation de notre service.
          </p>
          <p className="text-gray-600">
            En accédant à 224Suite, vous acceptez d'être lié par ces conditions. 
            Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Acceptation des conditions</h3>
                <p className="text-gray-600">
                  En utilisant la plateforme 224Suite, vous acceptez d'être lié par ces conditions d'utilisation.
                </p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Utilisation du service</h3>
                <p className="text-gray-600">
                  224Suite est une plateforme immobilière destinée à faciliter la recherche et la publication d'offres.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 bg-primary-500 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Questions sur nos conditions ?</h2>
          <button 
            onClick={() => setCurrentPage('contact')}
            className="btn-secondary bg-white text-primary-600 hover:bg-gray-100"
          >
            Nous contacter
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
