'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const properties = [
      {
        id: '660e8400-e29b-41d4-a716-446655440001',
        title: 'Appartement moderne au centre-ville',
        description: 'Magnifique appartement 3 pièces avec vue sur la ville, entièrement rénové avec des matériaux de qualité.',
        type: 'apartment',
        status: 'for-sale',
        price: 250000000,
        currency: 'GNF',
        bedrooms: 3,
        bathrooms: 2,
        area: 120,
        areaUnit: 'm2',
        floors: 5,
        yearBuilt: 2020,
        address: JSON.stringify({
          street: '123 Avenue de la République',
          neighborhood: 'Centre-ville',
          city: 'Conakry',
          postalCode: '001'
        }),
        coordinates: JSON.stringify({
          lat: -13.7123,
          lng: 9.5370
        }),
        features: JSON.stringify(['climatisation', 'ascenseur', 'garde']),
        amenities: JSON.stringify(['balcon', 'terrasse', 'parking']),
        images: JSON.stringify([
          {
            url: 'https://example.com/image1.jpg',
            caption: 'Vue extérieure'
          }
        ]),
        documents: JSON.stringify([]),
        isFeatured: true,
        isPremium: false,
        views: 45,
        favorites: 12,
        isActive: true,
        ownerId: '550e8400-e29b-41d4-a716-446655440001',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '660e8400-e29b-41d4-a716-446655440002',
        title: 'Villa avec piscine à Kaloum',
        description: 'Superbe villa 4 pièces avec piscine privée, jardin paysager et garage pour 2 voitures.',
        type: 'villa',
        status: 'for-rent',
        price: 1500000,
        currency: 'GNF',
        rentPeriod: 'monthly',
        bedrooms: 4,
        bathrooms: 3,
        area: 200,
        areaUnit: 'm2',
        floors: 2,
        yearBuilt: 2018,
        address: JSON.stringify({
          street: '456 Boulevard du Commerce',
          neighborhood: 'Kaloum',
          city: 'Conakry',
          postalCode: '001'
        }),
        coordinates: JSON.stringify({
          lat: -13.7123,
          lng: 9.5370
        }),
        features: JSON.stringify(['piscine', 'jardin', 'garage']),
        amenities: JSON.stringify(['climatisation', 'cuisine équipée', 'système de sécurité']),
        images: JSON.stringify([
          {
            url: 'https://example.com/image2.jpg',
            caption: 'Vue de la piscine'
          }
        ]),
        documents: JSON.stringify([]),
        isFeatured: true,
        isPremium: true,
        views: 78,
        favorites: 23,
        isActive: true,
        ownerId: '550e8400-e29b-41d4-a716-446655440002',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('properties', properties, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('properties', null, {});
  }
};
