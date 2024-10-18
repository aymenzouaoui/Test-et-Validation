import mongoose from 'mongoose';

const attachmentSchema = new mongoose.Schema({
  conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
  url: { type: String, required: true },
  // Other fields you may want to include:
  // type: { type: String, required: true }, // e.g., image, file, etc.
});


const Attachment = mongoose.model('Attachment', attachmentSchema);

export default Attachment;
