import React from 'react';
import { Home, Phone, Mail, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { useNavigation } from '../App';

const Footer: React.FC = () => {
  const { setCurrentPage } = useNavigation();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">224 Suite</span>
            </div>
            <p className="text-gray-300 mb-4">
              La plateforme immobilière de référence à Conakry. 
              Trouvez votre chez-vous en un clic ou publiez vos annonces 
              en toute simplicité.
            </p>
            <div className="flex space-x-4">
              <button 
                onClick={() => window.open('https://facebook.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors bg-transparent border-none"
                aria-label="Suivez-nous sur Facebook"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open('https://twitter.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors bg-transparent border-none"
                aria-label="Suivez-nous sur Twitter"
              >
                <Twitter className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open('https://instagram.com', '_blank')}
                className="text-gray-400 hover:text-white transition-colors bg-transparent border-none"
                aria-label="Suivez-nous sur Instagram"
              >
                <Instagram className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2">
              <li>
                            <button 
              onClick={() => setCurrentPage('search')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Rechercher un bien
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('register')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Publier une annonce
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('dashboard')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Mon dashboard
            </button>
          </li>
          <li>
            <button 
              onClick={() => setCurrentPage('about')}
              className="text-gray-300 hover:text-white transition-colors bg-transparent border-none text-left"
            >
              À propos
            </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">Conakry, Guinée</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">+224 611925997</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-primary-400" />
                <span className="text-gray-300">contact@224suite.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 224Suite. Tous droits réservés. | 
            <button 
              onClick={() => setCurrentPage('privacy')}
              className="text-gray-300 hover:text-white ml-2 bg-transparent border-none"
            >
              Politique de confidentialité
            </button> | 
            <button 
              onClick={() => setCurrentPage('terms')}
              className="text-gray-300 hover:text-white ml-2 bg-transparent border-none"
            >
              Conditions d'utilisation
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 