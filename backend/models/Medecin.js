const mongoose = require('mongoose');

const medecinSchema = new mongoose.Schema({
  nom: { type: String, required: [true, 'Le nom est obligatoire'], trim: true },
  prenom: { type: String, required: [true, 'Le prénom est obligatoire'], trim: true },
  specialite: {
    type: String,
    required: [true, 'La spécialité est obligatoire'],
    enum: [
      'Généraliste', 'Cardiologue', 'Dermatologue', 'Pédiatre',
      'Gynécologue', 'Orthopédiste', 'Ophtalmologue', 'ORL',
      'Neurologue', 'Psychiatre', 'Radiologue', 'Autre'
    ]
  },
  telephone: {
    type: String,
    required: [true, 'Le téléphone est obligatoire'],
    match: [/^[0-9]{8}$/, 'Numéro invalide (8 chiffres)']
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  disponible: { type: Boolean, default: true },
  horaires: {
    debut: { type: String, default: '08:00' },
    fin: { type: String, default: '17:00' }
  },
  photo: { type: String, default: null }
}, { timestamps: true });

// Virtuel : nom complet
medecinSchema.virtual('nomComplet').get(function() {
  return `Dr. ${this.prenom} ${this.nom}`;
});

medecinSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Medecin', medecinSchema);