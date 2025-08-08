const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuration du stockage Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: '224suite',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Configuration Multer pour l'upload local (fallback)
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.originalname.split('.').pop());
  }
});

// Filtre pour les types de fichiers
const fileFilter = (req, file, cb) => {
  // Vérifier le type MIME
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

// Configuration de l'upload
const upload = multer({
  storage: process.env.NODE_ENV === 'production' ? storage : localStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: 10 // 10 fichiers max
  }
});

// Fonction pour supprimer une image de Cloudinary
const deleteImage = async (publicId) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
    return { success: true };
  } catch (error) {
    console.error('Erreur suppression image:', error);
    throw error;
  }
};

// Fonction pour optimiser une image
const optimizeImage = async (imageUrl, options = {}) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const transformation = {
        width: options.width || 800,
        height: options.height || 600,
        crop: options.crop || 'limit',
        quality: options.quality || 'auto',
        format: options.format || 'auto'
      };

      const optimizedUrl = cloudinary.url(imageUrl, { transformation });
      return optimizedUrl;
    }
    return imageUrl;
  } catch (error) {
    console.error('Erreur optimisation image:', error);
    return imageUrl;
  }
};

// Fonction pour créer une miniature
const createThumbnail = async (imageUrl, options = {}) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const transformation = {
        width: options.width || 300,
        height: options.height || 200,
        crop: options.crop || 'fill',
        quality: options.quality || 'auto'
      };

      const thumbnailUrl = cloudinary.url(imageUrl, { transformation });
      return thumbnailUrl;
    }
    return imageUrl;
  } catch (error) {
    console.error('Erreur création miniature:', error);
    return imageUrl;
  }
};

// Middleware pour gérer les erreurs d'upload
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'Fichier trop volumineux. Taille maximale : 5MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Trop de fichiers. Maximum : 10 fichiers'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        error: 'Champ de fichier inattendu'
      });
    }
  }

  if (error.message === 'Seules les images sont autorisées') {
    return res.status(400).json({
      success: false,
      error: 'Seules les images sont autorisées'
    });
  }

  console.error('Erreur upload:', error);
  res.status(500).json({
    success: false,
    error: 'Erreur lors de l\'upload des fichiers'
  });
};

// Fonction pour valider les dimensions d'image
const validateImageDimensions = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const minWidth = 300;
      const minHeight = 200;
      const maxWidth = 4000;
      const maxHeight = 4000;

      if (img.width < minWidth || img.height < minHeight) {
        reject(new Error(`Image trop petite. Dimensions minimales : ${minWidth}x${minHeight}px`));
      } else if (img.width > maxWidth || img.height > maxHeight) {
        reject(new Error(`Image trop grande. Dimensions maximales : ${maxWidth}x${maxHeight}px`));
      } else {
        resolve(true);
      }
    };
    img.onerror = () => {
      reject(new Error('Impossible de lire les dimensions de l\'image'));
    };
    img.src = URL.createObjectURL(file);
  });
};

// Configuration pour différents types d'upload
const uploadConfigs = {
  // Upload simple d'une image
  single: upload.single('image'),
  
  // Upload de plusieurs images
  multiple: upload.array('images', 10),
  
  // Upload avec champs multiples
  fields: upload.fields([
    { name: 'mainImage', maxCount: 1 },
    { name: 'gallery', maxCount: 9 }
  ])
};

module.exports = {
  upload,
  uploadImage: upload,
  uploadConfigs,
  deleteImage,
  optimizeImage,
  createThumbnail,
  handleUploadError,
  validateImageDimensions
}; 