import express from 'express';
import VoiceMessage from '../models/voicemessage.js';
import Conversation from '../models/conversation.js';
import cloudinary from 'cloudinary';
import multer from 'multer';

const router = express.Router();

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'dzr8huphi',
  api_key: '759862363997317',
  api_secret: 'R5OOzmcXdD-pfCdp94w85oj75FY'
});
const multerConfig = multer({ dest: 'public/uploads/' });

// Create a new voice message attachment and associate it with a conversation
router.post('/conversations/:conversationId/voice-messages', multerConfig.single('voice'), async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Upload voice message to Cloudinary
    //const result = await cloudinary.uploader.upload(req.file.path, { folder: 'voice_messages' });

    // Create a new voice message attachment
    const voiceMessage = new VoiceMessage({
      conversation: conversationId,
      url: req.file.path // Save the file path instead of Cloudinary URL
    });

    // Save the voice message attachment
    await voiceMessage.save();

    res.status(201).json({ url: voiceMessage.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Fetch all voice message attachments for a specific conversation
router.get('/conversations/:conversationId/voice-messages', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Find all voice message attachments associated with the conversation ID
    const voiceMessages = await VoiceMessage.find({ conversation: conversationId });

    res.json(voiceMessages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a voice message attachment
router.delete('/voice-messages/:id', async (req, res) => {
  try {
    const voiceMessage = await VoiceMessage.findById(req.params.id);
    if (!voiceMessage) {
      return res.status(404).json({ message: 'Voice message not found' });
    }

    // Delete the voice message attachment itself
    await voiceMessage.remove();

    res.json({ message: 'Voice message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
