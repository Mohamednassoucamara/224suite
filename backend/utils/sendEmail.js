const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true pour 465, false pour les autres ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Fonction pour envoyer un email
const sendEmail = async (options) => {
  try {
    // Configuration de l'email
    const mailOptions = {
      from: `"224Suite" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    throw error;
  }
};

// Fonction pour envoyer un email de bienvenue
const sendWelcomeEmail = async (user) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1>Bienvenue sur 224Suite !</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2>Bonjour ${user.firstName} ${user.lastName},</h2>
        
        <p>Nous sommes ravis de vous accueillir sur 224Suite, la plateforme immobilière de référence à Conakry !</p>
        
        <p>Votre compte a été créé avec succès. Voici ce que vous pouvez faire maintenant :</p>
        
        <ul>
          <li>Compléter votre profil</li>
          <li>Parcourir les biens disponibles</li>
          <li>Publier vos propres annonces</li>
          <li>Contacter des propriétaires ou agences</li>
        </ul>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Vos informations de compte :</h3>
          <p><strong>Email :</strong> ${user.email}</p>
          <p><strong>Type de compte :</strong> ${user.userType === 'owner' ? 'Propriétaire' : user.userType === 'agency' ? 'Agence' : 'Chercheur'}</p>
        </div>
        
        <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
        
        <p>Cordialement,<br>L'équipe 224Suite</p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© 2024 224Suite. Tous droits réservés.</p>
        <p>Conakry, Guinée</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Bienvenue sur 224Suite !',
    message
  });
};

// Fonction pour envoyer un email de notification de nouvelle propriété
const sendNewPropertyNotification = async (user, property) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1>Nouvelle propriété disponible !</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2>Bonjour ${user.firstName},</h2>
        
        <p>Une nouvelle propriété correspondant à vos critères vient d'être publiée :</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>${property.title}</h3>
          <p><strong>Prix :</strong> ${property.formatPrice()}</p>
          <p><strong>Localisation :</strong> ${property.location.neighborhood}, ${property.location.city}</p>
          <p><strong>Type :</strong> ${property.type}</p>
          <p><strong>Surface :</strong> ${property.features.area}m²</p>
          ${property.features.bedrooms ? `<p><strong>Chambres :</strong> ${property.features.bedrooms}</p>` : ''}
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/property/${property._id}" 
             style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Voir les détails
          </a>
        </div>
        
        <p>Ne manquez pas cette opportunité !</p>
        
        <p>Cordialement,<br>L'équipe 224Suite</p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© 2024 224Suite. Tous droits réservés.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Nouvelle propriété : ${property.title}`,
    message
  });
};

// Fonction pour envoyer un email de contact
const sendContactEmail = async (contactData) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1>Nouveau message de contact</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2>Détails du contact :</h2>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Nom :</strong> ${contactData.name}</p>
          <p><strong>Email :</strong> ${contactData.email}</p>
          <p><strong>Téléphone :</strong> ${contactData.phone || 'Non renseigné'}</p>
          <p><strong>Sujet :</strong> ${contactData.subject}</p>
          <p><strong>Message :</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: process.env.EMAIL_USER, // Email de l'équipe
    subject: `Nouveau contact : ${contactData.subject}`,
    message
  });
};

// Fonction pour envoyer un email de confirmation de contact
const sendContactConfirmation = async (contactData) => {
  const message = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f97316; color: white; padding: 20px; text-align: center;">
        <h1>Message reçu</h1>
      </div>
      
      <div style="padding: 20px;">
        <h2>Bonjour ${contactData.name},</h2>
        
        <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contacté.</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Récapitulatif de votre message :</h3>
          <p><strong>Sujet :</strong> ${contactData.subject}</p>
          <p><strong>Message :</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <p>Notre équipe va examiner votre demande et vous répondre dans les plus brefs délais.</p>
        
        <p>En attendant, n'hésitez pas à explorer notre plateforme pour découvrir les biens immobiliers disponibles.</p>
        
        <p>Cordialement,<br>L'équipe 224Suite</p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p>© 2024 224Suite. Tous droits réservés.</p>
      </div>
    </div>
  `;

  await sendEmail({
    email: contactData.email,
    subject: 'Confirmation de votre message - 224Suite',
    message
  });
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendNewPropertyNotification,
  sendContactEmail,
  sendContactConfirmation
}; 