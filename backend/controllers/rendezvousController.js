const Rendezvous = require('../models/Rendezvous');
const Patient = require('../models/Patient');
const Medecin = require('../models/Medecin');

exports.createRDV = async (req, res) => {
  try {
    // Vérifier que patient et médecin existent
    const [patient, medecin] = await Promise.all([
      Patient.findById(req.body.patient),
      Medecin.findById(req.body.medecin)
    ]);
    if (!patient) return res.status(404).json({ success: false, message: 'Patient introuvable.' });
    if (!medecin) return res.status(404).json({ success: false, message: 'Médecin introuvable.' });

    // Vérifier conflit horaire
    const conflict = await Rendezvous.findOne({
      medecin: req.body.medecin,
      date: new Date(req.body.date),
      heure: req.body.heure,
      statut: { $nin: ['annulé'] }
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'Ce créneau est déjà réservé pour ce médecin.' });
    }

    const rdv = await Rendezvous.create(req.body);
    const populated = await rdv.populate([
      { path: 'patient', select: 'nom prenom telephone' },
      { path: 'medecin', select: 'nom prenom specialite' }
    ]);

    res.status(201).json({ success: true, message: 'Rendez-vous créé.', data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRDVs = async (req, res) => {
  try {
    const { dateDebut, dateFin, medecin, statut, patient } = req.query;
    let filter = {};

    if (medecin) filter.medecin = medecin;
    if (statut) filter.statut = statut;
    if (patient) filter.patient = patient;

    if (dateDebut || dateFin) {
      filter.date = {};
      if (dateDebut) filter.date.$gte = new Date(dateDebut);
      if (dateFin) filter.date.$lte = new Date(dateFin);
    }

    const rdvs = await Rendezvous.find(filter)
      .populate('patient', 'nom prenom telephone sexe')
      .populate('medecin', 'nom prenom specialite')
      .sort({ date: 1, heure: 1 });

    res.json({ success: true, count: rdvs.length, data: rdvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRDVById = async (req, res) => {
  try {
    const rdv = await Rendezvous.findById(req.params.id)
      .populate('patient', 'nom prenom telephone dateNaissance groupeSanguin')
      .populate('medecin', 'nom prenom specialite telephone');

    if (!rdv) return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    res.json({ success: true, data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};

exports.updateRDV = async (req, res) => {
  try {
    const rdv = await Rendezvous.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('patient', 'nom prenom').populate('medecin', 'nom prenom specialite');

    if (!rdv) return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    res.json({ success: true, message: 'Rendez-vous mis à jour.', data: rdv });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteRDV = async (req, res) => {
  try {
    const rdv = await Rendezvous.findByIdAndDelete(req.params.id);
    if (!rdv) return res.status(404).json({ success: false, message: 'Rendez-vous introuvable.' });
    res.json({ success: true, message: 'Rendez-vous supprimé.' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const Medecin = require('../models/Medecin');

    const [totalRDV, rdvAujourdhui, totalPatients, totalMedecins, rdvParStatut] = await Promise.all([
      Rendezvous.countDocuments(),
      Rendezvous.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
      Patient.countDocuments({ actif: true }),
      Medecin.countDocuments(),
      Rendezvous.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      success: true,
      data: { totalRDV, rdvAujourdhui, totalPatients, totalMedecins, rdvParStatut }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};