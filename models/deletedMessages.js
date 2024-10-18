// deletedMessages.js
import mongoose from 'mongoose';

const deletedMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    required: true,
  },
});

const DeletedMessage = mongoose.model('DeletedMessage', deletedMessageSchema);

export default DeletedMessage;