const express = require('express');
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const { protect, authorize, checkOwnership } = require('../middleware/auth');
const { upload } = require('../utils/uploadImage');

const router = express.Router();

// @route   GET /api/properties
// @desc    Obtenir toutes les propriétés avec filtres
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      transactionType,
      minPrice,
      maxPrice,
      city,
      neighborhood,
      minBedrooms,
      maxBedrooms,
      minArea,
      maxArea,
      amenities,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Construire les filtres
    const filters = { status: 'active' };

    if (type) filters.type = type;
    if (transactionType) filters.transactionType = transactionType;
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (neighborhood) filters['location.neighborhood'] = new RegExp(neighborhood, 'i');
    
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }

    if (minBedrooms || maxBedrooms) {
      filters['features.bedrooms'] = {};
      if (minBedrooms) filters['features.bedrooms'].$gte = parseInt(minBedrooms);
      if (maxBedrooms) filters['features.bedrooms'].$lte = parseInt(maxBedrooms);
    }

    if (minArea || maxArea) {
      filters['features.area'] = {};
      if (minArea) filters['features.area'].$gte = parseInt(minArea);
      if (maxArea) filters['features.area'].$lte = parseInt(maxArea);
    }

    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filters.amenities = { $all: amenitiesArray };
    }

    // Construire le tri
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Requête avec population
    const properties = await Property.find(filters)
      .populate('owner', 'firstName lastName email phone')
      .populate('agency', 'firstName lastName agency.name')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));

    // Compter le total
    const total = await Property.countDocuments(filters);

    // Calculer les statistiques
    const stats = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalProperties: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      stats: stats[0] || {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        totalProperties: 0
      }
    });

  } catch (error) {
    console.error('Erreur récupération propriétés:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des propriétés'
    });
  }
});

// @route   GET /api/properties/:id
// @desc    Obtenir une propriété par ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'firstName lastName email phone avatar')
      .populate('agency', 'firstName lastName agency.name agency.website');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    // Incrémenter les vues
    await property.incrementViews();

    res.json({
      success: true,
      data: property
    });

  } catch (error) {
    console.error('Erreur récupération propriété:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de la propriété'
    });
  }
});

// @route   POST /api/properties
// @desc    Créer une nouvelle propriété
// @access  Private (Propriétaires et Agences)
router.post('/', protect, authorize('owner', 'agency'), [
  body('title')
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Le titre doit contenir entre 10 et 100 caractères'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('La description doit contenir entre 50 et 2000 caractères'),
  body('type')
    .isIn(['appartement', 'maison', 'villa', 'studio', 'terrain', 'bureau', 'commerce'])
    .withMessage('Type de propriété invalide'),
  body('transactionType')
    .isIn(['vente', 'location'])
    .withMessage('Type de transaction invalide'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif'),
  body('location.address')
    .trim()
    .notEmpty()
    .withMessage('L\'adresse est requise'),
  body('location.neighborhood')
    .trim()
    .notEmpty()
    .withMessage('Le quartier est requis'),
  body('features.area')
    .isFloat({ min: 1 })
    .withMessage('La surface doit être supérieure à 0')
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

    // Créer la propriété
    const property = await Property.create({
      ...req.body,
      owner: req.user._id,
      agency: req.user.userType === 'agency' ? req.user._id : undefined
    });

    // Populate les informations du propriétaire
    await property.populate('owner', 'firstName lastName email phone');

    res.status(201).json({
      success: true,
      message: 'Propriété créée avec succès',
      data: property
    });

  } catch (error) {
    console.error('Erreur création propriété:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la propriété'
    });
  }
});

// @route   PUT /api/properties/:id
// @desc    Mettre à jour une propriété
// @access  Private (Propriétaire ou Agence assignée)
router.put('/:id', protect, checkOwnership(Property), [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Le titre doit contenir entre 10 et 100 caractères'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('La description doit contenir entre 50 et 2000 caractères'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Le prix doit être un nombre positif')
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

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('owner', 'firstName lastName email phone');

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Propriété mise à jour avec succès',
      data: property
    });

  } catch (error) {
    console.error('Erreur mise à jour propriété:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la mise à jour de la propriété'
    });
  }
});

// @route   DELETE /api/properties/:id
// @desc    Supprimer une propriété
// @access  Private (Propriétaire ou Agence assignée)
router.delete('/:id', protect, checkOwnership(Property), async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    res.json({
      success: true,
      message: 'Propriété supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur suppression propriété:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la propriété'
    });
  }
});

// @route   POST /api/properties/:id/favorite
// @desc    Ajouter/retirer une propriété des favoris
// @access  Private
router.post('/:id/favorite', protect, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    const user = req.user;
    const isFavorite = user.isFavorite(property._id);

    if (isFavorite) {
      await user.removeFromFavorites(property._id);
      await property.removeFromFavorites(user._id);
      res.json({
        success: true,
        message: 'Propriété retirée des favoris',
        isFavorite: false
      });
    } else {
      await user.addToFavorites(property._id);
      await property.addToFavorites(user._id);
      res.json({
        success: true,
        message: 'Propriété ajoutée aux favoris',
        isFavorite: true
      });
    }

  } catch (error) {
    console.error('Erreur gestion favoris:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la gestion des favoris'
    });
  }
});

// @route   POST /api/properties/:id/images
// @desc    Ajouter des images à une propriété
// @access  Private (Propriétaire ou Agence assignée)
router.post('/:id/images', protect, checkOwnership(Property), upload.array('images', 10), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propriété non trouvée'
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Aucune image fournie'
      });
    }

    // Ajouter les nouvelles images
    const newImages = req.files.map((file, index) => ({
      url: file.path,
      publicId: file.filename,
      isMain: property.images.length === 0 && index === 0 // Première image = principale
    }));

    property.images.push(...newImages);
    await property.save();

    res.json({
      success: true,
      message: 'Images ajoutées avec succès',
      data: property.images
    });

  } catch (error) {
    console.error('Erreur ajout images:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'ajout des images'
    });
  }
});

// @route   GET /api/properties/user/my-properties
// @desc    Obtenir les propriétés de l'utilisateur connecté
// @access  Private
router.get('/user/my-properties', protect, async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id })
      .populate('agency', 'firstName lastName agency.name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Erreur récupération propriétés utilisateur:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération de vos propriétés'
    });
  }
});

// @route   GET /api/properties/featured
// @desc    Obtenir les propriétés en vedette
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const properties = await Property.find({ 
      status: 'active',
      $or: [{ isFeatured: true }, { isPremium: true }]
    })
      .populate('owner', 'firstName lastName')
      .sort({ isFeatured: -1, isPremium: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      data: properties
    });

  } catch (error) {
    console.error('Erreur récupération propriétés vedettes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des propriétés vedettes'
    });
  }
});

module.exports = router; 