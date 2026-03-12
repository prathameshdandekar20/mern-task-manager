import React from 'react';
import { Trash2, Check } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete }) => {
    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
            <div className="task-content" onClick={onToggle}>
                <div className="task-checkbox-container">
                    {task.completed && <Check size={14} color="white" />}
                </div>
                <span className="task-text">{task.title}</span>
            </div>
            <button
                className="delete-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                }}
                aria-label="Delete Task"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export default TaskItem;
