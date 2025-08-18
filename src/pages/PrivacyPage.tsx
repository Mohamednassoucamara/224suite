import React from 'react';
import { Shield, Eye, Lock, Database, Users } from 'lucide-react';
import { useNavigation } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const PrivacyPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();

  const dataTypes = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Informations personnelles',
      items: ['Nom et prénom', 'Adresse email', 'Numéro de téléphone', 'Adresse postale']
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Données de profil',
      items: ['Type d\'utilisateur', 'Préférences de recherche', 'Historique d\'activité']
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Données d\'utilisation',
      items: ['Pages visitées', 'Temps passé sur le site', 'Recherches effectuées']
    }
  ];

  const purposes = [
    'Fournir nos services immobiliers',
    'Personnaliser votre expérience',
    'Communiquer avec vous',
    'Améliorer nos services',
    'Assurer la sécurité de la plateforme'
  ];

  const rights = [
    'Accéder à vos données personnelles',
    'Rectifier vos informations',
    'Supprimer votre compte',
    'Exporter vos données',
    'Retirer votre consentement'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'Politique de confidentialité', page: 'privacy' }]} />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Politique de confidentialité</h1>
          <p className="text-xl text-gray-600">Dernière mise à jour : 1er janvier 2024</p>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Introduction</h2>
          <p className="text-gray-600 mb-4">
            Chez 224Suite, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
          </p>
          <p className="text-gray-600">
            Cette politique explique comment nous collectons, utilisons et protégeons vos informations 
            lorsque vous utilisez notre plateforme immobilière.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {dataTypes.map((type, index) => (
            <div key={index} className="card p-6">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                {type.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">{type.title}</h3>
              <ul className="space-y-2 text-gray-600">
                {type.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Utilisation des données</h3>
                <ul className="space-y-2 text-gray-600">
                  {purposes.map((purpose, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {purpose}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vos droits</h3>
                <ul className="space-y-2 text-gray-600">
                  {rights.map((right, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {right}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Sécurité des données</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              Nous mettons en place des mesures de sécurité techniques et organisationnelles 
              appropriées pour protéger vos données personnelles contre l'accès non autorisé, 
              la modification, la divulgation ou la destruction.
            </p>
            <p>
              Vos données sont stockées sur des serveurs sécurisés et nous utilisons 
              le chiffrement SSL pour protéger les transmissions de données.
            </p>
          </div>
        </div>

        <div className="card p-8 bg-primary-500 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Questions sur la confidentialité ?</h2>
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

export default PrivacyPage;
