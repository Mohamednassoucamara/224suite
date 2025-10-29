
-- Insertion des données de test pour 224Suite
-- À exécuter dans le SQL Editor de Supabase

-- 1. Désactiver temporairement RLS pour l'insertion
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE property_images DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches DISABLE ROW LEVEL SECURITY;

-- 2. Insérer les utilisateurs de test
INSERT INTO users (email, password, first_name, last_name, phone, role, email_verified) VALUES
('admin@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', '224Suite', '+224123456789', 'admin', true),
('agent@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Agent', 'Immobilier', '+224123456790', 'agent', true),
('user@224suite.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Utilisateur', 'Test', '+224123456791', 'user', true);

-- 3. Insérer des images de test pour les propriétés
INSERT INTO property_images (property_id, image_url, alt_text, is_primary, sort_order) VALUES
((SELECT id FROM properties WHERE title = 'Villa moderne à Kaloum' LIMIT 1), 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800', 'Vue extérieure de la villa', true, 1),
((SELECT id FROM properties WHERE title = 'Villa moderne à Kaloum' LIMIT 1), 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'Salon de la villa', false, 2),
((SELECT id FROM properties WHERE title = 'Appartement 2 chambres à Dixinn' LIMIT 1), 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'Vue de l'appartement', true, 1),
((SELECT id FROM properties WHERE title = 'Terrain constructible à Ratoma' LIMIT 1), 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Vue du terrain', true, 1);

-- 4. Insérer des messages de test
INSERT INTO messages (name, email, phone, subject, message, property_id) VALUES
('Jean Dupont', 'jean.dupont@email.com', '+224123456792', 'Intéressé par la villa de Kaloum', 'Bonjour, je suis intéressé par cette villa. Pouvez-vous me donner plus d'informations sur les conditions de vente ?', (SELECT id FROM properties WHERE title = 'Villa moderne à Kaloum' LIMIT 1)),
('Marie Konaté', 'marie.konate@email.com', '+224123456793', 'Visite de l'appartement', 'Bonjour, j'aimerais visiter cet appartement. Quand seriez-vous disponible ?', (SELECT id FROM properties WHERE title = 'Appartement 2 chambres à Dixinn' LIMIT 1)),
('Ahmed Diallo', 'ahmed.diallo@email.com', '+224123456794', 'Question sur le terrain', 'Bonjour, ce terrain est-il viabilisé ? Y a-t-il des frais supplémentaires ?', (SELECT id FROM properties WHERE title = 'Terrain constructible à Ratoma' LIMIT 1));

-- 5. Insérer des favoris de test
INSERT INTO favorites (user_id, property_id) VALUES
((SELECT id FROM users WHERE email = 'user@224suite.com' LIMIT 1), (SELECT id FROM properties WHERE title = 'Villa moderne à Kaloum' LIMIT 1)),
((SELECT id FROM users WHERE email = 'user@224suite.com' LIMIT 1), (SELECT id FROM properties WHERE title = 'Appartement 2 chambres à Dixinn' LIMIT 1));

-- 6. Insérer des rendez-vous de test
INSERT INTO appointments (property_id, user_id, name, email, phone, appointment_date, message, status) VALUES
((SELECT id FROM properties WHERE title = 'Villa moderne à Kaloum' LIMIT 1), (SELECT id FROM users WHERE email = 'user@224suite.com' LIMIT 1), 'Utilisateur Test', 'user@224suite.com', '+224123456791', '2024-01-20 14:00:00+00', 'Je souhaite visiter cette villa demain après-midi', 'pending'),
((SELECT id FROM properties WHERE title = 'Appartement 2 chambres à Dixinn' LIMIT 1), (SELECT id FROM users WHERE email = 'user@224suite.com' LIMIT 1), 'Utilisateur Test', 'user@224suite.com', '+224123456791', '2024-01-21 10:00:00+00', 'Visite de l'appartement', 'confirmed');

-- 7. Réactiver RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- 8. Vérifier les données insérées
SELECT 'Utilisateurs' as table_name, count(*) as count FROM users
UNION ALL
SELECT 'Propriétés', count(*) FROM properties
UNION ALL
SELECT 'Images', count(*) FROM property_images
UNION ALL
SELECT 'Messages', count(*) FROM messages
UNION ALL
SELECT 'Favoris', count(*) FROM favorites
UNION ALL
SELECT 'Rendez-vous', count(*) FROM appointments;
