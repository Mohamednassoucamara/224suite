import React from 'react';
import { useNavigation } from '../App';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default'
}) => {
  const getTabClasses = (isActive: boolean) => {
    const baseClasses = 'px-4 py-2 text-sm font-medium transition-colors duration-200';
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-full ${
          isActive 
            ? 'bg-primary-500 text-white' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`;
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-primary-500 text-primary-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;
      default:
        return `${baseClasses} ${
          isActive 
            ? 'text-primary-600 border-b-2 border-primary-600' 
            : 'text-gray-600 hover:text-gray-900'
        }`;
    }
  };

  return (
    <div className="border-b border-gray-200">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center space-x-2 whitespace-nowrap ${getTabClasses(activeTab === tab.id)}`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className="bg-primary-100 text-primary-600 text-xs px-2 py-1 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
