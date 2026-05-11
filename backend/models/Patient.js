const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est obligatoire'], trim: true },
  prenom: { type: String, required: [true, 'Le prénom est obligatoire'], trim: true },
  dateNaissance: { type: Date, required: [true, 'La date de naissance est obligatoire'] },
  sexe: { type: String, enum: ['Homme', 'Femme'], required: true },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    match: [/^[0-9]{8}$/, 'Numéro invalide (8 chiffres)']
  },
  email: {
    type: String,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  adresse: { type: String, trim: true },
  groupeSanguin: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', '']
  },
  antecedents: { type: String, default: '' },
  allergie: { type: String, default: '' },
  photo: { type: String, default: null },
  actif: { type: Boolean, default: true }
}, { timestamps: true });

// Virtuel : nom complet
patientSchema.virtual('nomComplet').get(function() {
  return `${this.prenom} ${this.nom}`;
});

// Virtuel : âge
patientSchema.virtual('age').get(function() {
  const today = new Date();
  const birth = new Date(this.dateNaissance);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
});

patientSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Patient', patientSchema);