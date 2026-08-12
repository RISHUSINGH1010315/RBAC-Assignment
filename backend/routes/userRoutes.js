import express from 'express';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.get('/', protect, authorizeRoles('Admin', 'Manager'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id/role', protect, authorizeRoles('Admin'), async (req, res) => {
  const { role } = req.body;

  if (!['Admin', 'Manager', 'User'].includes(role)) {
    return res.status(400).json({ message: 'Invalid role specified' });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString() && role !== 'Admin') {
      return res.status(400).json({ message: 'Cannot demote your own admin account.' });
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    await logActivity(
      'USER_ROLE_CHANGE',
      `Privilege changed for ${user.name}: ${oldRole} -> ${role}`,
      req.user._id
    );

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      message: `User role updated to ${role}`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, authorizeRoles('Admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own admin account.' });
    }

    const targetName = user.name;
    await user.deleteOne();

    await logActivity(
      'USER_DELETE',
      `User account deleted: ${targetName}`,
      req.user._id
    );

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
