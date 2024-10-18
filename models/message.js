import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sender: { type: String },
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  content: { type: String, required: true },
  timestamp: { type: String, default: Date.now },
  emojis: [{ type: String }], // Array field for emojis
 // seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Add this field
 type: { type: String, enum: ['text', 'attachment', 'voice'], default: 'text' },
 // Other fields you may want to include:
  // attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
