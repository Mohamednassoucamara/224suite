const express = require('express');
const Property = require('../models/Property');

const router = express.Router();

// @route   GET /api/search
// @desc    Recherche avancée de propriétés
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      q, // Recherche textuelle
      type,
      transactionType,
      minPrice,
      maxPrice,
      city,
      neighborhood,
      minBedrooms,
      maxBedrooms,
      minBathrooms,
      maxBathrooms,
      minArea,
      maxArea,
      amenities,
      furnished,
      parking,
      sortBy = 'relevance',
      sortOrder = 'desc',
      page = 1,
      limit = 12
    } = req.query;

    // Construire les filtres
    const filters = { status: 'active' };

    // Recherche textuelle
    if (q) {
      filters.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { 'location.address': { $regex: q, $options: 'i' } },
        { 'location.neighborhood': { $regex: q, $options: 'i' } }
      ];
    }

    // Filtres de base
    if (type) filters.type = type;
    if (transactionType) filters.transactionType = transactionType;
    if (city) filters['location.city'] = new RegExp(city, 'i');
    if (neighborhood) filters['location.neighborhood'] = new RegExp(neighborhood, 'i');

    // Filtres de prix
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.$gte = parseInt(minPrice);
      if (maxPrice) filters.price.$lte = parseInt(maxPrice);
    }

    // Filtres de chambres
    if (minBedrooms || maxBedrooms) {
      filters['features.bedrooms'] = {};
      if (minBedrooms) filters['features.bedrooms'].$gte = parseInt(minBedrooms);
      if (maxBedrooms) filters['features.bedrooms'].$lte = parseInt(maxBedrooms);
    }

    // Filtres de salles de bain
    if (minBathrooms || maxBathrooms) {
      filters['features.bathrooms'] = {};
      if (minBathrooms) filters['features.bathrooms'].$gte = parseInt(minBathrooms);
      if (maxBathrooms) filters['features.bathrooms'].$lte = parseInt(maxBathrooms);
    }

    // Filtres de surface
    if (minArea || maxArea) {
      filters['features.area'] = {};
      if (minArea) filters['features.area'].$gte = parseInt(minArea);
      if (maxArea) filters['features.area'].$lte = parseInt(maxArea);
    }

    // Filtres d'équipements
    if (amenities) {
      const amenitiesArray = amenities.split(',');
      filters.amenities = { $all: amenitiesArray };
    }

    // Filtres spécifiques
    if (furnished !== undefined) {
      filters['features.furnished'] = furnished === 'true';
    }

    if (parking !== undefined) {
      filters['features.parking'] = { $gte: parseInt(parking) };
    }

    // Construire le tri
    let sortOptions = {};
    
    switch (sortBy) {
      case 'price':
        sortOptions.price = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'area':
        sortOptions['features.area'] = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'bedrooms':
        sortOptions['features.bedrooms'] = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'views':
        sortOptions.views = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'favorites':
        sortOptions.favorites = sortOrder === 'desc' ? -1 : 1;
        break;
      case 'relevance':
      default:
        // Tri par pertinence (premium + featured + date)
        sortOptions = {
          isPremium: -1,
          isFeatured: -1,
          createdAt: -1
        };
        break;
    }

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

    // Calculer les statistiques de recherche
    const searchStats = await Property.aggregate([
      { $match: filters },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgArea: { $avg: '$features.area' },
          avgBedrooms: { $avg: '$features.bedrooms' },
          totalProperties: { $sum: 1 }
        }
      }
    ]);

    // Obtenir les suggestions de quartiers
    const neighborhoods = await Property.distinct('location.neighborhood', filters);

    res.json({
      success: true,
      data: properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      },
      stats: searchStats[0] || {
        avgPrice: 0,
        minPrice: 0,
        maxPrice: 0,
        avgArea: 0,
        avgBedrooms: 0,
        totalProperties: 0
      },
      suggestions: {
        neighborhoods: neighborhoods.slice(0, 10)
      }
    });

  } catch (error) {
    console.error('Erreur recherche:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche'
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Obtenir des suggestions de recherche
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: {
          properties: [],
          neighborhoods: [],
          types: []
        }
      });
    }

    // Suggestions de propriétés
    const properties = await Property.find({
      status: 'active',
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { 'location.neighborhood': { $regex: q, $options: 'i' } }
      ]
    })
      .select('title location.neighborhood type price')
      .limit(5);

    // Suggestions de quartiers
    const neighborhoods = await Property.distinct('location.neighborhood', {
      status: 'active',
      'location.neighborhood': { $regex: q, $options: 'i' }
    });

    // Suggestions de types
    const types = await Property.distinct('type', {
      status: 'active',
      type: { $regex: q, $options: 'i' }
    });

    res.json({
      success: true,
      data: {
        properties,
        neighborhoods: neighborhoods.slice(0, 5),
        types: types.slice(0, 5)
      }
    });

  } catch (error) {
    console.error('Erreur suggestions:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des suggestions'
    });
  }
});

// @route   GET /api/search/nearby
// @desc    Recherche de propriétés à proximité
// @access  Public
router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5, limit = 10 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: 'Coordonnées requises (lat, lng)'
      });
    }

    // Recherche géospatiale (si les coordonnées sont disponibles)
    const properties = await Property.find({
      status: 'active',
      'location.coordinates.lat': { $exists: true },
      'location.coordinates.lng': { $exists: true }
    })
      .populate('owner', 'firstName lastName')
      .limit(parseInt(limit));

    // Filtrer par distance (calcul simple)
    const nearbyProperties = properties.filter(property => {
      if (!property.location.coordinates.lat || !property.location.coordinates.lng) {
        return false;
      }

      const distance = calculateDistance(
        parseFloat(lat),
        parseFloat(lng),
        property.location.coordinates.lat,
        property.location.coordinates.lng
      );

      return distance <= parseFloat(radius);
    });

    res.json({
      success: true,
      data: nearbyProperties
    });

  } catch (error) {
    console.error('Erreur recherche proximité:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la recherche de proximité'
    });
  }
});

// @route   GET /api/search/stats
// @desc    Obtenir les statistiques de recherche
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const stats = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          avgArea: { $avg: '$features.area' },
          avgBedrooms: { $avg: '$features.bedrooms' }
        }
      }
    ]);

    // Statistiques par type
    const typeStats = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Statistiques par quartier
    const neighborhoodStats = await Property.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$location.neighborhood',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        general: stats[0] || {
          totalProperties: 0,
          avgPrice: 0,
          minPrice: 0,
          maxPrice: 0,
          avgArea: 0,
          avgBedrooms: 0
        },
        byType: typeStats,
        byNeighborhood: neighborhoodStats
      }
    });

  } catch (error) {
    console.error('Erreur statistiques recherche:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la récupération des statistiques'
    });
  }
});

// Fonction utilitaire pour calculer la distance
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router; 