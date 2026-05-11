const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est obligatoire'] },
  email: {
    type: String,
    required: [true, 'L\'email est obligatoire'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  motDePasse: {
    type: String,
    required: [true, 'Le mot de passe est obligatoire'],
    minlength: [6, 'Minimum 6 caractères']
  },
  role: {
    type: String,
    enum: ['secretaire', 'medecin', 'admin'],
    default: 'secretaire'
  },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);