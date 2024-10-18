import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
  // Other fields you may want to include:
  // title: { type: String },
  // created_at: { type: Date, default: Date.now },
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;
