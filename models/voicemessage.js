import mongoose from 'mongoose';

const voiceMessageSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  url: { type: String, required: true },
});

const VoiceMessage = mongoose.model('VoiceMessage', voiceMessageSchema);

export default VoiceMessage;
