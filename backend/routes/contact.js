const express = require('express');
const { body, validationResult } = require('express-validator');
const { sendContactEmail, sendContactConfirmation } = require('../utils/sendEmail');

const router = express.Router();

// @route   POST /api/contact
// @desc    Envoyer un message de contact
// @access  Public
router.post('/', [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('subject')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Le sujet doit contenir entre 5 et 200 caractères'),
  body('message')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Le message doit contenir entre 10 et 2000 caractères'),
  body('phone')
    .optional()
    .matches(/^(\+224|224)?[0-9]{9}$/)
    .withMessage('Veuillez entrer un numéro de téléphone guinéen valide')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { name, email, subject, message, phone } = req.body;

    // Envoyer l'email à l'équipe
    try {
      await sendContactEmail({
        name,
        email,
        subject,
        message,
        phone
      });
    } catch (emailError) {
      console.error('Erreur envoi email équipe:', emailError);
      // Continuer même si l'email échoue
    }

    // Envoyer l'email de confirmation
    try {
      await sendContactConfirmation({
        name,
        email,
        subject,
        message
      });
    } catch (emailError) {
      console.error('Erreur envoi email confirmation:', emailError);
      // Continuer même si l'email échoue
    }

    res.json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.'
    });

  } catch (error) {
    console.error('Erreur contact:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi du message'
    });
  }
});

// @route   POST /api/contact/property-inquiry
// @desc    Envoyer une demande d'information sur une propriété
// @access  Public
router.post('/property-inquiry', [
  body('propertyId')
    .notEmpty()
    .withMessage('ID de la propriété requis'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('phone')
    .matches(/^(\+224|224)?[0-9]{9}$/)
    .withMessage('Veuillez entrer un numéro de téléphone guinéen valide'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Le message ne peut pas dépasser 1000 caractères'),
  body('preferredContact')
    .optional()
    .isIn(['email', 'phone', 'whatsapp'])
    .withMessage('Méthode de contact invalide')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { propertyId, name, email, phone, message, preferredContact } = req.body;

    // Ici, vous pourriez sauvegarder la demande en base de données
    // et envoyer des notifications appropriées

    res.json({
      success: true,
      message: 'Votre demande d\'information a été envoyée avec succès. Le propriétaire vous contactera bientôt.'
    });

  } catch (error) {
    console.error('Erreur demande propriété:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de la demande'
    });
  }
});

// @route   POST /api/contact/appointment
// @desc    Demander un rendez-vous pour visiter une propriété
// @access  Public
router.post('/appointment', [
  body('propertyId')
    .notEmpty()
    .withMessage('ID de la propriété requis'),
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Veuillez entrer un email valide'),
  body('phone')
    .matches(/^(\+224|224)?[0-9]{9}$/)
    .withMessage('Veuillez entrer un numéro de téléphone guinéen valide'),
  body('preferredDate')
    .isISO8601()
    .withMessage('Date de rendez-vous invalide'),
  body('preferredTime')
    .isIn(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'])
    .withMessage('Heure de rendez-vous invalide'),
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Le message ne peut pas dépasser 500 caractères')
], async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { propertyId, name, email, phone, preferredDate, preferredTime, message } = req.body;

    // Vérifier que la date n'est pas dans le passé
    const appointmentDate = new Date(preferredDate);
    if (appointmentDate < new Date()) {
      return res.status(400).json({
        success: false,
        error: 'La date de rendez-vous ne peut pas être dans le passé'
      });
    }

    // Ici, vous pourriez sauvegarder le rendez-vous en base de données
    // et envoyer des notifications appropriées

    res.json({
      success: true,
      message: 'Votre demande de rendez-vous a été envoyée avec succès. Le propriétaire vous confirmera bientôt.'
    });

  } catch (error) {
    console.error('Erreur demande rendez-vous:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'envoi de la demande de rendez-vous'
    });
  }
});

module.exports = router; 