const Patient = require('../models/Patient');
const Rendezvous = require('../models/Rendezvous');

// @desc   Créer un patient
// @route  POST /api/patients
exports.createPatient = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;

    const patient = await Patient.create(data);
    res.status(201).json({ success: true, message: 'Patient créé avec succès.', data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Obtenir tous les patients
// @route  GET /api/patients
exports.getPatients = async (req, res) => {
  try {
    const { search, actif } = req.query;
    let filter = {};

    if (actif !== undefined) filter.actif = actif === 'true';
    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: 'i' } },
        { prenom: { $regex: search, $options: 'i' } },
        { telephone: { $regex: search, $options: 'i' } }
      ];
    }

    const patients = await Patient.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: patients.length, data: patients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Obtenir un patient par ID
// @route  GET /api/patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient introuvable.' });
    }
    res.json({ success: true, data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};

// @desc   Mettre à jour un patient
// @route  PUT /api/patients/:id
exports.updatePatient = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient introuvable.' });
    }
    res.json({ success: true, message: 'Patient mis à jour.', data: patient });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc   Supprimer un patient
// @route  DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient introuvable.' });
    }
    // Supprimer aussi ses rendez-vous
    await Rendezvous.deleteMany({ patient: req.params.id });
    res.json({ success: true, message: 'Patient et ses rendez-vous supprimés.' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};

// @desc   Historique RDV d'un patient
// @route  GET /api/patients/:id/rendezvous
exports.getPatientRDV = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient introuvable.' });
    }

    const rdvs = await Rendezvous.find({ patient: req.params.id })
      .populate('medecin', 'nom prenom specialite')
      .sort({ date: -1 });

    res.json({ success: true, count: rdvs.length, data: rdvs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};