import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Home } from 'lucide-react';
import { useNavigation } from '../App';

const ForgotPasswordPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [step, setStep] = useState<'email' | 'confirmation'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulation d'envoi d'email
    setTimeout(() => {
      setIsLoading(false);
      setStep('confirmation');
    }, 2000);
  };

  const handleResendEmail = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <Home className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">224 Suite</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {step === 'email' ? 'Mot de passe oublié' : 'Email envoyé'}
          </h1>
          <p className="text-primary-100">
            {step === 'email' 
              ? 'Entrez votre adresse email pour réinitialiser votre mot de passe'
              : 'Vérifiez votre boîte de réception'
            }
          </p>
        </div>

        {/* Étape 1: Saisie de l'email */}
        {step === 'email' && (
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                {error && (
                  <div className="flex items-center mt-2 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary py-3 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </div>
                ) : (
                  'Envoyer le lien de réinitialisation'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setCurrentPage('login')}
                className="flex items-center justify-center w-full text-primary-600 hover:text-primary-500 font-medium bg-transparent border-none"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la connexion
              </button>
            </div>
          </div>
        )}

        {/* Étape 2: Confirmation */}
        {step === 'confirmation' && (
          <div className="card p-8">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Email envoyé avec succès !
                </h2>
                <p className="text-gray-600 mb-4">
                  Nous avons envoyé un lien de réinitialisation à{' '}
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Vérifiez votre boîte de réception et cliquez sur le lien pour créer un nouveau mot de passe.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={isLoading}
                  className="w-full btn-secondary py-2 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                      Envoi...
                    </div>
                  ) : (
                    'Renvoyer l\'email'
                  )}
                </button>

                <button
                  onClick={() => setCurrentPage('login')}
                  className="w-full btn-primary py-2 text-sm font-medium"
                >
                  Retour à la connexion
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
                  <button
                    onClick={() => setCurrentPage('contact')}
                    className="text-primary-600 hover:text-primary-500 bg-transparent border-none underline"
                  >
                    contactez-nous
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
