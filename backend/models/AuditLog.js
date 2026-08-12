import { Schema, model } from 'mongoose';

const auditLogSchema = new Schema({
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  performedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export default model('AuditLog', auditLogSchema);
