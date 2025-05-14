import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

import connectDB from './config/connectDb.js';
// import Chat from './models/Chat.js';
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import myListRouter from './route/mylist.route.js';
import addressRouter from './route/address.route.js';
import homeSlidesRouter from './route/homeSlides.route.js';
import bannerV1Router from './route/bannerV1.route.js';
import bannerList2Router from './route/bannerList2.route.js';
import blogRouter from './route/blog.route.js';
import orderRouter from './route/order.route.js';
import logoRouter from './route/logo.route.js';
import chatbotrouter from "./route/chatbot.js";
import Chat from './models/chat.model.js';
import UserModel from './models/user.model.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use(cookieParser());
app.use(helmet({ crossOriginResourcePolicy: false }));

// API Routes
app.get("/", (req, res) => {
    res.json({ message: "Server is running on port " + process.env.PORT });
});
app.get('/api/userschat', async (req, res) => {
    try {
        // Step 1: Chat collection से unique user IDs लो
        const userIds = await Chat.distinct('user');

        // Step 2: UserModel से उन IDs के details fetch करो
        const users = await UserModel.find({ _id: { $in: userIds } }).select('-password'); 
        // .select('-password') → password field hide कर देगा, जरूरी हो तो हटा देना

        res.json({ success: true, users });
    } catch (err) {
        console.error('Error fetching users with chat:', err);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


app.use('/api/user', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/myList', myListRouter);
app.use('/api/address', addressRouter);
app.use('/api/homeSlides', homeSlidesRouter);
app.use('/api/bannerV1', bannerV1Router);
app.use('/api/bannerList2', bannerList2Router);
app.use('/api/blog', blogRouter);
app.use('/api/order', orderRouter);
app.use('/api/logo', logoRouter);
app.use('/api/chatbot', chatbotrouter);

// Socket.io events
io.on('connection', (socket) => {
    console.log('A user connected: ' + socket.id);

    // Join a private room
    socket.on('join_room', async (room) => {
        socket.join(room);
        console.log(`User ${socket.id} joined room ${room}`);

        // Send chat history for the room
        const chatHistory = await Chat.find({ room }).sort({ timestamp: 1 }).limit(50);
        socket.emit('chat_history', chatHistory);
    });

    // Listen for incoming chat messages
    socket.on('send_message', async (data) => {
        console.log(data)
        const { room, user, message } = data;

        // Save message to MongoDB
        const newMessage = new Chat({ room, user, message });
        await newMessage.save();

        // Send message to everyone in the room
        io.to(room).emit('receive_message', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});

// Connect to DB and start server
connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log("Server is running on port", process.env.PORT);
    });
});
