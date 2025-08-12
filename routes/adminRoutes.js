const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/isAdmin');
const {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/adminController');

// All admin routes require admin authentication
router.use(isAdmin);

router.get('/', getAllAdmins);
router.get('/:id', getAdminById);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;

