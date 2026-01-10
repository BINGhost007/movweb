const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  banUser,
  getUserStats
} = require('../controllers/userController');

router.get('/stats', protect, admin, getUserStats);

// Admin routes
router.get('/', protect, admin, getUsers);
router.get('/:id', protect, admin, getUserById);
router.put('/:id', protect, admin, updateUser);
router.delete('/:id', protect, admin, deleteUser);
router.put('/:id/ban', protect, admin, banUser);

module.exports = router;