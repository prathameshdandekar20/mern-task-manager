const express = require('express');
const Task = require('../models/Task');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tasks for user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create task
router.post('/', auth, async (req, res) => {
    const { title } = req.body;
    if (!title) {
        return res.status(400).json({ message: 'Please provide a title' });
    }
    try {
        const newTask = new Task({
            title,
            userId: req.user.id
        });
        const task = await newTask.save();
        res.status(201).json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle task completion
router.put('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Ensure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        task.completed = !task.completed;
        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });

        // Ensure user owns task
        if (task.userId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await task.deleteOne();
        res.json({ message: 'Task removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
