const express = require('express');
const router = express.Router();
const {
  createPatient, getPatients, getPatientById,
  updatePatient, deletePatient, getPatientRDV
} = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', getPatients);
router.post('/', upload.single('photo'), createPatient);
router.get('/:id', getPatientById);
router.put('/:id', upload.single('photo'), updatePatient);
router.delete('/:id', deletePatient);
router.get('/:id/rendezvous', getPatientRDV);

module.exports = router;