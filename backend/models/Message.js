const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 5000]
      }
    },
    type: {
      type: DataTypes.ENUM('text', 'image', 'file', 'location'),
      defaultValue: 'text',
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('sent', 'delivered', 'read'),
      defaultValue: 'sent',
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    readAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    attachments: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    senderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    receiverId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'properties',
        key: 'id'
      }
    },
    parentMessageId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'messages',
        key: 'id'
      }
    }
  }, {
    tableName: 'messages',
    timestamps: true,
    indexes: [
      {
        fields: ['senderId']
      },
      {
        fields: ['receiverId']
      },
      {
        fields: ['propertyId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['isRead']
      },
      {
        fields: ['createdAt']
      },
      {
        fields: ['senderId', 'receiverId']
      }
    ]
  });

  // Associations
  Message.associate = function(models) {
    Message.belongsTo(models.User, {
      foreignKey: 'senderId',
      as: 'sender'
    });
    
    Message.belongsTo(models.User, {
      foreignKey: 'receiverId',
      as: 'receiver'
    });
    
    Message.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    });
    
    Message.belongsTo(Message, {
      foreignKey: 'parentMessageId',
      as: 'parentMessage'
    });
    
    Message.hasMany(Message, {
      foreignKey: 'parentMessageId',
      as: 'replies'
    });
  };

  // Méthodes d'instance
  Message.prototype.markAsRead = function() {
    this.isRead = true;
    this.status = 'read';
    this.readAt = new Date();
    return this.save();
  };

  Message.prototype.markAsDelivered = function() {
    this.status = 'delivered';
    return this.save();
  };

  // Méthodes de classe
  Message.findConversation = function(user1Id, user2Id, propertyId = null, limit = 50) {
    const where = {
      [Sequelize.Op.or]: [
        {
          senderId: user1Id,
          receiverId: user2Id
        },
        {
          senderId: user2Id,
          receiverId: user1Id
        }
      ]
    };
    
    if (propertyId) {
      where.propertyId = propertyId;
    }
    
    return this.findAll({
      where,
      include: [
        {
          model: sequelize.models.User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: sequelize.models.User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: sequelize.models.Property,
          as: 'property',
          attributes: ['id', 'title', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });
  };

  Message.findUnreadCount = function(userId) {
    return this.count({
      where: {
        receiverId: userId,
        isRead: false
      }
    });
  };

  Message.findUnreadMessages = function(userId, limit = 20) {
    return this.findAll({
      where: {
        receiverId: userId,
        isRead: false
      },
      include: [
        {
          model: sequelize.models.User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'profileImage']
        },
        {
          model: sequelize.models.Property,
          as: 'property',
          attributes: ['id', 'title', 'images']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });
  };

  return Message;
};
