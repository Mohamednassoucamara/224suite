import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car, 
  Heart, 
  Share2, 
  Phone, 
  Mail, 
  MessageCircle,
  Calendar,
  Star,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useNavigation } from '../App';
import { useNotification } from '../components/NotificationProvider';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import apiService from '../services/api';
import Breadcrumb from '../components/Breadcrumb';

const PropertyDetailPage: React.FC = () => {
  const { params, goBack } = useNavigation();
  const { showNotification } = useNotification();
  const { user } = useSupabaseAuth() as any;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Récupérer l'ID de la propriété depuis les paramètres
  const propertyId = params?.id || '1';

  // Simuler le chargement des données de propriété
  useEffect(() => {
    setLoading(true);
    // Simulation d'un appel API
    setTimeout(() => {
      const mockProperty = {
        id: propertyId,
        title: `Appartement moderne au centre-ville de Conakry - ID: ${propertyId}`,
        type: 'Appartement',
        price: 2500000,
        location: 'Kaloum, Conakry, Guinée',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        parking: 1,
        description: 'Magnifique appartement moderne situé au cœur de Kaloum, à proximité des commerces et des transports. Cet appartement dispose de 3 chambres spacieuses, 2 salles de bain modernes, une cuisine équipée et un salon lumineux. Idéal pour une famille ou un investissement locatif.',
        features: [
          'Climatisation',
          'Ascenseur',
          'Garde',
          'Eau courante',
          'Électricité 24h/24',
          'Internet haut débit',
          'Balcon',
          'Cuisine équipée'
        ],
        images: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1560448075-bb485b067938?w=800'
        ],
        owner: {
          name: 'Mamadou Diallo',
          phone: '+224 123 456 789',
          email: 'mamadou.diallo@email.com',
          rating: 4.8,
          reviews: 24
        }
      };
      setProperty(mockProperty);
      setLoading(false);
    }, 500);
  }, [propertyId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const nextImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? property.images.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement de la propriété...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Propriété non trouvée</h2>
          <p className="text-gray-600 mb-4">La propriété que vous recherchez n'existe pas.</p>
          <button 
            onClick={goBack}
            className="btn-primary"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Recherche', page: 'search' },
          { label: property?.title || 'Propriété' }
        ]} />
        
        {/* Bouton retour */}
        <button
          onClick={goBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Retour
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2">
            {/* Galerie photos */}
            <div className="card p-0 overflow-hidden mb-8">
              <div className="relative">
                <img
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover"
                />
                
                {/* Navigation photos */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicateurs */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {property.images.map((_: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <button
                    onClick={async () => {
                      try {
                        if (!user) {
                          showNotification('warning', 'Connectez-vous pour ajouter aux favoris.');
                          return;
                        }
                        if (isFavorite) {
                          await apiService.removeFavorite(user.id, property.id);
                          setIsFavorite(false);
                          showNotification('info', 'Retiré des favoris');
                        } else {
                          await apiService.addFavorite(user.id, property.id);
                          setIsFavorite(true);
                          showNotification('success', 'Ajouté aux favoris');
                        }
                      } catch (e) {
                        const m = e instanceof Error ? e.message : 'Erreur favoris';
                        showNotification('error', m);
                      }
                    }}
                    className={`p-2 rounded-full ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600'
                    } hover:scale-110 transition-transform`}
                  >
                    <Heart className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Miniatures */}
              <div className="p-4 flex space-x-2 overflow-x-auto">
                {property.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden ${
                      index === currentImageIndex ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Vue ${index + 1} de la propriété`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Informations principales */}
            <div className="card p-6 mb-8">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-sm text-primary-600 font-medium">
                    {property.type}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-1">
                    {property.title}
                  </h1>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatPrice(property.price)}
                  </div>
                  <div className="text-sm text-gray-600">
                    À vendre
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-6">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Bed className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {property.bedrooms} chambre{property.bedrooms > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {property.bathrooms} salle{property.bathrooms > 1 ? 's' : ''} de bain
                  </span>
                </div>
                <div className="flex items-center">
                  <Square className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {property.area}m²
                  </span>
                </div>
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">
                    {property.parking} place{property.parking > 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Caractéristiques */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Caractéristiques
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {property.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact */}
            <div className="card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact
              </h3>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold">
                    {property.owner.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {property.owner.name}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{property.owner.rating}</span>
                    <span className="mx-1">•</span>
                    <span>{property.owner.reviews} avis</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  className="w-full btn-primary flex items-center justify-center"
                  onClick={() => {
                    showNotification('info', `Appelez le propriétaire au ${property.owner.phone}`);
                  }}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler
                </button>
                <button
                  className="w-full btn-secondary flex items-center justify-center"
                  onClick={() => {
                    showNotification('success', 'Message envoyé (simulation).');
                  }}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un message
                </button>
                <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Chat en direct
                </button>
              </div>
            </div>

            {/* Rendez-vous */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Prendre rendez-vous
              </h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date souhaitée
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Heure
                  </label>
                  <select className="input-field">
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                    <option>16:00</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message (optionnel)
                  </label>
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Votre message..."
                  />
                </div>

                <button className="w-full btn-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Demander un rendez-vous
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage; 