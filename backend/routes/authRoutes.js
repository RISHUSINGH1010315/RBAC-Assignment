import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretkey123_rbac_task_manager_jwt_tokens', {
    expiresIn: '30d'
  });
};

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let selectedRole = role || 'User';
    if (selectedRole === 'Admin') {
      const adminCount = await User.countDocuments({ role: 'Admin' });
      if (adminCount > 0) {
        return res.status(403).json({ message: 'Cannot register Admin account directly. Contact an administrator.' });
      }
    }

    const user = await User.create({
      name,
      email,
      password,
      role: selectedRole
    });

    if (user) {
      await logActivity('USER_REGISTER', `New operative registered: ${user.name} (${user.role})`, user._id);
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      await logActivity('USER_LOGIN', `Operative signed in: ${user.name}`, user._id);
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
