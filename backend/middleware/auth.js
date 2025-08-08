const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware pour protéger les routes
const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token existe dans les headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Accès non autorisé. Token requis.'
    });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Token invalide. Utilisateur non trouvé.'
      });
    }

    // Vérifier si l'utilisateur est vérifié
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'Compte non vérifié. Veuillez vérifier votre email.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Token invalide ou expiré.'
    });
  }
};

// Middleware pour autoriser certains types d'utilisateurs
const authorize = (...userTypes) => {
  return (req, res, next) => {
    if (!userTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        error: `Accès refusé. Types autorisés: ${userTypes.join(', ')}`
      });
    }
    next();
  };
};

// Middleware pour vérifier si l'utilisateur est premium
const requirePremium = async (req, res, next) => {
  if (!req.user.isPremiumActive) {
    return res.status(403).json({
      success: false,
      error: 'Fonctionnalité premium requise. Veuillez souscrire à un abonnement premium.'
    });
  }
  next();
};

// Middleware pour vérifier la propriété d'une ressource
const checkOwnership = (model) => {
  return async (req, res, next) => {
    try {
      const resource = await model.findById(req.params.id);
      
      if (!resource) {
        return res.status(404).json({
          success: false,
          error: 'Ressource non trouvée'
        });
      }

      // Vérifier si l'utilisateur est le propriétaire ou un admin
      if (resource.owner.toString() !== req.user._id.toString() && req.user.userType !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Accès refusé. Vous n\'êtes pas autorisé à modifier cette ressource.'
        });
      }

      req.resource = resource;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Erreur lors de la vérification de propriété'
      });
    }
  };
};

// Middleware pour vérifier les permissions d'agence
const checkAgencyPermission = async (req, res, next) => {
  try {
    const property = await require('../models/Property').findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    // Vérifier si l'utilisateur est le propriétaire, l'agence assignée, ou un admin
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAgency = property.agency && property.agency.toString() === req.user._id.toString();
    const isAdmin = req.user.userType === 'admin';

    if (!isOwner && !isAgency && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'
      });
    }

    req.property = property;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification des permissions'
    });
  }
};

// Middleware pour limiter les tentatives de connexion
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 tentatives maximum
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware pour vérifier l'état de l'utilisateur
const checkUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Vérifier si le compte est suspendu
    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        error: 'Votre compte a été suspendu. Contactez le support.'
      });
    }

    // Vérifier si le compte est supprimé
    if (user.status === 'deleted') {
      return res.status(403).json({
        success: false,
        error: 'Ce compte a été supprimé.'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Erreur lors de la vérification du statut utilisateur'
    });
  }
};

module.exports = {
  protect,
  authorize,
  requirePremium,
  checkOwnership,
  checkAgencyPermission,
  loginLimiter,
  checkUserStatus
}; 