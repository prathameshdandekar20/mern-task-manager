import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TaskItem from '../components/TaskItem';

const Dashboard = () => {
    const [tasks, setTasks] = useState([]);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    // Configure axios to always send token
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const api = axios.create({
        baseURL: apiUrl,
        headers: { Authorization: `Bearer ${token}` }
    });

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchTasks();
    }, [token, navigate]);

    const fetchTasks = async () => {
        try {
            const res = await api.get('/tasks');
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            if (err.response?.status === 401) {
                handleLogout();
            }
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;

        try {
            const res = await api.post('/tasks', { title: newTaskTitle });
            setTasks([...tasks, res.data]);
            setNewTaskTitle('');
        } catch (err) {
            console.error('Failed to add task', err);
        }
    };

    const toggleTask = async (id) => {
        try {
            const res = await api.put(`/tasks/${id}`);
            setTasks(tasks.map(t => t._id === id ? res.data : t));
        } catch (err) {
            console.error('Failed to toggle task', err);
        }
    };

    const deleteTask = async (id) => {
        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="container">
            <header className="header">
                <h1>Student Task Manager</h1>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </header>

            <form className="add-task-form" onSubmit={handleAddTask}>
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="task-input"
                    placeholder="What do you need to study?"
                />
                <button type="submit" className="add-btn">Add Task</button>
            </form>

            <div className="tasks-list">
                {tasks.length === 0 ? (
                    <div className="empty-state">
                        <p>No tasks yet. Add a task to get started!</p>
                    </div>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task._id}
                            task={task}
                            onToggle={() => toggleTask(task._id)}
                            onDelete={() => deleteTask(task._id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Dashboard;
