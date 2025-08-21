const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Appointment = sequelize.define('Appointment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: true,
        notNull: true
      }
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      validate: {
        min: 15,
        max: 480
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show'),
      defaultValue: 'pending',
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('visit', 'inspection', 'meeting', 'virtual'),
      defaultValue: 'visit',
      allowNull: false
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reminderSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reminderSentAt: {
      type: DataTypes.DATE,
      allowNull: true
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
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    agentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'appointments',
    timestamps: true,
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['propertyId']
      },
      {
        fields: ['agentId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['date']
      },
      {
        fields: ['userId', 'date']
      }
    ]
  });

  // Associations
  Appointment.associate = function(models) {
    Appointment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Appointment.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
    
    Appointment.belongsTo(models.User, {
      foreignKey: 'agentId',
      as: 'agent'
    });
  };

  // Méthodes d'instance
  Appointment.prototype.confirm = function() {
    this.status = 'confirmed';
    return this.save();
  };

  Appointment.prototype.cancel = function(reason) {
    this.status = 'cancelled';
    this.cancellationReason = reason;
    return this.save();
  };

  Appointment.prototype.complete = function() {
    this.status = 'completed';
    return this.save();
  };

  Appointment.prototype.markAsNoShow = function() {
    this.status = 'no-show';
    return this.save();
  };

  // Méthodes de classe
  Appointment.findUpcoming = function(userId, limit = 10) {
    return this.findAll({
      where: {
        userId,
        date: { [Sequelize.Op.gte]: new Date() },
        status: { [Sequelize.Op.in]: ['pending', 'confirmed'] }
      },
      include: [
        {
          model: sequelize.models.Property,
          as: 'property',
          attributes: ['id', 'title', 'address', 'images']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']],
      limit
    });
  };

  Appointment.findByDateRange = function(startDate, endDate, status = null) {
    const where = {
      date: {
        [Sequelize.Op.between]: [startDate, endDate]
      }
    };
    
    if (status) {
      where.status = status;
    }
    
    return this.findAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'phone', 'email']
        },
        {
          model: sequelize.models.Property,
          as: 'property',
          attributes: ['id', 'title', 'address']
        }
      ],
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
  };

  return Appointment;
};
