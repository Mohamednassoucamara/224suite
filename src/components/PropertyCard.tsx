import React, { useState } from 'react';
import { Heart, MapPin, Bed, Bath, Square, Eye, Calendar } from 'lucide-react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import apiService from '../services/api';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    description: string;
    type: string;
    status: string;
    price: number;
    currency: string;
    area?: number;
    bedrooms?: number;
    bathrooms?: number;
    address: string;
    district?: string;
    primary_image?: string;
    is_featured?: boolean;
    views_count?: number;
    created_at: string;
  };
  onFavorite?: (propertyId: string) => void;
  onView?: (propertyId: string) => void;
  onContact?: (propertyId: string) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onFavorite,
  onView,
  onContact
}) => {
  const { user } = useSupabaseAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getTypeLabel = (type: string) => {
    const types = {
      apartment: 'Appartement',
      house: 'Maison',
      villa: 'Villa',
      land: 'Terrain',
      commercial: 'Commercial',
      office: 'Bureau'
    };
    return types[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const statuses = {
      'for-sale': 'À vendre',
      'for-rent': 'À louer',
      'sold': 'Vendu',
      'rented': 'Loué'
    };
    return statuses[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'for-sale': 'bg-green-100 text-green-800',
      'for-rent': 'bg-blue-100 text-blue-800',
      'sold': 'bg-gray-100 text-gray-800',
      'rented': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleFavorite = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      if (isFavorited) {
        await apiService.removeFavorite(user.id, property.id);
        setIsFavorited(false);
      } else {
        await apiService.addFavorite(user.id, property.id);
        setIsFavorited(true);
      }
      onFavorite?.(property.id);
    } catch (error) {
      console.error('Erreur lors de la gestion des favoris:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = () => {
    onView?.(property.id);
  };

  const handleContact = () => {
    onContact?.(property.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.primary_image || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {property.is_featured && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              ⭐ Vedette
            </span>
          )}
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
            {getStatusLabel(property.status)}
          </span>
        </div>

        {/* Bouton favori */}
        {user && (
          <button
            onClick={handleFavorite}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors disabled:opacity-50"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'
              }`}
            />
          </button>
        )}

        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
            <button
              onClick={handleView}
              className="bg-white text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              <Eye className="w-4 h-4 inline mr-1" />
              Voir
            </button>
            <button
              onClick={handleContact}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              <Calendar className="w-4 h-4 inline mr-1" />
              Contacter
            </button>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4">
        {/* Prix */}
        <div className="mb-2">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price, property.currency)}
          </span>
          {property.status === 'for-rent' && (
            <span className="text-gray-600 text-sm">/mois</span>
          )}
        </div>

        {/* Titre */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Type */}
        <p className="text-sm text-gray-600 mb-3">
          {getTypeLabel(property.type)}
        </p>

        {/* Caractéristiques */}
        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
          {property.bedrooms && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1" />
              {property.bedrooms}
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1" />
              {property.bathrooms}
            </div>
          )}
          {property.area && (
            <div className="flex items-center">
              <Square className="w-4 h-4 mr-1" />
              {property.area}m²
            </div>
          )}
        </div>

        {/* Localisation */}
        <div className="flex items-start text-sm text-gray-600">
          <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
          <span className="line-clamp-1">
            {property.district && `${property.district}, `}
            {property.address}
          </span>
        </div>

        {/* Statistiques */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>{property.views_count || 0} vues</span>
          <span>
            {new Date(property.created_at).toLocaleDateString('fr-FR')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
