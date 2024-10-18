import express from 'express';
import Conversation from '../models/conversation.js';
import Application from '../models/application.js';
const router = express.Router();
/*
const verifySecretKey = async (req, res, next) => {
  try {
    // Extract the application ID from the request parameters
    const applicationId = req.params.applicationId;
    
    // Extract the secret key from the request headers
    const secretKey = req.headers['x-secret-key'];
    
    // Find the application by ID
    const application = await Application.findById(applicationId);
    
    // Check if application exists
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if the secret key matches
    if (secretKey !== application.secretKey) {
      return res.status(403).json({ message: 'Forbidden: Invalid secret key' });
    }

    // If everything is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

*/
const verifySecretKey = async (req, res, next) => {
  try {
    console.log(req.headers)
    // Extract the secret key from the request headers
    const secretKey = req.headers['x-secret-key'];
    console.log(secretKey)
    // Find all applications
    const applications = await Application.find();
    
    // Check if any application's secret key matches the provided secret key
    const validSecretKey = applications.some(application => application.secretKey === secretKey);
    //const validSecretKey = true;

    if (!validSecretKey) {
      return res.status(403).json({ message: 'Forbidden: Invalid secret key' });
    }

    // If everything is valid, proceed to the next middleware or route handler
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new conversation
router.post('/conversations',verifySecretKey, async (req, res) => {
  try {
    const { participants } = req.body;
    const conversation = new Conversation({ participants });
    await conversation.save();
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all conversations
router.get('/conversations',verifySecretKey, async (req, res) => {
  try {
    const conversations = await Conversation.find().populate({
      path: 'messages',
      populate: { path: 'sender', select: 'name' } // Populate sender field with name only
    });
    

    // Modify conversations to replace sender ID with sender's name and keep only the last message
    conversations.forEach(conversation => {
      if (conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        lastMessage.sender = lastMessage.sender ? lastMessage.sender.name : 'Unknown'; // Replace sender ID with name if sender exists
        conversation.messages = [lastMessage]; // Keep only the last message
      } else {
        conversation.messages = []; // No messages in the conversation
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get all conversations for specific user
router.get('/conversation/:userId',verifySecretKey, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find conversations where the given user ID is in the participants list
    const conversations = await Conversation.find({ participants: userId }).populate({
      path: 'participants', // Populate participants field with user details
      select: 'name' // Select only the 'name' field of each participant
    }).populate({
      path: 'messages',
      populate: { path: 'sender', select: 'name' } // Populate sender field with name only
    });

    // Modify conversations to replace sender ID with sender's name and keep only the last message
    conversations.forEach(conversation => {
      if (conversation.messages.length > 0) {
        const lastMessage = conversation.messages[conversation.messages.length - 1];
        lastMessage.sender = lastMessage.sender ? lastMessage.sender.name : 'Unknown'; // Replace sender ID with name if sender exists
        conversation.messages = [lastMessage]; // Keep only the last message
      } else {
        conversation.messages = []; // No messages in the conversation
      }
    });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});





// Get a single conversation
router.get('/conversations/:id',verifySecretKey, async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Get messages in a specific conversation
router.get('/conversations/:conversationId/messages',verifySecretKey, async (req, res) => {
  try {
    const conversationId = req.params.conversationId;

    // Find conversation with given ID
    const conversation = await Conversation.findById(conversationId).populate('messages');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Send the conversation along with its messages
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a conversation
router.put('/conversations/:id',verifySecretKey, async (req, res) => {
  try {
    const { participants } = req.body;
    const conversation = await Conversation.findByIdAndUpdate(req.params.id, { participants }, { new: true });
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a conversation
router.delete('/conversations/:id', verifySecretKey,async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndDelete(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    res.json({ message: 'Conversation deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Add emoji to a specific message in a conversation
router.post('/conversations/:conversationId/messages/:messageId/emoji',verifySecretKey, async (req, res) => {
  try {
    const { emoji } = req.body;
    const conversationId = req.params.conversationId;
    const messageId = req.params.messageId;

    // Find the conversation by ID
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Find the message within the conversation
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Add the emoji to the message's emojis array
    message.emojis.push(emoji);
    
    // Save the updated message
    await message.save();

    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get('/conversation/:userId1/:userId2',verifySecretKey, async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;

    // Check if conversation already exists between the two users
    let conversation = await Conversation.findOne({ 
      participants: { $all: [userId1, userId2] } 
    });

    // If conversation doesn't exist, create a new one
    if (!conversation) {
      conversation = new Conversation({ participants: [userId1, userId2] });
      await conversation.save();
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
