import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Square, Heart, Eye, Grid, List, Star } from 'lucide-react';
import { useNavigation } from '../App';
import Breadcrumb from '../components/Breadcrumb';

interface Property {
  id: string;
  title: string;
  type: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  isFavorite: boolean;
  rating?: number;
  isNew?: boolean;
  isPremium?: boolean;
}

const SearchPage: React.FC = () => {
  const { setCurrentPage, params, goToProperty } = useNavigation();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');

  // Appliquer les paramètres d'URL aux filtres
  useEffect(() => {
    if (params) {
      const newFilters = { ...filters };
      Object.keys(params).forEach(key => {
        if (key in newFilters) {
          newFilters[key as keyof typeof newFilters] = params[key];
        }
      });
      setFilters(newFilters);
    }
  }, [params, filters]);

  // Données de démonstration améliorées
  const mockProperties: Property[] = useMemo(() => [
    {
      id: '1',
      title: 'Appartement moderne au centre-ville',
      type: 'Appartement',
      price: 2500000,
      location: 'Kaloum, Conakry',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      isFavorite: false,
      rating: 4.8,
      isNew: true
    },
    {
      id: '2',
      title: 'Maison familiale avec jardin',
      type: 'Maison',
      price: 4500000,
      location: 'Ratoma, Conakry',
      bedrooms: 4,
      bathrooms: 3,
      area: 200,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      isFavorite: true,
      rating: 4.9,
      isPremium: true
    },
    {
      id: '3',
      title: 'Studio meublé pour étudiant',
      type: 'Studio',
      price: 800000,
      location: 'Dixinn, Conakry',
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      isFavorite: false,
      rating: 4.5
    },
    {
      id: '4',
      title: 'Villa de luxe avec piscine',
      type: 'Villa',
      price: 8500000,
      location: 'Coyah, Guinée',
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      isFavorite: false,
      rating: 5.0,
      isPremium: true
    },
    {
      id: '5',
      title: 'Appartement 2 chambres rénové',
      type: 'Appartement',
      price: 1800000,
      location: 'Matam, Conakry',
      bedrooms: 2,
      bathrooms: 1,
      area: 75,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
      isFavorite: false,
      rating: 4.6,
      isNew: true
    },
    {
      id: '6',
      title: 'Maison traditionnelle avec cour',
      type: 'Maison',
      price: 3200000,
      location: 'Matoto, Conakry',
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      image: 'https://images.unsplash.com/photo-1560448075-bb485b067938?w=400',
      isFavorite: false,
      rating: 4.7
    }
  ], []);

  useEffect(() => {
    setProperties(mockProperties);
  }, [mockProperties]);

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Appliquer les filtres et naviguer vers la recherche avec les paramètres
    const searchParams: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams[key] = value;
    });
    setCurrentPage('search', searchParams);
  };

  const toggleFavorite = (propertyId: string) => {
    setProperties(prev => 
      prev.map(prop => 
        prop.id === propertyId 
          ? { ...prop, isFavorite: !prop.isFavorite }
          : prop
      )
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const clearFilters = () => {
    const clearedFilters = {
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      city: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: ''
    };
    setFilters(clearedFilters);
    setCurrentPage('search', {});
  };

  const filteredProperties = properties.filter(property => {
    if (filters.propertyType && property.type !== filters.propertyType) return false;
    if (filters.minPrice && property.price < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && property.price > parseInt(filters.maxPrice)) return false;
    if (filters.bedrooms && property.bedrooms < parseInt(filters.bedrooms)) return false;
    if (filters.bathrooms && property.bathrooms < parseInt(filters.bathrooms)) return false;
    if (filters.minArea && property.area < parseInt(filters.minArea)) return false;
    if (filters.maxArea && property.area > parseInt(filters.maxArea)) return false;
    return true;
  });

  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'area-asc':
        return a.area - b.area;
      case 'area-desc':
        return b.area - a.area;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Recherche', page: 'search' }
        ]} />
        
        {/* En-tête de recherche */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Recherche de biens immobiliers
          </h1>
          <div className="card p-4">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Quartier, ville..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="input-field flex-1"
              >
                <option value="">Type de bien</option>
                <option value="Appartement">Appartement</option>
                <option value="Maison">Maison</option>
                <option value="Villa">Villa</option>
                <option value="Studio">Studio</option>
              </select>
              <input
                type="number"
                placeholder="Prix min."
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field flex-1"
              />
              <input
                type="number"
                placeholder="Prix max."
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field flex-1"
              />
              <button type="submit" className="btn-secondary">
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtres avancés */}
          <div className="lg:w-1/4">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 text-primary-500"
                >
                  <Filter className="w-4 h-4" />
                  <span>{showFilters ? 'Masquer' : 'Afficher'}</span>
                </button>
              </div>
              
              <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chambres
                  </label>
                  <select
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Toutes</option>
                    <option value="1">1 chambre</option>
                    <option value="2">2 chambres</option>
                    <option value="3">3 chambres</option>
                    <option value="4">4+ chambres</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salles de bain
                  </label>
                  <select
                    value={filters.bathrooms}
                    onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                    className="input-field"
                  >
                    <option value="">Toutes</option>
                    <option value="1">1 salle de bain</option>
                    <option value="2">2 salles de bain</option>
                    <option value="3">3+ salles de bain</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Surface (m²)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minArea}
                      onChange={(e) => handleFilterChange('minArea', e.target.value)}
                      className="input-field"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxArea}
                      onChange={(e) => handleFilterChange('maxArea', e.target.value)}
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    type="button"
                    onClick={handleSearch}
                    className="w-full btn-primary"
                  >
                    Appliquer les filtres
                  </button>
                  <button 
                    onClick={clearFilters}
                    className="w-full text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Effacer tous les filtres
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Résultats */}
          <div className="lg:w-3/4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  {sortedProperties.length} bien(s) trouvé(s)
                </p>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-auto"
              >
                <option value="relevance">Trier par pertinence</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="area-asc">Surface croissante</option>
                <option value="area-desc">Surface décroissante</option>
                <option value="rating">Meilleure note</option>
              </select>
            </div>

            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'md:grid-cols-2 xl:grid-cols-3' 
                : 'grid-cols-1'
            }`}>
              {sortedProperties.map((property) => (
                <div key={property.id} className={`card overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === 'list' ? 'flex' : ''
                }`}>
                  <div className={`relative ${viewMode === 'list' ? 'w-1/3' : ''}`}>
                    <img
                      src={property.image}
                      alt={property.title}
                      className={`object-cover ${viewMode === 'list' ? 'h-full' : 'h-48 w-full'}`}
                    />
                    <div className="absolute top-3 left-3 flex space-x-2">
                      {property.isNew && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          Nouveau
                        </span>
                      )}
                      {property.isPremium && (
                        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => toggleFavorite(property.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full ${
                        property.isFavorite 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white text-gray-600'
                      } hover:scale-110 transition-transform`}
                    >
                      <Heart className="w-4 h-4" fill={property.isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  
                  <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-primary-600 font-medium">
                        {property.type}
                      </span>
                      <span className="text-lg font-bold text-gray-900">
                        {formatPrice(property.price)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>

                    {property.rating && (
                      <div className="flex items-center mb-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span className="text-sm text-gray-600">{property.rating}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Bed className="w-4 h-4 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="w-4 h-4 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="w-4 h-4 mr-1" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => goToProperty(property.id)}
                        className="flex items-center text-primary-500 hover:text-primary-600"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Voir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {sortedProperties.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun bien trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 