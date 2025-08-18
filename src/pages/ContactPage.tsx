import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useNavigation } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const ContactPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Téléphone',
      details: ['+224 611925997'],
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: ['contact@224suite.com', 'support@224suite.com'],
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Adresse',
      details: ['Conakry, Guinée', 'Quartier Kaloum'],
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horaires',
      details: ['Lun-Ven: 8h-18h', 'Sam: 9h-15h'],
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Simulation d'envoi
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      question: 'Comment publier une annonce immobilière ?',
      answer: 'Créez un compte, connectez-vous à votre dashboard et cliquez sur "Ajouter un bien". Remplissez les informations requises et publiez votre annonce.'
    },
    {
      question: 'Quels sont les frais de commission ?',
      answer: 'Les consultations d\'annonces sont gratuites. Les abonnements premium pour les agences et propriétaires commencent à 50 000 GNF/mois.'
    },
    {
      question: 'Comment contacter un propriétaire ?',
      answer: 'Utilisez le système de messagerie intégré ou les coordonnées fournies dans l\'annonce pour contacter directement le propriétaire.'
    },
    {
      question: 'La plateforme est-elle sécurisée ?',
      answer: 'Oui, nous utilisons les meilleures pratiques de sécurité pour protéger vos données et transactions.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Contact', page: 'contact' }
        ]} />

        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter 
            pour toute question concernant nos services.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Informations de contact
            </h2>
            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${info.color}`}>
                    {info.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {info.title}
                    </h3>
                    {info.details.map((detail, detailIndex) => (
                      <p key={detailIndex} className="text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Carte */}
            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Notre localisation
              </h3>
              <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Carte interactive</p>
                  <p className="text-sm text-gray-400">Conakry, Guinée</p>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Envoyez-nous un message
            </h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-green-800">
                  Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800">
                  Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="+224 XXX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="general">Question générale</option>
                    <option value="support">Support technique</option>
                    <option value="partnership">Partenariat</option>
                    <option value="complaint">Réclamation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input-field"
                  placeholder="Décrivez votre demande..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Questions fréquentes
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 bg-primary-500 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d'aide immédiate ?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Notre équipe de support est disponible pour vous aider rapidement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.open('tel:+224611925997', '_self')}
              className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 flex items-center justify-center"
            >
              <Phone className="w-4 h-4 mr-2" />
              Appeler maintenant
            </button>
            <button 
              onClick={() => window.open('mailto:contact@224suite.com', '_self')}
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600 flex items-center justify-center"
            >
              <Mail className="w-4 h-4 mr-2" />
              Envoyer un email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
