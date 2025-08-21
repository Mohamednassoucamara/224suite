'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+224611925997',
        password: hashedPassword,
        role: 'user',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+224611925998',
        password: hashedPassword,
        role: 'agent',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@224suite.com',
        phone: '+224611925999',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
