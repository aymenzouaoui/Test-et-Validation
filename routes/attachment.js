import express from 'express';
import Attachment from '../models/attachment.js';
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

// Create a new attachment and associate it with a conversation
router.post('/conversations/:conversationId/attachments', multerConfig.single('file'), async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'attachments' });

    // Create a new attachment
    const attachment = new Attachment({
      conversation: conversationId,
      url: result.secure_url
       // Store Cloudinary URL
    });
console.log(attachment.url);
    // Save the attachment
    await attachment.save();

    res.status(201).json({ url: attachment.url });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Delete an attachment
router.delete('/attachments/:id', async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);
    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Delete the attachment from the associated message
    const message = await Message.findById(attachment.message);
    if (message) {
      message.attachments.pull(req.params.id);
      await message.save();
    }

    // Delete the attachment itself
    await attachment.remove();

    res.json({ message: 'Attachment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Fetch all attachments for a specific conversation
router.get('/conversations/:conversationId/attachments', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Find all attachments associated with the conversation ID
    const attachments = await Attachment.find({ conversation: conversationId });

    res.json(attachments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
