module.exports = {
  apps: [{
    name: '224suite-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    // Configuration pour O2switch VPS
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    // Redémarrage automatique
    autorestart: true,
    watch: false,
    max_restarts: 10,
    min_uptime: '10s',
    // Variables d'environnement spécifiques à O2switch
    env: {
      NODE_ENV: 'production',
      PORT: 5000,
      MONGODB_URI: 'mongodb+srv://user:pass@cluster.mongodb.net/224suite',
      JWT_SECRET: 'votre_jwt_secret_tres_securise',
      CLOUDINARY_CLOUD_NAME: 'votre_cloud_name',
      CLOUDINARY_API_KEY: 'votre_api_key',
      CLOUDINARY_API_SECRET: 'votre_api_secret',
      STRIPE_SECRET_KEY: 'sk_test_votre_cle_secrete',
      EMAIL_HOST: 'smtp.gmail.com',
      EMAIL_PORT: 587,
      EMAIL_USER: 'votre_email@gmail.com',
      EMAIL_PASS: 'votre_mot_de_passe_app',
      FRONTEND_URL: 'https://votre-domaine.com'
    }
  }]
};
