import express from 'express';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { logActivity } from '../utils/logger.js';

const router = express.Router();

router.post(
  '/',
  protect,
  authorizeRoles('Admin', 'Manager'),
  async (req, res) => {
    const { title, description, assignedTo, dueDate } = req.body;

    try {
      const targetUser = await User.findById(assignedTo);
      if (!targetUser) {
        return res.status(404).json({ message: 'User to assign task to not found' });
      }

      const task = await Task.create({
        title,
        description,
        assignedTo,
        assignedBy: req.user._id,
        dueDate
      });

      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name email role');

      await logActivity(
        'TASK_CREATE',
        `Task created: "${task.title}", assigned to: ${targetUser.name}`,
        req.user._id
      );

      res.status(201).json(populatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

router.get('/', protect, async (req, res) => {
  try {
    let tasks;
    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name email role')
        .sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedTo', 'name email role')
        .populate('assignedBy', 'name email role')
        .sort({ createdAt: -1 });
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (
      req.user.role === 'User' &&
      task.assignedTo._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied: Not assigned to this task' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', protect, async (req, res) => {
  const { title, description, assignedTo, dueDate, status } = req.body;

  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;

    if (req.user.role === 'Admin' || req.user.role === 'Manager') {
      if (title) task.title = title;
      if (description) task.description = description;
      if (dueDate) task.dueDate = dueDate;
      if (status) task.status = status;
      
      if (assignedTo) {
        const targetUser = await User.findById(assignedTo);
        if (!targetUser) {
          return res.status(404).json({ message: 'User to assign task to not found' });
        }
        task.assignedTo = assignedTo;
      }

      await logActivity(
        'TASK_UPDATE',
        `Task metadata updated: "${task.title}" (Status: ${task.status})`,
        req.user._id
      );
    } else {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Forbidden: You can only edit tasks assigned to you' });
      }

      if (status) {
        task.status = status;
        await logActivity(
          'TASK_STATUS_CHANGE',
          `Task status changed: "${task.title}" (${oldStatus} -> ${status})`,
          req.user._id
        );
      } else {
        return res.status(400).json({ message: 'User can only update status field' });
      }
    }

    const updatedTask = await task.save();
    const populatedTask = await Task.findById(updatedTask._id)
      .populate('assignedTo', 'name email role')
      .populate('assignedBy', 'name email role');

    res.json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete(
  '/:id',
  protect,
  authorizeRoles('Admin', 'Manager'),
  async (req, res) => {
    try {
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const taskTitle = task.title;
      await task.deleteOne();
      
      await logActivity(
        'TASK_DELETE',
        `Task permanently deleted: "${taskTitle}"`,
        req.user._id
      );

      res.json({ message: 'Task removed successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

export default router;
