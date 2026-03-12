require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Health Check Route
app.get('/health', (req, res) => {
    res.json({ status: 'server is running', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log('MongoDB Connected successfully to Atlas');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        // Don't exit process in production, let it retry or fail gracefully
    }
};

connectDB();

// Handle connection errors after initial connection
mongoose.connection.on('error', err => {
    console.error('Mongoose secondary connection error:', err);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
