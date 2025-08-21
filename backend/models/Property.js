const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Property = sequelize.define('Property', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        len: [10, 200],
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50, 5000],
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM('apartment', 'house', 'villa', 'land', 'commercial', 'office'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('for-sale', 'for-rent', 'sold', 'rented'),
      defaultValue: 'for-sale',
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
        notNull: true
      }
    },
    currency: {
      type: DataTypes.ENUM('USD', 'EUR', 'GNF'),
      defaultValue: 'USD',
      allowNull: false
    },
    rentPeriod: {
      type: DataTypes.ENUM('monthly', 'yearly'),
      allowNull: true
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    area: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    areaUnit: {
      type: DataTypes.ENUM('m2', 'sqft', 'hectares', 'acres'),
      defaultValue: 'm2'
    },
    floors: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0
      }
    },
    yearBuilt: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1800,
        max: new Date().getFullYear()
      }
    },
    address: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    coordinates: {
      type: DataTypes.JSONB, // Changé de GEOMETRY à JSONB pour stocker lat/lng
      allowNull: true
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    amenities: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    images: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    documents: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isPremium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    favorites: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'properties',
    timestamps: true,
    indexes: [
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['price']
      },
      {
        fields: ['isFeatured']
      },
      {
        fields: ['isPremium']
      },
      {
        fields: ['ownerId']
      }
    ]
  });

  // Associations
  Property.associate = function(models) {
    Property.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner'
    });
    
    Property.hasMany(models.Appointment, {
      foreignKey: 'propertyId',
      as: 'appointments'
    });
    
    Property.hasMany(models.Message, {
      foreignKey: 'propertyId',
      as: 'messages'
    });
  };

  // Méthodes d'instance
  Property.prototype.incrementViews = function() {
    this.views += 1;
    return this.save();
  };

  Property.prototype.incrementFavorites = function() {
    this.favorites += 1;
    return this.save();
  };

  Property.prototype.decrementFavorites = function() {
    if (this.favorites > 0) {
      this.favorites -= 1;
      return this.save();
    }
    return Promise.resolve(this);
  };

  // Méthodes de classe
  Property.findByFilters = function(filters) {
    const where = {};
    
    if (filters.type) where.type = filters.type;
    if (filters.status) where.status = filters.status;
    if (filters.minPrice) where.price = { [Sequelize.Op.gte]: filters.minPrice };
    if (filters.maxPrice) where.price = { ...where.price, [Sequelize.Op.lte]: filters.maxPrice };
    if (filters.bedrooms) where.bedrooms = { [Sequelize.Op.gte]: filters.bedrooms };
    if (filters.bathrooms) where.bathrooms = { [Sequelize.Op.gte]: filters.bathrooms };
    if (filters.minArea) where.area = { [Sequelize.Op.gte]: filters.minArea };
    if (filters.maxArea) where.area = { ...where.area, [Sequelize.Op.lte]: filters.maxArea };
    if (filters.location) {
      where.address = {
        [Sequelize.Op.or]: [
          { city: { [Sequelize.Op.iLike]: `%${filters.location}%` } },
          { neighborhood: { [Sequelize.Op.iLike]: `%${filters.location}%` } }
        ]
      };
    }
    
    return this.findAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'owner',
          attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
  };

  return Property;
}; 