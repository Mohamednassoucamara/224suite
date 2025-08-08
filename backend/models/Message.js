const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'expéditeur est requis']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le destinataire est requis']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  subject: {
    type: String,
    required: [true, 'Le sujet est requis'],
    trim: true,
    maxlength: [200, 'Le sujet ne peut pas dépasser 200 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    maxlength: [2000, 'Le contenu ne peut pas dépasser 2000 caractères']
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date
  },
  messageType: {
    type: String,
    enum: ['inquiry', 'response', 'appointment', 'general'],
    default: 'inquiry'
  },
  attachments: [{
    name: String,
    url: String,
    type: String,
    size: Number
  }],
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  threadId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ threadId: 1 });
messageSchema.index({ isRead: 1 });
messageSchema.index({ createdAt: -1 });

// Méthode pour marquer comme lu
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  return this.save();
};

// Méthode pour obtenir le thread de messages
messageSchema.statics.getThread = function(threadId) {
  return this.find({ threadId }).populate('sender recipient property').sort({ createdAt: 1 });
};

// Méthode pour obtenir les conversations d'un utilisateur
messageSchema.statics.getConversations = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [{ sender: userId }, { recipient: userId }]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$threadId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              { $and: [{ $eq: ['$recipient', userId] }, { $eq: ['$isRead', false] }] },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
};

module.exports = mongoose.model('Message', messageSchema);
