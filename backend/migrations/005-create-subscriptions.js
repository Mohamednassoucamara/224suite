'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      plan: {
        type: Sequelize.ENUM('basic', 'premium', 'enterprise'),
        defaultValue: 'basic',
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive', 'cancelled', 'expired', 'pending'),
        defaultValue: 'inactive',
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      autoRenew: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: true
      },
      paymentStatus: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending',
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('USD', 'EUR', 'GNF'),
        defaultValue: 'USD',
        allowNull: false
      },
      billingCycle: {
        type: Sequelize.ENUM('monthly', 'quarterly', 'yearly'),
        defaultValue: 'monthly',
        allowNull: false
      },
      features: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      limits: {
        type: Sequelize.JSONB,
        defaultValue: {}
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {}
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
    await queryInterface.addIndex('subscriptions', ['userId']);
    await queryInterface.addIndex('subscriptions', ['status']);
    await queryInterface.addIndex('subscriptions', ['plan']);
    await queryInterface.addIndex('subscriptions', ['startDate']);
    await queryInterface.addIndex('subscriptions', ['endDate']);
    await queryInterface.addIndex('subscriptions', ['paymentStatus']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('subscriptions');
  }
};
