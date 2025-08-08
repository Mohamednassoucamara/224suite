const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  type: {
    type: String,
    enum: ['appartement', 'maison', 'villa', 'studio', 'terrain', 'bureau', 'commerce'],
    required: [true, 'Le type de bien est requis']
  },
  transactionType: {
    type: String,
    enum: ['vente', 'location'],
    required: [true, 'Le type de transaction est requis']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  currency: {
    type: String,
    enum: ['GNF', 'USD', 'EUR'],
    default: 'GNF'
  },
  location: {
    address: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    neighborhood: {
      type: String,
      required: [true, 'Le quartier est requis']
    },
    city: {
      type: String,
      default: 'Conakry'
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  features: {
    bedrooms: {
      type: Number,
      min: [0, 'Le nombre de chambres ne peut pas être négatif']
    },
    bathrooms: {
      type: Number,
      min: [0, 'Le nombre de salles de bain ne peut pas être négatif']
    },
    area: {
      type: Number,
      required: [true, 'La surface est requise'],
      min: [1, 'La surface doit être supérieure à 0']
    },
    parking: {
      type: Number,
      default: 0,
      min: [0, 'Le nombre de places de parking ne peut pas être négatif']
    },
    floors: {
      type: Number,
      default: 1,
      min: [1, 'Le nombre d\'étages doit être au moins 1']
    },
    yearBuilt: Number,
    furnished: {
      type: Boolean,
      default: false
    }
  },
  amenities: [{
    type: String,
    enum: [
      'climatisation', 'ascenseur', 'garde', 'eau_courante', 'electricite_24h',
      'internet', 'balcon', 'terrasse', 'jardin', 'piscine', 'gym',
      'parking_securise', 'cuisine_equipee', 'meuble', 'chauffage',
      'systeme_securite', 'interphone', 'vide_ordures'
    ]
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: String,
    isMain: {
      type: Boolean,
      default: false
    },
    caption: String
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis']
  },
  agency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'sold', 'rented', 'inactive'],
    default: 'pending'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String
  },
  availability: {
    availableFrom: Date,
    availableUntil: Date,
    immediate: {
      type: Boolean,
      default: true
    }
  },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  virtualTour: {
    type: String
  },
  neighborhood: {
    description: String,
    nearby: {
      schools: [String],
      hospitals: [String],
      markets: [String],
      transport: [String],
      restaurants: [String]
    }
  },
  energyRating: {
    type: String,
    enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'non_renseigne']
  },
  tags: [String]
}, {
  timestamps: true
});

// Index pour améliorer les performances
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ 'location.city': 1, 'location.neighborhood': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ isPremium: 1, isFeatured: 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ createdAt: -1 });

// Méthode pour formater le prix
propertySchema.methods.formatPrice = function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: this.currency,
    minimumFractionDigits: 0
  }).format(this.price);
};

// Méthode pour incrémenter les vues
propertySchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Méthode pour ajouter aux favoris
propertySchema.methods.addToFavorites = function(userId) {
  if (!this.favorites.includes(userId)) {
    this.favorites.push(userId);
  }
  return this.save();
};

// Méthode pour retirer des favoris
propertySchema.methods.removeFromFavorites = function(userId) {
  this.favorites = this.favorites.filter(id => id.toString() !== userId.toString());
  return this.save();
};

// Méthode pour vérifier si un utilisateur a mis en favori
propertySchema.methods.isFavoritedBy = function(userId) {
  return this.favorites.includes(userId);
};

// Méthode pour obtenir l'image principale
propertySchema.methods.getMainImage = function() {
  const mainImage = this.images.find(img => img.isMain);
  return mainImage ? mainImage.url : (this.images[0] ? this.images[0].url : null);
};

// Méthode pour calculer le score de pertinence
propertySchema.methods.calculateRelevanceScore = function() {
  let score = 0;
  
  // Score de base
  score += 10;
  
  // Bonus pour premium
  if (this.isPremium) score += 50;
  
  // Bonus pour featured
  if (this.isFeatured) score += 30;
  
  // Bonus pour les vues
  score += Math.min(this.views * 0.1, 20);
  
  // Bonus pour les favoris
  score += this.favorites.length * 2;
  
  // Bonus pour les images
  score += Math.min(this.images.length * 5, 25);
  
  // Bonus pour les informations complètes
  if (this.description.length > 200) score += 10;
  if (this.amenities.length > 5) score += 10;
  if (this.neighborhood.description) score += 5;
  
  return score;
};

// Middleware pour s'assurer qu'il y a une image principale
propertySchema.pre('save', function(next) {
  if (this.images.length > 0 && !this.images.some(img => img.isMain)) {
    this.images[0].isMain = true;
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema); 