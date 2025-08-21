const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Subscription = sequelize.define('Subscription', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    plan: {
      type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
      defaultValue: 'basic',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'cancelled', 'expired', 'pending'),
      defaultValue: 'inactive',
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notNull: true
      }
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        isDate: true
      }
    },
    autoRenew: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    paymentMethod: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
      defaultValue: 'pending',
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
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
    billingCycle: {
      type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
      defaultValue: 'monthly',
      allowNull: false
    },
    features: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    limits: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'subscriptions',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['plan']
      },
      {
        fields: ['startDate']
      },
      {
        fields: ['endDate']
      },
      {
        fields: ['paymentStatus']
      }
    ]
  });

  // Associations
  Subscription.associate = function(models) {
    Subscription.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  // Méthodes d'instance
  Subscription.prototype.checkIsActive = function() {
    if (this.status !== 'active') return false;
    if (!this.endDate) return true;
    return new Date() <= this.endDate;
  };

  Subscription.prototype.isExpired = function() {
    if (!this.endDate) return false;
    return new Date() > this.endDate;
  };

  Subscription.prototype.daysUntilExpiry = function() {
    if (!this.endDate) return null;
    const now = new Date();
    const diffTime = this.endDate - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  Subscription.prototype.activate = function() {
    this.status = 'active';
    this.startDate = new Date();
    return this.save();
  };

  Subscription.prototype.cancel = function() {
    this.status = 'cancelled';
    this.autoRenew = false;
    return this.save();
  };

  Subscription.prototype.renew = function() {
    if (this.billingCycle === 'monthly') {
      this.endDate = new Date(this.endDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    } else if (this.billingCycle === 'quarterly') {
      this.endDate = new Date(this.endDate.getTime() + 90 * 24 * 60 * 60 * 1000);
    } else if (this.billingCycle === 'yearly') {
      this.endDate = new Date(this.endDate.getTime() + 365 * 24 * 60 * 60 * 1000);
    }
    return this.save();
  };

  // Méthodes de classe
  Subscription.findActiveByUser = function(userId) {
    return this.findOne({
      where: {
        userId,
        status: 'active',
        [Sequelize.Op.or]: [
          { endDate: null },
          { endDate: { [Sequelize.Op.gt]: new Date() } }
        ]
      }
    });
  };

  Subscription.findExpiringSoon = function(days = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);
    
    return this.findAll({
      where: {
        status: 'active',
        endDate: {
          [Sequelize.Op.between]: [new Date(), futureDate]
        }
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }
      ]
    });
  };

  Subscription.getPlanFeatures = function(plan) {
    const features = {
      basic: {
        maxProperties: 5,
        maxImages: 10,
        maxAppointments: 20,
        support: 'email',
        analytics: false,
        featured: false
      },
      premium: {
        maxProperties: 25,
        maxImages: 50,
        maxAppointments: 100,
        support: 'priority',
        analytics: true,
        featured: true
      },
      enterprise: {
        maxProperties: -1, // illimité
        maxImages: -1, // illimité
        maxAppointments: -1, // illimité
        support: 'dedicated',
        analytics: true,
        featured: true
      }
    };
    
    return features[plan] || features.basic;
  };

  return Subscription;
};
