import mongoose from 'mongoose';

const translationConfigSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  conversationId: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
});

const TranslationConfig = mongoose.model('TranslationConfig', translationConfigSchema);

export default TranslationConfig;