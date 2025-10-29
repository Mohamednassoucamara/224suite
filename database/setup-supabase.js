// Script de configuration de la base de données Supabase pour 224Suite
require('dotenv').config({ path: '../env.supabase.local' });
const fs = require('fs');
const path = require('path');
const { supabase, testConnection } = require('./supabase-config');

// Configuration Supabase
const supabaseUrl = 'https://yixwfiwyxhzjeixubmlr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpeHdmaXd5eGh6amVpeHVibWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzI3NDQsImV4cCI6MjA3Njk0ODc0NH0.sMwPos7KRBjH8AQToIi94NdCKvhpKdC-lsRMNEnWyQA';

async function setupSupabase() {
  console.log('🚀 Configuration de la base de données Supabase...\n');

  try {
    // Tester la connexion de base
    console.log('1. Test de connexion à Supabase...');
    try {
      const { data, error } = await supabase
        .from('pg_tables')
        .select('tablename')
        .limit(1);
      
      if (error) {
        console.error('❌ Erreur de connexion Supabase:', error.message);
        process.exit(1);
      }
      
      console.log('✅ Connexion Supabase établie avec succès');
    } catch (err) {
      console.error('❌ Erreur de connexion Supabase:', err.message);
      process.exit(1);
    }

    // Lire le schéma SQL
    console.log('2. Lecture du schéma SQL...');
    const schemaPath = path.join(__dirname, 'supabase-schema.sql');
    const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

    // Diviser le schéma en requêtes individuelles
    const queries = schemaSQL
      .split(';')
      .map(query => query.trim())
      .filter(query => query.length > 0 && !query.startsWith('--'));

    console.log(`   ${queries.length} requêtes SQL trouvées`);

    // Exécuter les requêtes via l'API REST
    console.log('3. Exécution du schéma...');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      if (query.trim()) {
        try {
          // Utiliser l'API REST pour exécuter le SQL
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'apikey': supabaseAnonKey
            },
            body: JSON.stringify({ sql_query: query })
          });

          if (!response.ok) {
            const errorData = await response.text();
            console.log(`   ⚠️  Requête ${i + 1}: ${errorData}`);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.log(`   ❌ Erreur requête ${i + 1}: ${err.message}`);
          errorCount++;
        }
      }
    }

    console.log(`\n✅ Configuration terminée:`);
    console.log(`   - ${successCount} requêtes exécutées avec succès`);
    console.log(`   - ${errorCount} requêtes avec erreurs`);

    if (errorCount === 0) {
      console.log('\n🎉 Base de données Supabase configurée avec succès !');
    } else {
      console.log('\n⚠️  Configuration terminée avec des avertissements');
    }

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error.message);
    process.exit(1);
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  setupSupabase();
}

module.exports = { setupSupabase };
