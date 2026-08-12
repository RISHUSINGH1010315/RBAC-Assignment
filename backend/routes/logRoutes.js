import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all audit logs (Admin only)
// @route   GET /api/logs
// @access  Private (Admin only)
router.get('/', protect, authorizeRoles('Admin'), async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .populate('performedBy', 'name email role')
      .sort({ timestamp: -1 })
      .limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
