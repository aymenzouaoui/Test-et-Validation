import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Other fields you may want to include:
  // admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // If you want to specify an administrator for the group
  // description: { type: String },
  // created_at: { type: Date, default: Date.now },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
