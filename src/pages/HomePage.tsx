import React, { useState } from 'react';
import { Search, MapPin, Home, Building, Users, Star, ArrowRight, Phone, Mail, MessageCircle } from 'lucide-react';
import { useNavigation } from '../App';

const HomePage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [searchInputs, setSearchInputs] = useState({
    location: '',
    propertyType: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Rediriger vers la page de recherche avec les paramètres
    const searchParams: Record<string, string> = {};
    Object.entries(searchInputs).forEach(([key, value]) => {
      if (value) searchParams[key] = value;
    });
    setCurrentPage('search', searchParams);
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Trouvez votre chez-vous à Conakry
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              La plateforme immobilière de référence pour acheter, louer ou vendre 
              vos biens immobiliers en Guinée
            </p>
            
            {/* Barre de recherche améliorée */}
            <div className="card bg-white/95 backdrop-blur-sm p-6 max-w-4xl mx-auto">
              <form onSubmit={handleSearch} className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Quartier, ville..."
                    value={searchInputs.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="input-field pl-10 bg-white text-gray-900"
                  />
                </div>
                <select
                  value={searchInputs.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                  className="input-field bg-white text-gray-900"
                >
                  <option value="">Type de bien</option>
                  <option value="appartement">Appartement</option>
                  <option value="maison">Maison</option>
                  <option value="villa">Villa</option>
                  <option value="terrain">Terrain</option>
                  <option value="bureau">Bureau</option>
                </select>
                <input
                  type="number"
                  placeholder="Prix min."
                  value={searchInputs.minPrice}
                  onChange={(e) => handleInputChange('minPrice', e.target.value)}
                  className="input-field bg-white text-gray-900"
                />
                <button type="submit" className="btn-primary flex items-center justify-center">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="card p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">2,500+</div>
              <div className="text-gray-600">Biens disponibles</div>
            </div>
            <div className="card p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">1,200+</div>
              <div className="text-gray-600">Propriétaires satisfaits</div>
            </div>
            <div className="card p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Transactions réussies</div>
            </div>
            <div className="card p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">4.8</div>
              <div className="text-gray-600 flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                Note moyenne
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Une gamme complète de services immobiliers pour répondre à tous vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Home className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Achat & Vente
              </h3>
              <p className="text-gray-600 mb-6">
                Trouvez le bien de vos rêves ou vendez votre propriété en toute confiance
              </p>
              <button 
                onClick={() => setCurrentPage('search')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                En savoir plus <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
            
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <p className="text-gray-600 mb-6">
                Louez ou mettez en location votre bien avec nos services de gestion locative
              </p>
              <button 
                onClick={() => setCurrentPage('search')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                En savoir plus <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
            
            <div className="card p-8 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Accompagnement
              </h3>
              <p className="text-gray-600 mb-6">
                Bénéficiez d'un accompagnement personnalisé pour vos projets immobiliers
              </p>
              <button 
                onClick={() => setCurrentPage('contact')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                En savoir plus <ArrowRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ce que disent nos clients
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de nos clients satisfaits
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Grâce à 224Suite, j'ai trouvé l'appartement parfait en seulement 2 semaines. 
                L'équipe est très professionnelle et à l'écoute."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold">MD</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Mamadou Diallo</div>
                  <div className="text-sm text-gray-600">Acheteur</div>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Excellente plateforme pour vendre ma maison. Le processus a été simple 
                et j'ai obtenu un excellent prix."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold">FK</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Fatoumata Keita</div>
                  <div className="text-sm text-gray-600">Vendeuse</div>
                </div>
              </div>
            </div>
            
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                "Service de location impeccable. Ma propriété est louée en permanence 
                et les paiements sont toujours à jour."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-primary-600 font-semibold">AS</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Aissatou Sylla</div>
                  <div className="text-sm text-gray-600">Propriétaire</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à trouver votre bien idéal ?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Rejoignez des milliers de personnes qui ont déjà trouvé leur bonheur immobilier
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('search')}
              className="btn-secondary bg-white text-primary-600 hover:bg-gray-100"
            >
              Commencer la recherche
            </button>
            <button 
              onClick={() => setCurrentPage('register')}
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
            >
              Publier une annonce
            </button>
          </div>
        </div>
      </section>

      {/* Contact rapide */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Besoin d'aide ?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Notre équipe d'experts est là pour vous accompagner dans tous vos projets immobiliers
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-primary-600 mr-3" />
                  <span className="text-gray-700">+224 611925997</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-primary-600 mr-3" />
                  <span className="text-gray-700">contact@224suite.com</span>
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-6 h-6 text-primary-600 mr-3" />
                  <span className="text-gray-700">Chat en direct disponible</span>
                </div>
              </div>
            </div>
            <div className="card p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Contactez-nous
              </h3>
              <form className="space-y-4">
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="input-field"
                />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="input-field"
                />
                <textarea
                  placeholder="Votre message"
                  rows={4}
                  className="input-field"
                />
                <button type="submit" className="btn-primary w-full">
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default HomePage; 