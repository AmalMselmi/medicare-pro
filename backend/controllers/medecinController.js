const Medecin = require('../models/Medecin');

exports.createMedecin = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;
    const medecin = await Medecin.create(data);
    res.status(201).json({ success: true, message: 'Médecin créé.', data: medecin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getMedecins = async (req, res) => {
  try {
    const { specialite, disponible } = req.query;
    let filter = {};
    if (specialite) filter.specialite = specialite;
    if (disponible !== undefined) filter.disponible = disponible === 'true';

    const medecins = await Medecin.find(filter).sort({ nom: 1 });
    res.json({ success: true, count: medecins.length, data: medecins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMedecinById = async (req, res) => {
  try {
    const medecin = await Medecin.findById(req.params.id);
    if (!medecin) return res.status(404).json({ success: false, message: 'Médecin introuvable.' });
    res.json({ success: true, data: medecin });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};

exports.updateMedecin = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.photo = req.file.filename;
    const medecin = await Medecin.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    if (!medecin) return res.status(404).json({ success: false, message: 'Médecin introuvable.' });
    res.json({ success: true, message: 'Médecin mis à jour.', data: medecin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteMedecin = async (req, res) => {
  try {
    const medecin = await Medecin.findByIdAndDelete(req.params.id);
    if (!medecin) return res.status(404).json({ success: false, message: 'Médecin introuvable.' });
    res.json({ success: true, message: 'Médecin supprimé.' });
  } catch (error) {
    res.status(400).json({ success: false, message: 'ID invalide.' });
  }
};