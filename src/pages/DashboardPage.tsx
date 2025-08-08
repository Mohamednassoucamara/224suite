import React, { useState } from 'react';
import { 
  Home, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Heart, 
  MessageCircle, 
  Calendar,
  TrendingUp,
  BarChart3,
  Filter,
  Search
} from 'lucide-react';
import TabNavigation from '../components/TabNavigation';

const DashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  // const [userType] = useState<'owner' | 'agency' | 'seeker'>('owner');

  // Données de démonstration
  const stats = {
    totalProperties: 12,
    activeListings: 8,
    totalViews: 1247,
    totalContacts: 23,
    monthlyRevenue: 4500000,
    favoriteProperties: 5
  };

  const properties = [
    {
      id: '1',
      title: 'Appartement moderne au centre-ville',
      type: 'Appartement',
      price: 2500000,
      status: 'active',
      views: 156,
      contacts: 8,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    },
    {
      id: '2',
      title: 'Maison familiale avec jardin',
      type: 'Maison',
      price: 4500000,
      status: 'pending',
      views: 89,
      contacts: 3,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'
    },
    {
      id: '3',
      title: 'Studio meublé pour étudiant',
      type: 'Studio',
      price: 800000,
      status: 'sold',
      views: 234,
      contacts: 12,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
    }
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'sold':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Actif';
      case 'pending':
        return 'En attente';
      case 'sold':
        return 'Vendu';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de bord
          </h1>
          <p className="text-gray-600">
            Gérez vos biens immobiliers et suivez vos performances
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                <Home className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des biens</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Annonces actives</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeListings}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vues totales</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalContacts}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Onglets */}
        <div className="card mb-8">
          <TabNavigation
            tabs={[
              { id: 'overview', label: 'Aperçu', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'properties', label: 'Mes biens', icon: <Home className="w-4 h-4" />, badge: stats.totalProperties },
              { id: 'favorites', label: 'Favoris', icon: <Heart className="w-4 h-4" />, badge: stats.favoriteProperties },
              { id: 'messages', label: 'Messages', icon: <MessageCircle className="w-4 h-4" />, badge: stats.totalContacts }
            ]}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            variant="underline"
          />

          <div className="p-6">
            {/* Onglet Aperçu */}
            {activeTab === 'overview' && (
              <div>
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Graphique des vues */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Évolution des vues
                    </h3>
                    <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Graphique des vues</p>
                      </div>
                    </div>
                  </div>

                  {/* Activité récente */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Activité récente
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <Eye className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Nouvelle vue sur votre appartement
                          </p>
                          <p className="text-xs text-gray-500">Il y a 2 heures</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Nouveau message de Fatoumata
                          </p>
                          <p className="text-xs text-gray-500">Il y a 4 heures</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Rendez-vous confirmé pour demain
                          </p>
                          <p className="text-xs text-gray-500">Il y a 1 jour</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Mes biens */}
            {activeTab === 'properties' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Rechercher un bien..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                      <Filter className="w-4 h-4" />
                      <span>Filtrer</span>
                    </button>
                  </div>
                  <button className="btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter un bien
                  </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {properties.map((property) => (
                    <div key={property.id} className="card overflow-hidden">
                      <div className="relative">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                            {getStatusText(property.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          {property.title}
                        </h3>
                        <p className="text-lg font-bold text-gray-900 mb-3">
                          {formatPrice(property.price)}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            <span>{property.views} vues</span>
                          </div>
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            <span>{property.contacts} contacts</span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="flex-1 btn-secondary py-2 text-sm">
                            <Edit className="w-4 h-4 mr-1" />
                            Modifier
                          </button>
                          <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 text-sm">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </button>
                          <button className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Onglet Favoris */}
            {activeTab === 'favorites' && (
              <div>
                <p className="text-gray-600 mb-4">
                  Vous avez {stats.favoriteProperties} biens en favoris
                </p>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <Heart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Vos biens favoris apparaîtront ici</p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Messages */}
            {activeTab === 'messages' && (
              <div>
                <p className="text-gray-600 mb-4">
                  Vous avez {stats.totalContacts} messages non lus
                </p>
                <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Vos messages apparaîtront ici</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 