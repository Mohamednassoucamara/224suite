const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Le prénom est requis'],
    trim: true,
    maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
  },
  lastName: {
    type: String,
    required: [true, 'Le nom de famille est requis'],
    trim: true,
    maxlength: [50, 'Le nom de famille ne peut pas dépasser 50 caractères']
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez entrer un email valide'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    match: [/^(\+224|224)?[0-9]{9}$/, 'Veuillez entrer un numéro de téléphone guinéen valide']
  },
  password: {
    type: String,
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  userType: {
    type: String,
    enum: ['owner', 'agency', 'seeker'],
    required: [true, 'Le type d\'utilisateur est requis']
  },
  avatar: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  premiumExpiresAt: {
    type: Date
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property'
  }],
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  address: {
    street: String,
    city: {
      type: String,
      default: 'Conakry'
    },
    neighborhood: String,
    postalCode: String
  },
  agency: {
    name: String,
    license: String,
    description: String,
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  emailVerificationToken: String,
  emailVerificationExpire: Date
}, {
  timestamps: true
});

// Index pour améliorer les performances
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ isPremium: 1 });

// Méthode pour obtenir le nom complet
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Méthode pour vérifier si l'utilisateur est premium
userSchema.virtual('isPremiumActive').get(function() {
  if (!this.isPremium) return false;
  if (!this.premiumExpiresAt) return true;
  return this.premiumExpiresAt > new Date();
});

// Middleware pour hasher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Méthode pour générer un token JWT
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { id: this._id, userType: this.userType },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// Méthode pour générer un token de réinitialisation de mot de passe
userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Méthode pour générer un token de vérification d'email
userSchema.methods.getEmailVerificationToken = function() {
  const verificationToken = crypto.randomBytes(20).toString('hex');
  this.emailVerificationToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');
  this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 heures
  return verificationToken;
};

// Méthode pour ajouter une propriété aux favoris
userSchema.methods.addToFavorites = function(propertyId) {
  if (!this.favorites.includes(propertyId)) {
    this.favorites.push(propertyId);
  }
  return this.save();
};

// Méthode pour retirer une propriété des favoris
userSchema.methods.removeFromFavorites = function(propertyId) {
  this.favorites = this.favorites.filter(id => id.toString() !== propertyId.toString());
  return this.save();
};

// Méthode pour vérifier si une propriété est en favori
userSchema.methods.isFavorite = function(propertyId) {
  return this.favorites.includes(propertyId);
};

module.exports = mongoose.model('User', userSchema); 