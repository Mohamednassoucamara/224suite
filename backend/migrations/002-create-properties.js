'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('properties', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('apartment', 'house', 'villa', 'land', 'commercial', 'office'),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('for-sale', 'for-rent', 'sold', 'rented'),
        defaultValue: 'for-sale',
        allowNull: false
      },
      price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.ENUM('USD', 'EUR', 'GNF'),
        defaultValue: 'USD',
        allowNull: false
      },
      rentPeriod: {
        type: Sequelize.ENUM('monthly', 'yearly'),
        allowNull: true
      },
      bedrooms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      bathrooms: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      area: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      areaUnit: {
        type: Sequelize.ENUM('m2', 'sqft', 'hectares', 'acres'),
        defaultValue: 'm2'
      },
      floors: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      yearBuilt: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      address: {
        type: Sequelize.JSONB,
        allowNull: false
      },
      coordinates: {
        type: Sequelize.JSONB, // Changé de GEOMETRY à JSONB pour stocker lat/lng
        allowNull: true
      },
      features: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      amenities: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      images: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      documents: {
        type: Sequelize.JSONB,
        defaultValue: []
      },
      isFeatured: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      isPremium: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      favorites: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      ownerId: {
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
    await queryInterface.addIndex('properties', ['type']);
    await queryInterface.addIndex('properties', ['status']);
    await queryInterface.addIndex('properties', ['price']);
    await queryInterface.addIndex('properties', ['isFeatured']);
    await queryInterface.addIndex('properties', ['isPremium']);
    await queryInterface.addIndex('properties', ['ownerId']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('properties');
  }
};
