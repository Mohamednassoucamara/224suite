import React, { useMemo, useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, Building2, Home, Search, Home as HomeIcon } from 'lucide-react';
import { useNavigation } from '../App';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { useNotification } from '../components/NotificationProvider';

const RegisterPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const { showNotification } = useNotification();
  const { signUp, supabase } = useSupabaseAuth();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'owner' | 'agency' | 'seeker' | ''>('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agencyName: '',
    agencyLicense: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const handleUserTypeSelect = (type: 'owner' | 'agency' | 'seeker') => {
    setUserType(type);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    if (emailTaken) {
      setError('Cet email est déjà utilisé');
      setIsLoading(false);
      return;
    }
    
    // Vérification du type d'utilisateur
    if (!userType) {
      setError('Veuillez choisir un type de compte');
      setIsLoading(false);
      return;
    }

    // Validation des mots de passe
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }
    
    // Validation des champs requis
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      setIsLoading(false);
      return;
    }
    
    try {
      const userData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: userType === 'owner' ? 'user' : userType === 'agency' ? 'agent' : 'user'
      };
      
      const result = await signUp(userData);
      if (result?.needsEmailConfirmation) {
        showNotification('info', 'Inscription initiée. Veuillez confirmer votre email pour activer votre compte.');
        setCurrentPage('home');
      } else {
        setCurrentPage('home');
        showNotification('success', 'Compte créé avec succès. Bienvenue !');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'inscription';
      setError(errorMessage);
      showNotification('error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailBlur = async () => {
    if (!formData.email) return;
    try {
      setEmailChecking(true);
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .limit(1);
      if (error) {
        return; // on ne bloque pas l'inscription sur une erreur de vérification
      }
      setEmailTaken((data || []).length > 0);
    } finally {
      setEmailChecking(false);
    }
  };

  const passwordStrength = useMemo(() => {
    const pwd = formData.password || '';
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    const labels = ['Très faible', 'Faible', 'Correct', 'Bon', 'Excellent'];
    const colors = ['bg-red-500','bg-orange-500','bg-yellow-500','bg-green-500','bg-emerald-600'];
    return {
      score,
      label: labels[score] || labels[0],
      color: colors[score] || colors[0]
    };
  }, [formData.password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const userTypes = [
    {
      type: 'owner' as const,
      title: 'Propriétaire',
      description: 'Publiez vos annonces de location ou de vente',
      icon: Home,
      color: 'bg-primary-500'
    },
    {
      type: 'agency' as const,
      title: 'Agence Immobilière',
      description: 'Créez un profil pour votre agence et ajoutez vos biens',
      icon: Building2,
      color: 'bg-secondary-500'
    },
    {
      type: 'seeker' as const,
      title: 'Chercheur de maison',
      description: 'Recherchez et trouvez des maisons à louer ou à vendre',
      icon: Search,
      color: 'bg-accent-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <HomeIcon className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">224 Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 1 ? 'Choisissez votre profil' : 'Créer votre compte'}
          </h1>
          <p className="text-primary-100">
            {step === 1 
              ? 'Sélectionnez le type de compte qui vous correspond' 
              : 'Complétez vos informations personnelles'
            }
          </p>
        </div>

        {/* Étape 1: Sélection du type d'utilisateur */}
        {step === 1 && (
          <div className="grid md:grid-cols-3 gap-6">
            {userTypes.map((userTypeOption) => (
              <div
                key={userTypeOption.type}
                onClick={() => handleUserTypeSelect(userTypeOption.type)}
                className="card p-6 text-center cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className={`w-16 h-16 ${userTypeOption.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <userTypeOption.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {userTypeOption.title}
                </h3>
                <p className="text-gray-600">
                  {userTypeOption.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Étape 2: Formulaire d'inscription */}
        {step === 2 && (
          <div className="card p-8">
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                ← Retour à la sélection
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="input-field pl-10"
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Affichage des erreurs */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      handleInputChange('email', e.target.value);
                      setEmailTaken(false);
                    }}
                    onBlur={handleEmailBlur}
                    className="input-field pl-10"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>

              {formData.email && (emailChecking || emailTaken) && (
                <p className={`text-sm ${emailTaken ? 'text-red-600' : 'text-gray-500'}`}>
                  {emailChecking ? 'Vérification de la disponibilité de l\'email…' : 'Un compte existe déjà avec cet email.'}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="input-field pl-10"
                    placeholder="+224 XXX XXX XXX"
                    required
                  />
                </div>
              </div>

              {/* Champs spécifiques aux agences */}
              {userType === 'agency' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'agence
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.agencyName}
                        onChange={(e) => handleInputChange('agencyName', e.target.value)}
                        className="input-field pl-10"
                        placeholder="Nom de votre agence"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Numéro de licence
                    </label>
                    <input
                      type="text"
                      value={formData.agencyLicense}
                      onChange={(e) => handleInputChange('agencyLicense', e.target.value)}
                      className="input-field"
                      placeholder="Numéro de licence d'agent immobilier"
                      required
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Créez un mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {/* Indicateur robustesse */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="h-2 bg-gray-200 rounded">
                      <div className={`h-2 ${passwordStrength.color} rounded`} style={{ width: `${(passwordStrength.score/4)*100}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Robustesse: {passwordStrength.label}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="input-field pl-10 pr-10"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    J'accepte les{' '}
                    <button 
                      type="button"
                      onClick={() => setCurrentPage('terms')}
                      className="text-primary-600 hover:text-primary-500 bg-transparent border-none underline font-medium"
                    >
                      conditions d'utilisation
                    </button>{' '}
                    et la{' '}
                    <button 
                      type="button"
                      onClick={() => setCurrentPage('privacy')}
                      className="text-primary-600 hover:text-primary-500 bg-transparent border-none underline font-medium"
                    >
                      politique de confidentialité
                    </button>
                  </span>
                </div>
                <p className="text-xs text-gray-500 ml-6">
                  En créant un compte, vous acceptez que nous traitions vos données conformément à notre politique de confidentialité.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Création du compte...
                  </div>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Déjà un compte ?{' '}
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-primary-600 hover:text-primary-500 font-medium bg-transparent border-none"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage; 