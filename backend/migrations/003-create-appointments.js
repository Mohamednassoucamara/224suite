'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('appointments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      time: {
        type: Sequelize.TIME,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 60
      },
      status: {
        type: Sequelize.ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show'),
        defaultValue: 'pending',
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('visit', 'inspection', 'meeting', 'virtual'),
        defaultValue: 'visit',
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      cancellationReason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      reminderSent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      reminderSentAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      userId: {
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
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      agentId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
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
    await queryInterface.addIndex('appointments', ['userId']);
    await queryInterface.addIndex('appointments', ['propertyId']);
    await queryInterface.addIndex('appointments', ['agentId']);
    await queryInterface.addIndex('appointments', ['status']);
    await queryInterface.addIndex('appointments', ['date']);
    await queryInterface.addIndex('appointments', ['userId', 'date']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('appointments');
  }
};
