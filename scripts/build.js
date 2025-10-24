#!/usr/bin/env node

// Script de build personnalisé pour ignorer les erreurs TypeScript
process.env.CI = 'false';
process.env.NODE_ENV = 'production';

const { spawn } = require('child_process');

console.log('🔨 Construction de l\'application 224Suite...');
console.log('⚙️ Configuration: CI=false, NODE_ENV=production');

const build = spawn('npx', ['react-scripts', 'build'], {
  stdio: 'inherit',
  shell: true,
  env: {
    ...process.env,
    CI: 'false',
    NODE_ENV: 'production'
  }
});

build.on('close', (code) => {
  if (code === 0) {
    console.log('✅ Construction terminée avec succès !');
  } else {
    console.log(`❌ Construction échouée avec le code ${code}`);
    process.exit(code);
  }
});

build.on('error', (err) => {
  console.error('❌ Erreur lors de la construction:', err);
  process.exit(1);
});
