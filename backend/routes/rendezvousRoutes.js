const express = require('express');
const router = express.Router();
const {
  createRDV, getRDVs, getRDVById, updateRDV, deleteRDV, getStats
} = require('../controllers/rendezvousController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getStats);
router.get('/', getRDVs);
router.post('/', createRDV);
router.get('/:id', getRDVById);
router.put('/:id', updateRDV);
router.delete('/:id', deleteRDV);

module.exports = router;