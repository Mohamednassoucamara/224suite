const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Obtenir le profil de l'utilisateur connecté
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites', 'title price location images');

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur récupération profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du profil'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Mettre à jour le profil de l'utilisateur
// @access  Private
router.put('/profile', protect, [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le prénom doit contenir entre 2 et 50 caractères'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom de famille doit contenir entre 2 et 50 caractères'),
  body('phone')
    .optional()
    .matches(/^(\+224|224)?[0-9]{9}$/)
    .withMessage('Veuillez entrer un numéro de téléphone guinéen valide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).populate('favorites', 'title price location images');

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      data: user
    });
  } catch (error) {
    console.error('Erreur mise à jour profil:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour du profil'
    });
  }
});

// @route   PUT /api/users/password
// @desc    Changer le mot de passe
// @access  Private
router.put('/password', protect, [
  body('currentPassword')
    .notEmpty()
    .withMessage('Le mot de passe actuel est requis'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('Le nouveau mot de passe doit contenir au moins 6 caractères')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Récupérer l'utilisateur avec le mot de passe
    const user = await User.findById(req.user._id).select('+password');

    // Vérifier le mot de passe actuel
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Mot de passe actuel incorrect'
      });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Mot de passe modifié avec succès'
    });
  } catch (error) {
    console.error('Erreur changement mot de passe:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du changement de mot de passe'
    });
  }
});

// @route   GET /api/users/favorites
// @desc    Obtenir les propriétés favorites de l'utilisateur
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'favorites',
        populate: {
          path: 'owner',
          select: 'firstName lastName'
        }
      });

    res.json({
      success: true,
      data: user.favorites
    });
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des favoris'
    });
  }
});

// @route   PUT /api/users/notifications
// @desc    Mettre à jour les préférences de notifications
// @access  Private
router.put('/notifications', protect, [
  body('notifications.email')
    .optional()
    .isBoolean()
    .withMessage('La valeur doit être un booléen'),
  body('notifications.sms')
    .optional()
    .isBoolean()
    .withMessage('La valeur doit être un booléen'),
  body('notifications.push')
    .optional()
    .isBoolean()
    .withMessage('La valeur doit être un booléen')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { notifications: req.body.notifications },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Préférences de notifications mises à jour',
      data: user.notifications
    });
  } catch (error) {
    console.error('Erreur mise à jour notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour des notifications'
    });
  }
});

// @route   PUT /api/users/agency
// @desc    Mettre à jour les informations d'agence
// @access  Private (Agences uniquement)
router.put('/agency', protect, authorize('agency'), [
  body('agency.name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom de l\'agence doit contenir entre 2 et 100 caractères'),
  body('agency.license')
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage('Le numéro de licence doit contenir entre 5 et 50 caractères'),
  body('agency.description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La description ne peut pas dépasser 1000 caractères'),
  body('agency.website')
    .optional()
    .isURL()
    .withMessage('Veuillez entrer une URL valide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { agency: req.body.agency },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Informations d\'agence mises à jour',
      data: user.agency
    });
  } catch (error) {
    console.error('Erreur mise à jour agence:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour des informations d\'agence'
    });
  }
});

// @route   GET /api/users/:id
// @desc    Obtenir les informations publiques d'un utilisateur
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('firstName lastName avatar userType agency')
      .populate('agency', 'name description website');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    // Obtenir les propriétés de l'utilisateur
    const properties = await Property.find({ 
      owner: req.params.id, 
      status: 'active' 
    })
      .select('title price location images type transactionType')
      .sort({ createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: {
        user,
        properties
      }
    });
  } catch (error) {
    console.error('Erreur récupération utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
});

// @route   DELETE /api/users/account
// @desc    Supprimer le compte utilisateur
// @access  Private
router.delete('/account', protect, async (req, res) => {
  try {
    // Supprimer toutes les propriétés de l'utilisateur
    await Property.deleteMany({ owner: req.user._id });

    // Supprimer l'utilisateur
    await User.findByIdAndDelete(req.user._id);

    res.json({
      success: true,
      message: 'Compte supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression compte:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression du compte'
    });
  }
});

// @route   GET /api/users/stats/dashboard
// @desc    Obtenir les statistiques du dashboard utilisateur
// @access  Private
router.get('/stats/dashboard', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Statistiques des propriétés
    const propertyStats = await Property.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          sold: { $sum: { $cond: [{ $eq: ['$status', 'sold'] }, 1, 0] } },
          rented: { $sum: { $cond: [{ $eq: ['$status', 'rented'] }, 1, 0] } },
          totalViews: { $sum: '$views' },
          totalFavorites: { $sum: { $size: '$favorites' } }
        }
      }
    ]);

    // Propriétés récentes
    const recentProperties = await Property.find({ owner: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price status createdAt');

    // Propriétés les plus vues
    const topViewedProperties = await Property.find({ owner: userId })
      .sort({ views: -1 })
      .limit(5)
      .select('title price views');

    res.json({
      success: true,
      data: {
        stats: propertyStats[0] || {
          total: 0,
          active: 0,
          pending: 0,
          sold: 0,
          rented: 0,
          totalViews: 0,
          totalFavorites: 0
        },
        recentProperties,
        topViewedProperties
      }
    });
  } catch (error) {
    console.error('Erreur récupération statistiques:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

module.exports = router; 