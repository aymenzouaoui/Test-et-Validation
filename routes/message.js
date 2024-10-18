import express from 'express';
import Message from '../models/message.js';
import Conversation from '../models/conversation.js';
import { io } from '../server.js'; // Import the io object

const router = express.Router();

// Create a new message and add it to a specific conversation
router.post('/conversations/:conversationId/messages', async (req, res) => {
  try {
    const { sender, content } = req.body;
    const conversationId = req.params.conversationId;

    // Check if conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Create a new message
    const message = new Message({
      sender,
      content,
      conversation: conversationId,
      type,
    });

    // Save the message
    await message.save();

    // Add the message to the conversation
    conversation.messages.push(message);
    await conversation.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a message
router.put('/messages/:id', async (req, res) => {
  try {
    const { content } = req.body;
    const message = await Message.findByIdAndUpdate(req.params.id, { content }, { new: true });
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a message
router.delete('/messages/:id', async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/messages/:id/emoji', async (req, res) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.id;

    // Find the message by ID
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // If the emoji is already in the array, clear the array
    if (message.emojis.length === 1 && message.emojis[0] === emoji) {
      message.emojis = [];
    } else {
      // Set the array with the new emoji
      message.emojis = [emoji];
    }

    // Save the updated message
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// Update a message with an emoji
router.post('/message/:id/emoji', async (req, res) => {
  try {
    const { emoji } = req.body;
    const messageId = req.params.id;

    // Find the message by ID
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // If the emoji is already in the array, clear the array
    if (message.emojis.length === 1 && message.emojis[0] === emoji) {
      message.emojis = [];
    } else {
      // Set the array with the new emoji
      message.emojis = [emoji];
    }

    // Save the updated message
    await message.save();

    // Emit socket event with updated message ID
    io.emit('emoji_added', { messageId, emoji });

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
