import React, { useState, createContext, useContext, useEffect } from 'react';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import Header from './components/Header';
import Footer from './components/Footer';
import QuickNav from './components/QuickNav';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './hooks/useAuth';

// Types pour la navigation
interface NavigationState {
  currentPage: string;
  params: Record<string, string>;
  setCurrentPage: (page: string, params?: Record<string, string>) => void;
  goBack: () => void;
  goToProperty: (id: string) => void;
  goToSearch: (filters?: Record<string, string>) => void;
}

// Contexte de navigation amélioré
const NavigationContext = createContext<NavigationState>({
  currentPage: 'home',
  params: {},
  setCurrentPage: () => {},
  goBack: () => {},
  goToProperty: () => {},
  goToSearch: () => {}
});

export const useNavigation = () => useContext(NavigationContext);

function App() {
  const [currentPage, setCurrentPageState] = useState('home');
  const [params, setParams] = useState<Record<string, string>>({});
  const [navigationHistory, setNavigationHistory] = useState<Array<{page: string, params: Record<string, string>}>>([]);

  // Gestionnaire de navigation principal
  const setCurrentPage = (page: string, newParams: Record<string, string> = {}) => {
    // Sauvegarder l'état actuel dans l'historique
    setNavigationHistory(prev => [...prev, { page: currentPage, params }]);
    
    // Mettre à jour l'état
    setCurrentPageState(page);
    setParams(newParams);
    
    // Mettre à jour l'URL (simulation)
    const url = newParams.id ? `/${page}/${newParams.id}` : `/${page}`;
    window.history.pushState({ page, params: newParams }, '', url);
  };

  // Navigation vers une propriété spécifique
  const goToProperty = (id: string) => {
    setCurrentPage('property', { id });
  };

  // Navigation vers la recherche avec filtres
  const goToSearch = (filters: Record<string, string> = {}) => {
    setCurrentPage('search', filters);
  };

  // Retour en arrière
  const goBack = () => {
    if (navigationHistory.length > 0) {
      const previous = navigationHistory[navigationHistory.length - 1];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentPageState(previous.page);
      setParams(previous.params);
      window.history.back();
    } else {
      setCurrentPage('home');
    }
  };

  // Gestion des événements de navigation du navigateur
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentPageState(event.state.page);
        setParams(event.state.params || {});
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Initialisation de l'URL au chargement
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      setCurrentPageState('home');
    } else {
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 0) {
        const page = segments[0];
        const pageParams: Record<string, string> = {};
        
        if (segments.length > 1) {
          pageParams.id = segments[1];
        }
        
        setCurrentPageState(page);
        setParams(pageParams);
      }
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'property':
        return <PropertyDetailPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <DashboardPage />;

      case 'contact':
        return <ContactPage />;
      case 'terms':
        return <TermsPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'forgot-password':
        return <ForgotPasswordPage />;
      case 'reset-password':
        return <ResetPasswordPage />;
      default:
        return <HomePage />;
    }
  };

  const navigationValue: NavigationState = {
    currentPage,
    params,
    setCurrentPage,
    goBack,
    goToProperty,
    goToSearch
  };

  return (
    <AuthProvider>
      <NavigationContext.Provider value={navigationValue}>
        <ErrorBoundary>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
              {renderPage()}
            </main>
            <Footer />
            <QuickNav />
          </div>
        </ErrorBoundary>
      </NavigationContext.Provider>
    </AuthProvider>
  );
}

export default App; 