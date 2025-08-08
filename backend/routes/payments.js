const express = require('express');
const { body, validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { protect, requirePremium } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/payments/create-payment-intent
// @desc    Créer une intention de paiement pour un abonnement premium
// @access  Private
router.post('/create-payment-intent', protect, [
  body('planType')
    .isIn(['monthly', 'yearly'])
    .withMessage('Type de plan invalide')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { planType } = req.body;

    // Définir les prix selon le plan
    const prices = {
      monthly: 50000, // 50,000 GNF par mois
      yearly: 500000   // 500,000 GNF par an (2 mois gratuits)
    };

    const amount = prices[planType];

    // Créer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe utilise les centimes
      currency: 'gnf',
      metadata: {
        userId: req.user._id.toString(),
        planType,
        userEmail: req.user.email
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      amount,
      planType
    });

  } catch (error) {
    console.error('Erreur création paiement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création du paiement'
    });
  }
});

// @route   POST /api/payments/confirm
// @desc    Confirmer un paiement et activer l'abonnement premium
// @access  Private
router.post('/confirm', protect, [
  body('paymentIntentId')
    .notEmpty()
    .withMessage('ID de l\'intention de paiement requis')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { paymentIntentId } = req.body;

    // Récupérer l'intention de paiement
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        error: 'Le paiement n\'a pas été confirmé'
      });
    }

    // Vérifier que le paiement correspond à l'utilisateur
    if (paymentIntent.metadata.userId !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Paiement non autorisé'
      });
    }

    const { planType } = paymentIntent.metadata;

    // Calculer la date d'expiration
    const now = new Date();
    const expirationDate = new Date(now);
    
    if (planType === 'monthly') {
      expirationDate.setMonth(expirationDate.getMonth() + 1);
    } else {
      expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    }

    // Mettre à jour l'utilisateur
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: true,
        premiumExpiresAt: expirationDate
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Abonnement premium activé avec succès',
      data: {
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt
      }
    });

  } catch (error) {
    console.error('Erreur confirmation paiement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la confirmation du paiement'
    });
  }
});

// @route   GET /api/payments/subscription-status
// @desc    Obtenir le statut de l'abonnement premium
// @access  Private
router.get('/subscription-status', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        isPremium: user.isPremium,
        isPremiumActive: user.isPremiumActive,
        premiumExpiresAt: user.premiumExpiresAt
      }
    });

  } catch (error) {
    console.error('Erreur statut abonnement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération du statut d\'abonnement'
    });
  }
});

// @route   POST /api/payments/cancel-subscription
// @desc    Annuler l'abonnement premium
// @access  Private
router.post('/cancel-subscription', protect, requirePremium, async (req, res) => {
  try {
    // Mettre à jour l'utilisateur pour désactiver le premium
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        isPremium: false,
        premiumExpiresAt: new Date() // Expire immédiatement
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Abonnement premium annulé avec succès',
      data: {
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt
      }
    });

  } catch (error) {
    console.error('Erreur annulation abonnement:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'annulation de l\'abonnement'
    });
  }
});

// @route   GET /api/payments/plans
// @desc    Obtenir les plans d'abonnement disponibles
// @access  Public
router.get('/plans', (req, res) => {
  const plans = [
    {
      id: 'monthly',
      name: 'Premium Mensuel',
      price: 50000,
      currency: 'GNF',
      period: 'mois',
      features: [
        'Annonces mises en avant',
        'Statistiques détaillées',
        'Support prioritaire',
        'Photos illimitées',
        'Contact direct avec les acheteurs'
      ]
    },
    {
      id: 'yearly',
      name: 'Premium Annuel',
      price: 500000,
      currency: 'GNF',
      period: 'an',
      savings: '2 mois gratuits',
      features: [
        'Toutes les fonctionnalités mensuelles',
        '2 mois gratuits',
        'Économies de 100,000 GNF',
        'Renouvellement automatique'
      ]
    }
  ];

  res.json({
    success: true,
    data: plans
  });
});

// @route   POST /api/payments/webhook
// @desc    Webhook Stripe pour les événements de paiement
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Erreur webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les événements
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Paiement réussi:', paymentIntent.id);
      // Ici vous pourriez mettre à jour le statut en base de données
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Paiement échoué:', failedPayment.id);
      // Ici vous pourriez gérer l'échec du paiement
      break;

    default:
      console.log(`Événement non géré: ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 