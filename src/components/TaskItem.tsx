import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, ArrowUp, ArrowDown } from 'lucide-react';
import { Task, Subtask } from '../types';

interface TaskItemProps {
  task: Task;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTask: (taskId: string, direction: 'up' | 'down') => void;
  isFirst: boolean;
  isLast: boolean;
  showReorder?: boolean;
  isNextTask?: boolean;
}

const TaskItem: React.FC<TaskItemProps> = ({ 
  task, 
  onUpdateTask, 
  onDeleteTask, 
  onMoveTask, 
  isFirst, 
  isLast,
  showReorder = true,
  isNextTask = false
}) => {
  const [newSubtaskText, setNewSubtaskText] = useState('');

  const toggleTaskCompleted = () => {
    onUpdateTask({ ...task, completed: !task.completed });
  };

  const toggleTaskExpanded = () => {
    onUpdateTask({ ...task, expanded: !task.expanded });
  };

  const addSubtask = () => {
    if (newSubtaskText.trim()) {
      const newSubtask: Subtask = {
        id: Date.now().toString(),
        text: newSubtaskText.trim(),
        completed: false
      };
      onUpdateTask({
        ...task,
        subtasks: [...task.subtasks, newSubtask]
      });
      setNewSubtaskText('');
    }
  };

  const updateSubtask = (subtaskId: string, completed: boolean) => {
    const updatedSubtasks = task.subtasks.map(subtask =>
      subtask.id === subtaskId ? { ...subtask, completed } : subtask
    );
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(subtask => subtask.id !== subtaskId);
    onUpdateTask({ ...task, subtasks: updatedSubtasks });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addSubtask();
    }
  };

  const borderColor = isNextTask ? 'var(--color-warm-white)' : 'var(--color-parchment)';
  const textColor = isNextTask ? 'var(--color-warm-white)' : 'var(--color-ink)';

  return (
    <div className="pl-6 ml-4" style={{ borderLeft: `3px solid ${borderColor}` }}>
      <div className="flex items-center gap-4 py-3 group">
        {showReorder && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMoveTask(task.id, 'up')}
              disabled={isFirst}
              className={`text-xs transition-all duration-200 ${isFirst ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
              style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)' }}
            >
              <ArrowUp size={14} />
            </button>
            <button
              onClick={() => onMoveTask(task.id, 'down')}
              disabled={isLast}
              className={`text-xs transition-all duration-200 ${isLast ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'}`}
              style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)' }}
            >
              <ArrowDown size={14} />
            </button>
          </div>
        )}
        
        {task.subtasks.length > 0 && (
          <button
            onClick={toggleTaskExpanded}
            className="transition-all duration-200 hover:scale-110"
            style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)' }}
          >
            {task.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </button>
        )}
        
        <button
          onClick={toggleTaskCompleted}
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{
            backgroundColor: task.completed 
              ? (isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)') 
              : 'transparent',
            borderColor: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)'
          }}
        >
          {task.completed && (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"
                 style={{ color: isNextTask ? 'var(--color-dusty-blue)' : 'var(--color-warm-white)' }}>
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1">
          <span className={`text-body text-lg ${task.completed ? 'task-completed' : ''}`}
                style={{ color: textColor }}>
            {task.text}
          </span>
        </div>
        
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={() => onUpdateTask({ ...task, expanded: true })}
            className="transition-all duration-200 hover:scale-110"
            style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)' }}
          >
            <Plus size={18} />
          </button>
          <button
            onClick={() => onDeleteTask(task.id)}
            className="transition-all duration-200 hover:scale-110"
            style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-warm-gray)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-terracotta)'}
            onMouseLeave={(e) => e.currentTarget.style.color = isNextTask ? 'var(--color-warm-white)' : 'var(--color-warm-gray)'}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.expanded && task.subtasks.length > 0 && (
        <div className="ml-8 space-y-2">
          {task.subtasks.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-4 py-2 group">
              <button
                onClick={() => updateSubtask(subtask.id, !subtask.completed)}
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{
                  backgroundColor: subtask.completed 
                    ? (isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)') 
                    : 'transparent',
                  borderColor: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)'
                }}
              >
                {subtask.completed && (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"
                       style={{ color: isNextTask ? 'var(--color-dusty-blue)' : 'var(--color-warm-white)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
              
              <span className={`flex-1 text-body ${subtask.completed ? 'task-completed' : ''}`}
                    style={{ color: textColor }}>
                {subtask.text}
              </span>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => deleteSubtask(subtask.id)}
                  className="transition-all duration-200 hover:scale-110"
                  style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-warm-gray)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-terracotta)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = isNextTask ? 'var(--color-warm-white)' : 'var(--color-warm-gray)'}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {task.expanded && (
        <div className="ml-8 mt-3">
          <div className="flex items-center gap-3">
            <Plus size={16} style={{ color: isNextTask ? 'var(--color-warm-white)' : 'var(--color-sage)' }} />
            <input
              type="text"
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add subtask"
              className="flex-1 text-body bg-transparent border-none outline-none"
              style={{ color: textColor }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
