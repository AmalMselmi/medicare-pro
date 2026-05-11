const mongoose = require('mongoose');

const rendezvousSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Le patient est obligatoire']
  },
  medecin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medecin',
    required: [true, 'Le médecin est obligatoire']
  },
  date: {
    type: Date,
    required: [true, 'La date est obligatoire'],
    validate: {
      validator: function(v) {
        return v >= new Date(new Date().setHours(0,0,0,0));
      },
      message: 'La date ne peut pas être dans le passé'
    }
  },
  heure: {
    type: String,
    required: [true, 'L\'heure est obligatoire'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Heure invalide (HH:MM)']
  },
  motif: { type: String, required: [true, 'Le motif est obligatoire'], trim: true },
  statut: {
    type: String,
    enum: ['planifié', 'confirmé', 'en cours', 'terminé', 'annulé'],
    default: 'planifié'
  },
  notes: { type: String, default: '' },
  duree: { type: Number, default: 30 } // minutes
}, { timestamps: true });

// Index pour éviter les conflits de rendez-vous
rendezvousSchema.index({ medecin: 1, date: 1, heure: 1 }, { unique: true });

module.exports = mongoose.model('Rendezvous', rendezvousSchema);