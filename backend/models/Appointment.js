const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le demandeur est requis']
  },
  propertyOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  scheduledDate: {
    type: Date,
    required: [true, 'La date de rendez-vous est requise']
  },
  scheduledTime: {
    type: String,
    required: [true, 'L\'heure de rendez-vous est requise'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format d\'heure invalide (HH:MM)']
  },
  duration: {
    type: Number,
    default: 60, // en minutes
    min: [15, 'La durée minimale est de 15 minutes'],
    max: [240, 'La durée maximale est de 4 heures']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'declined', 'cancelled', 'completed'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['visit', 'virtual_tour', 'meeting', 'inspection'],
    default: 'visit'
  },
  notes: {
    type: String,
    maxlength: [1000, 'Les notes ne peuvent pas dépasser 1000 caractères']
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    whatsapp: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  reminderSentAt: Date,
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  feedback: {
    rating: {
      type: Number,
      min: [1, 'La note minimale est 1'],
      max: [5, 'La note maximale est 5']
    },
    comment: String,
    submittedAt: Date
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
appointmentSchema.index({ requester: 1, status: 1 });
appointmentSchema.index({ propertyOwner: 1, status: 1 });
appointmentSchema.index({ property: 1 });
appointmentSchema.index({ scheduledDate: 1, scheduledTime: 1 });
appointmentSchema.index({ status: 1, scheduledDate: 1 });

// Méthode pour confirmer un rendez-vous
appointmentSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

// Méthode pour décliner un rendez-vous
appointmentSchema.methods.decline = function(reason) {
  this.status = 'declined';
  this.cancellationReason = reason;
  return this.save();
};

// Méthode pour annuler un rendez-vous
appointmentSchema.methods.cancel = function(userId, reason) {
  this.status = 'cancelled';
  this.cancelledBy = userId;
  this.cancelledAt = new Date();
  this.cancellationReason = reason;
  return this.save();
};

// Méthode pour marquer comme terminé
appointmentSchema.methods.complete = function() {
  this.status = 'completed';
  return this.save();
};

// Méthode pour ajouter un feedback
appointmentSchema.methods.addFeedback = function(rating, comment) {
  this.feedback = {
    rating,
    comment,
    submittedAt: new Date()
  };
  return this.save();
};

// Méthode pour vérifier si le rendez-vous est en conflit
appointmentSchema.methods.hasConflict = function() {
  const startTime = new Date(this.scheduledDate);
  const [hours, minutes] = this.scheduledTime.split(':');
  startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const endTime = new Date(startTime.getTime() + this.duration * 60000);
  
  return this.constructor.findOne({
    propertyOwner: this.propertyOwner,
    status: { $in: ['pending', 'confirmed'] },
    _id: { $ne: this._id },
    $or: [
      {
        scheduledDate: this.scheduledDate,
        scheduledTime: {
          $gte: this.scheduledTime,
          $lt: endTime.toTimeString().slice(0, 5)
        }
      },
      {
        scheduledDate: this.scheduledDate,
        $expr: {
          $and: [
            { $gte: ['$scheduledTime', this.scheduledTime] },
            {
              $lt: ['$scheduledTime', {
                $dateToString: {
                  format: '%H:%M',
                  date: {
                    $add: [
                      { $dateFromString: { dateString: { $concat: [this.scheduledDate, 'T', this.scheduledTime, ':00'] } } },
                      this.duration * 60000
                    ]
                  }
                }
              }]
            }
          ]
        }
      }
    ]
  });
};

// Méthode pour obtenir les créneaux disponibles
appointmentSchema.statics.getAvailableSlots = function(propertyOwnerId, date, duration = 60) {
  const slots = [];
  const startHour = 8; // 8h00
  const endHour = 18; // 18h00
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // Créneaux de 30 minutes
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      // Vérifier si le créneau est disponible
      const hasConflict = this.findOne({
        propertyOwner: propertyOwnerId,
        scheduledDate: date,
        scheduledTime: time,
        status: { $in: ['pending', 'confirmed'] }
      });
      
      if (!hasConflict) {
        slots.push(time);
      }
    }
  }
  
  return slots;
};

module.exports = mongoose.model('Appointment', appointmentSchema);
