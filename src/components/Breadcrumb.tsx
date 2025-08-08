import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useNavigation } from '../App';

interface BreadcrumbItem {
  label: string;
  page?: string;
  params?: Record<string, string>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const { setCurrentPage } = useNavigation();

  const handleItemClick = (item: BreadcrumbItem) => {
    if (item.page) {
      setCurrentPage(item.page, item.params);
    }
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <button
        onClick={() => setCurrentPage('home')}
        className="flex items-center hover:text-primary-600 transition-colors"
      >
        <Home className="w-4 h-4 mr-1" />
        Accueil
      </button>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.page ? (
            <button
              onClick={() => handleItemClick(item)}
              className="hover:text-primary-600 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gray-900 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
