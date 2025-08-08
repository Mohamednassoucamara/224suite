import React from 'react';
import { Home, Search, Plus, User, Heart, MapPin, Info, Mail } from 'lucide-react';
import { useNavigation } from '../App';

const QuickNav: React.FC = () => {
  const { setCurrentPage, currentPage } = useNavigation();

  const quickActions = [
    {
      icon: Home,
      label: 'Accueil',
      page: 'home',
      color: 'bg-blue-500'
    },
    {
      icon: Search,
      label: 'Rechercher',
      page: 'search',
      color: 'bg-green-500'
    },
    {
      icon: Plus,
      label: 'Publier',
      page: 'register',
      color: 'bg-orange-500'
    },
    {
      icon: User,
      label: 'Mon compte',
      page: 'dashboard',
      color: 'bg-purple-500'
    },
    {
      icon: Info,
      label: 'À propos',
      page: 'about',
      color: 'bg-teal-500'
    },
    {
      icon: Mail,
      label: 'Contact',
      page: 'contact',
      color: 'bg-pink-500'
    }
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-full shadow-lg border border-gray-200 p-2">
        <div className="flex flex-col space-y-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(action.page)}
              className={`p-3 rounded-full transition-all duration-200 hover:scale-110 ${
                currentPage === action.page 
                  ? 'ring-2 ring-primary-500' 
                  : 'hover:shadow-md'
              }`}
              title={action.label}
            >
              <action.icon className={`w-5 h-5 text-white ${action.color} rounded-full p-1`} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickNav;
