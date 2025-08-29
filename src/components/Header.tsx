import React, { useState } from 'react';
import { Home, Menu, X, User, LogOut, Settings, Bell } from 'lucide-react';
import { useNavigation } from '../App';

const Header: React.FC = () => {
  const { setCurrentPage, currentPage } = useNavigation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulation d'état de connexion

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
                     {/* Logo */}
           <button 
             onClick={() => setCurrentPage('home')}
             className="flex items-center space-x-2 bg-transparent border-none cursor-pointer"
           >
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
               <Home className="w-5 h-5 text-white" />
             </div>
             <span className="text-xl font-bold text-gray-900">224 Suite</span>
           </button>

                     {/* Navigation Desktop */}
           <nav className="hidden md:flex items-center space-x-8">
             <button 
               onClick={() => setCurrentPage('home')}
               className={`font-medium bg-transparent border-none transition-colors ${
                 currentPage === 'home' 
                   ? 'text-primary-600 border-b-2 border-primary-600' 
                   : 'text-gray-700 hover:text-primary-600'
               }`}
             >
               Accueil
             </button>
             <button 
               onClick={() => setCurrentPage('search')}
               className={`font-medium bg-transparent border-none transition-colors ${
                 currentPage === 'search' 
                   ? 'text-primary-600 border-b-2 border-primary-600' 
                   : 'text-gray-700 hover:text-primary-600'
               }`}
             >
               Rechercher
             </button>
             <button 
               onClick={() => setCurrentPage('register')}
               className={`font-medium bg-transparent border-none transition-colors ${
                 currentPage === 'register' 
                   ? 'text-primary-600 border-b-2 border-primary-600' 
                   : 'text-gray-700 hover:text-primary-600'
               }`}
             >
               Vendre/Louer
             </button>

             <button 
               onClick={() => setCurrentPage('contact')}
               className={`font-medium bg-transparent border-none transition-colors ${
                 currentPage === 'contact' 
                   ? 'text-primary-600 border-b-2 border-primary-600' 
                   : 'text-gray-700 hover:text-primary-600'
               }`}
             >
               Contact
             </button>
           </nav>

          {/* Actions Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <button className="relative p-2 text-gray-600 hover:text-primary-600">
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <span className="font-medium">Mon compte</span>
                  </button>
                  
                  {isUserMenuOpen && (
                                         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                       <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent border-none text-left">
                         <User className="w-4 h-4 mr-3" />
                         Profil
                       </button>
                       <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 bg-transparent border-none text-left">
                         <Settings className="w-4 h-4 mr-3" />
                         Paramètres
                       </button>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Se déconnecter
                      </button>
                    </div>
                  )}
                </div>
              </>
                         ) : (
               <>
                 <button 
                   onClick={() => setCurrentPage('login')}
                   className="text-gray-700 hover:text-primary-600 font-medium"
                 >
                   Se connecter
                 </button>
                 <button 
                   onClick={() => setCurrentPage('register')}
                   className="btn-primary"
                 >
                   S'inscrire
                 </button>
               </>
             )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:text-primary-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
                         <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
               <button 
                 onClick={() => {
                   setCurrentPage('home');
                   setIsMobileMenuOpen(false);
                 }}
                 className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
               >
                 Accueil
               </button>
               <button 
                 onClick={() => {
                   setCurrentPage('search');
                   setIsMobileMenuOpen(false);
                 }}
                 className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
               >
                 Rechercher
               </button>
               <button 
                 onClick={() => {
                   setCurrentPage('register');
                   setIsMobileMenuOpen(false);
                 }}
                 className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
               >
                 Vendre/Louer
               </button>

               <button 
                 onClick={() => {
                   setCurrentPage('contact');
                   setIsMobileMenuOpen(false);
                 }}
                 className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
               >
                 Contact
               </button>
              
                              {isLoggedIn ? (
                  <>
                    <hr className="my-2" />
                    <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none">
                      Mon profil
                    </button>
                    <button className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none">
                      Paramètres
                    </button>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
                    >
                      Se déconnecter
                    </button>
                  </>
                                 ) : (
                   <>
                     <hr className="my-2" />
                     <button 
                       onClick={() => {
                         setCurrentPage('login');
                         setIsMobileMenuOpen(false);
                       }}
                       className="block w-full text-left px-3 py-2 text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md bg-transparent border-none"
                     >
                       Se connecter
                     </button>
                     <button 
                       onClick={() => {
                         setCurrentPage('register');
                         setIsMobileMenuOpen(false);
                       }}
                       className="block w-full text-left px-3 py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-md font-medium bg-transparent border-none"
                     >
                       S'inscrire
                     </button>
                   </>
                 )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 