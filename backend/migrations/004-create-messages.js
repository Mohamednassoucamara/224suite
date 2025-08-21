'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('messages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('text', 'image', 'file', 'location'),
        defaultValue: 'text',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('sent', 'delivered', 'read'),
        defaultValue: 'sent',
        allowNull: false
      },
      isRead: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      readAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      attachments: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      senderId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      receiverId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      propertyId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      parentMessageId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'messages',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Index pour améliorer les performances
    await queryInterface.addIndex('messages', ['senderId']);
    await queryInterface.addIndex('messages', ['receiverId']);
    await queryInterface.addIndex('messages', ['propertyId']);
    await queryInterface.addIndex('messages', ['status']);
    await queryInterface.addIndex('messages', ['isRead']);
    await queryInterface.addIndex('messages', ['createdAt']);
    await queryInterface.addIndex('messages', ['senderId', 'receiverId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('messages');
  }
};
