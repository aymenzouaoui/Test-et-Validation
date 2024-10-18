// Import necessary modules and middleware
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import cors from "cors";
import { notFoundError, errorHandler } from "./middlewares/error-handler.js";
import authRoutes from './routes/authRoutes.js';
import sectionRoutes from './routes/section.js';
import conversationRoutes from './routes/conversation.js';
import messageRoutes from './routes/message.js';
import voicemessageRoutes from './routes/voicemessage.js';
import groupRoutes from './routes/group.js';
import attachmentRoutes from './routes/attachment.js';
import categoryRoutes from './routes/category.js';
import userRoutes from './routes/users.js';
import secretKeyRoutes from "./routes/secretKey.js";
import applicationRoutes from "./routes/application.js";
import http from 'http';
import { Server } from 'socket.io';
import Message from './models/message.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';


const swaggerDocument = YAML.load('./swagger.yaml');
import Conversation from './models/conversation.js'; // Import the Conversation model

// Create express app and server
const app = express();
const server = http.createServer(app);

// Use socket.io for server
export const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Define PORT and database name
const PORT = 9090 || process.env.PORT;

// Specifying the MongoDB database name
const databaseName = 'CrossChat';

// Connect to MongoDB
mongoose.set('debug', true);
mongoose.Promise = global.Promise;

// Connecting to the MongoDB database
try {
  await mongoose.connect(`mongodb+srv://CrossChat:CrossChat123@crosschat.ekjeexv.mongodb.net/${databaseName}`);
 // await mongoose.connect(`mongodb://localhost:27017/${databaseName}`);
  
  console.log(`Connected to ${databaseName}`);
} catch (error) {
  console.error(error);
}

app.use(cors()); // Enable CORS middleware


// Middleware setup
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img', express.static('public/images'));

// Serve the Swagger UI with your OpenAPI specification
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes setup
app.use('/api/auth', authRoutes);
app.use('/category', categoryRoutes);
app.use('/section', sectionRoutes);
app.use('/user', userRoutes);
app.use('/applications', applicationRoutes);
app.use('/token', secretKeyRoutes);

// Using custom middleware for handling 404 errors
app.use('/', attachmentRoutes);
app.use('/', groupRoutes);
app.use('/', conversationRoutes);
app.use('/', messageRoutes);
app.use('/', voicemessageRoutes);
app.use(notFoundError);
app.use(errorHandler);

// Socket.io connection setup
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Dynamic event handling based on conversation ID
  socket.on('join_conversation', (conversationId) => {
    console.log(`Joined conversation ${conversationId}`);

    // Define event name based on conversation ID
    const eventName = `new_message_${conversationId}`;

    // Listen for new messages specific to this conversation
    socket.on(eventName, async (messageData) => {
      console.log(`New message in conversation ${conversationId}:`, messageData);
      try {

        // Save the message to the database


        // Now, when saving the message, format the timestamp to include only hour and minute
        const currentTime = new Date();
        const formattedTime = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;

        const message = new Message({
          sender: messageData.sender,
          content: messageData.content,
          conversation: messageData.conversation,
          timestamp: formattedTime, // Use formatted timestamp
          seenBy: [messageData.sender], // Add sender to seenBy array,,
          type: messageData.type

        });
        await message.save();

        // Update conversation with new message
        await Conversation.updateOne(
          { _id: messageData.conversation },
          { $push: { messages: message._id } }
        );

        // Emit the message to other sockets with formatted timestamp
        io.emit(eventName, {
          ...messageData,
          conversation: messageData.conversation,
          timestamp: formattedTime, // Use formatted timestamp
        });
      } catch (error) {
        console.error(`Error saving message in conversation ${conversationId}:`, error);
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
