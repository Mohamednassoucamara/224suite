const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  plan: {
    type: String,
    enum: ['basic', 'premium', 'agency', 'enterprise'],
    required: [true, 'Le plan est requis']
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'pending'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    required: [true, 'La date de début est requise']
  },
  endDate: {
    type: Date,
    required: [true, 'La date de fin est requise']
  },
  amount: {
    type: Number,
    required: [true, 'Le montant est requis'],
    min: [0, 'Le montant ne peut pas être négatif']
  },
  currency: {
    type: String,
    enum: ['GNF', 'USD', 'EUR'],
    default: 'GNF'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
    default: 'monthly'
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile_money', 'bank_transfer', 'cash'],
    required: [true, 'La méthode de paiement est requise']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  },
  features: {
    maxProperties: {
      type: Number,
      default: 5
    },
    featuredListings: {
      type: Number,
      default: 0
    },
    prioritySupport: {
      type: Boolean,
      default: false
    },
    analytics: {
      type: Boolean,
      default: false
    },
    virtualTours: {
      type: Boolean,
      default: false
    },
    advancedSearch: {
      type: Boolean,
      default: false
    },
    emailNotifications: {
      type: Boolean,
      default: true
    },
    smsNotifications: {
      type: Boolean,
      default: false
    }
  },
  autoRenew: {
    type: Boolean,
    default: true
  },
  cancellationReason: String,
  cancelledAt: Date,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: String
}, {
  timestamps: true
});

// Index pour améliorer les performances
subscriptionSchema.index({ user: 1, status: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });
subscriptionSchema.index({ plan: 1 });
subscriptionSchema.index({ paymentStatus: 1 });

// Méthode pour vérifier si l'abonnement est actif
subscriptionSchema.methods.isActive = function() {
  return this.status === 'active' && this.endDate > new Date();
};

// Méthode pour activer l'abonnement
subscriptionSchema.methods.activate = function() {
  this.status = 'active';
  this.startDate = new Date();
  return this.save();
};

// Méthode pour annuler l'abonnement
subscriptionSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  this.autoRenew = false;
  return this.save();
};

// Méthode pour renouveler l'abonnement
subscriptionSchema.methods.renew = function() {
  const currentEndDate = new Date(this.endDate);
  let newEndDate;
  
  switch (this.billingCycle) {
    case 'monthly':
      newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1));
      break;
    case 'quarterly':
      newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 3));
      break;
    case 'yearly':
      newEndDate = new Date(currentEndDate.setFullYear(currentEndDate.getFullYear() + 1));
      break;
    default:
      newEndDate = new Date(currentEndDate.setMonth(currentEndDate.getMonth() + 1));
  }
  
  this.endDate = newEndDate;
  return this.save();
};

// Méthode pour obtenir les fonctionnalités disponibles
subscriptionSchema.methods.getAvailableFeatures = function() {
  return this.features;
};

// Méthode pour vérifier si une fonctionnalité est disponible
subscriptionSchema.methods.hasFeature = function(featureName) {
  if (!this.isActive()) return false;
  return this.features[featureName] === true || this.features[featureName] > 0;
};

// Méthode pour utiliser une fonctionnalité (pour les quotas)
subscriptionSchema.methods.useFeature = function(featureName) {
  if (typeof this.features[featureName] === 'number' && this.features[featureName] > 0) {
    this.features[featureName] -= 1;
    return this.save();
  }
  return Promise.resolve(this);
};

// Méthode statique pour obtenir les plans disponibles
subscriptionSchema.statics.getPlans = function() {
  return {
    basic: {
      name: 'Basic',
      price: 0,
      currency: 'GNF',
      features: {
        maxProperties: 3,
        featuredListings: 0,
        prioritySupport: false,
        analytics: false,
        virtualTours: false,
        advancedSearch: false,
        emailNotifications: true,
        smsNotifications: false
      }
    },
    premium: {
      name: 'Premium',
      price: 20000,
      currency: 'GNF',
      features: {
        maxProperties: 10,
        featuredListings: 2,
        prioritySupport: true,
        analytics: true,
        virtualTours: true,
        advancedSearch: true,
        emailNotifications: true,
        smsNotifications: true
      }
    },
    agency: {
      name: 'Agence',
      price: 100000,
      currency: 'GNF',
      features: {
        maxProperties: 50,
        featuredListings: 10,
        prioritySupport: true,
        analytics: true,
        virtualTours: true,
        advancedSearch: true,
        emailNotifications: true,
        smsNotifications: true
      }
    },
    enterprise: {
      name: 'Entreprise',
      price: 300000,
      currency: 'GNF',
      features: {
        maxProperties: -1, // Illimité
        featuredListings: -1, // Illimité
        prioritySupport: true,
        analytics: true,
        virtualTours: true,
        advancedSearch: true,
        emailNotifications: true,
        smsNotifications: true
      }
    }
  };
};

module.exports = mongoose.model('Subscription', subscriptionSchema);
