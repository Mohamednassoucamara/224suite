import React, { useEffect } from 'react';
import { useNavigation } from '../App';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useNotification } from '../components/NotificationProvider';
import UserDashboard from '../components/UserDashboard';

const DashboardPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const { user, loading } = useSupabaseAuth() as any;
  const { showNotification } = useNotification();

  useEffect(() => {
    if (!loading && !user) {
      showNotification('warning', 'Veuillez vous connecter pour accéder au tableau de bord.');
      setCurrentPage('login');
    }
  }, [user, loading, setCurrentPage, showNotification]);

  const handleAddProperty = () => {
    // Rediriger vers une page d'ajout de propriété
    setCurrentPage('add-property');
  };

  const handleEditProperty = (id: string) => {
    // Rediriger vers une page d'édition de propriété
    setCurrentPage('edit-property', { id });
  };

  const handleViewProperty = (id: string) => {
    // Rediriger vers la page de détail de la propriété
    setCurrentPage('property', { id });
  };

  if (!user) {
    return null;
  }

  return (
    <UserDashboard
      onAddProperty={handleAddProperty}
      onEditProperty={handleEditProperty}
      onViewProperty={handleViewProperty}
    />
  );
};

export default DashboardPage; 