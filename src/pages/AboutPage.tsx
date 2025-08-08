import React from 'react';
import { Home, Users, Target, Award, Shield, Globe, Heart, Star } from 'lucide-react';
import { useNavigation } from '../App';
import Breadcrumb from '../components/Breadcrumb';

const AboutPage: React.FC = () => {
  const { setCurrentPage } = useNavigation();

  const stats = [
    { number: '5000+', label: 'Biens immobiliers', icon: <Home className="w-6 h-6" /> },
    { number: '2000+', label: 'Utilisateurs satisfaits', icon: <Users className="w-6 h-6" /> },
    { number: '50+', label: 'Agences partenaires', icon: <Target className="w-6 h-6" /> },
    { number: '98%', label: 'Taux de satisfaction', icon: <Star className="w-6 h-6" /> }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sécurité',
      description: 'Vos données et transactions sont protégées par les meilleures pratiques de sécurité.'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Confiance',
      description: 'Nous construisons des relations durables basées sur la transparence et l\'honnêteté.'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Nous utilisons les dernières technologies pour simplifier votre expérience immobilière.'
    }
  ];

  const team = [
    {
      name: 'Mamadou Diallo',
      role: 'Fondateur & CEO',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      description: 'Expert en immobilier avec 15 ans d\'expérience à Conakry.'
    },
    {
      name: 'Fatoumata Camara',
      role: 'Directrice Technique',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
      description: 'Spécialiste en développement web et expérience utilisateur.'
    },
    {
      name: 'Ibrahima Bah',
      role: 'Directeur Commercial',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      description: 'Expert en relations clients et développement commercial.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'À propos', page: 'about' }
        ]} />

        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            À propos de 224Suite
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La plateforme immobilière de référence à Conakry, dédiée à faciliter 
            la recherche, la publication et la gestion d'offres immobilières.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4 text-primary-600">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.number}
              </div>
              <div className="text-gray-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Notre mission */}
        <div className="card p-8 mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Faciliter, sécuriser et moderniser la recherche, la publication et 
                la gestion d'offres immobilières à Conakry à travers une plateforme 
                numérique intuitive, centralisée et accessible.
              </p>
              <p className="text-gray-600 mb-6">
                Nous croyons que chacun mérite de trouver son chez-soi idéal ou 
                d'investir dans l'immobilier en toute confiance. C'est pourquoi 
                nous avons créé 224Suite, une solution complète qui connecte 
                propriétaires, agences et chercheurs de logements.
              </p>
              <button 
                onClick={() => setCurrentPage('contact')}
                className="btn-primary"
              >
                Nous contacter
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600"
                alt="Conakry, Guinée"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute inset-0 bg-primary-500/10 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Nos valeurs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Nos Valeurs
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-600">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notre équipe */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Notre Équipe
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card p-6 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Histoire */}
        <div className="card p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Notre Histoire
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6 text-gray-600">
              <p>
                Fondée en 2024 à Conakry, 224Suite est née de la vision de 
                moderniser le secteur immobilier guinéen. Face aux défis de 
                l'urbanisation rapide et de la digitalisation, nous avons 
                identifié le besoin d'une plateforme qui simplifie les 
                transactions immobilières.
              </p>
              <p>
                Notre équipe, composée d'experts en immobilier, en technologie 
                et en expérience utilisateur, a développé une solution complète 
                qui répond aux besoins spécifiques du marché guinéen.
              </p>
              <p>
                Aujourd'hui, 224Suite est devenue la référence en matière de 
                recherche et de publication immobilière à Conakry, connectant 
                des milliers d'utilisateurs et facilitant des centaines de 
                transactions chaque mois.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="card p-8 bg-primary-500 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Rejoignez 224Suite
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Découvrez comment nous pouvons vous aider à trouver votre bien idéal 
            ou à gérer vos investissements immobiliers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => setCurrentPage('register')}
              className="btn-secondary bg-white text-primary-600 hover:bg-gray-100"
            >
              Créer un compte
            </button>
            <button 
              onClick={() => setCurrentPage('contact')}
              className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600"
            >
              Nous contacter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
