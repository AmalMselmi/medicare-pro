const express = require('express');
const router = express.Router();
const {
  createMedecin, getMedecins, getMedecinById, updateMedecin, deleteMedecin
} = require('../controllers/medecinController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', getMedecins);
router.post('/', upload.single('photo'), createMedecin);
router.get('/:id', getMedecinById);
router.put('/:id', upload.single('photo'), updateMedecin);
router.delete('/:id', deleteMedecin);

module.exports = router;