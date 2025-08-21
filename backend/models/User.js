const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
        notEmpty: true
      }
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: true,
        is: /^\+?[1-9]\d{1,14}$/
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
        notEmpty: true
      }
    },
    role: {
      type: DataTypes.ENUM('user', 'agent', 'admin'),
      defaultValue: 'user',
      allowNull: false
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    verificationToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordToken: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profileImage: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    preferences: {
      type: DataTypes.JSONB,
      defaultValue: {}
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  }, {
    tableName: 'users',
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  // Méthodes d'instance
  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.prototype.generateAuthToken = function() {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  };

  User.prototype.generateVerificationToken = function() {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
  };

  User.prototype.generateResetPasswordToken = function() {
    return jwt.sign(
      { id: this.id, email: this.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );
  };

  // Méthodes de classe
  User.findByEmail = function(email) {
    return this.findOne({ where: { email } });
  };

  User.findByVerificationToken = function(token) {
    return this.findOne({ where: { verificationToken: token } });
  };

  User.findByResetPasswordToken = function(token) {
    return this.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [Sequelize.Op.gt]: new Date() }
      }
    });
  };

  // Associations
  User.associate = function(models) {
    User.hasMany(models.Property, { 
      foreignKey: 'ownerId', 
      as: 'properties' 
    });
    User.hasMany(models.Appointment, { 
      foreignKey: 'userId', 
      as: 'appointments' 
    });
    User.hasMany(models.Message, { 
      foreignKey: 'senderId', 
      as: 'sentMessages' 
    });
    User.hasMany(models.Message, { 
      foreignKey: 'receiverId', 
      as: 'receivedMessages' 
    });
    User.hasOne(models.Subscription, { 
      foreignKey: 'userId', 
      as: 'subscription' 
    });
  };

  return User;
}; 