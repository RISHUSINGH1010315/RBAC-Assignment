import AuditLog from '../models/AuditLog.js';

export const logActivity = async (action, details, userId) => {
  try {
    await AuditLog.create({
      action,
      details,
      performedBy: userId
    });
  } catch (error) {
    console.error('Audit Logging failed:', error.message);
  }
};
