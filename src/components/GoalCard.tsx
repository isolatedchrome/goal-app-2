import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Trash2, Plus, Flag } from 'lucide-react';
import { Goal, Task, Priority } from '../types';
import TaskItem from './TaskItem';

interface GoalCardProps {
  goal: Goal;
  onUpdateGoal: (goal: Goal) => void;
  onDeleteGoal: (goalId: string) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdateGoal, onDeleteGoal }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [showAllTasks, setShowAllTasks] = useState(false);

  const sortedTasks = [...goal.tasks].sort((a, b) => a.order - b.order);
  const completedTasks = sortedTasks.filter(task => task.completed).length;
  const totalTasks = sortedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const nextTask = sortedTasks.find(task => !task.completed);
  const tasksToShow = showAllTasks ? sortedTasks : (nextTask ? [nextTask] : []);

  const toggleGoalExpanded = () => {
    onUpdateGoal({ ...goal, expanded: !goal.expanded });
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        subtasks: [],
        expanded: false,
        order: goal.tasks.length
      };
      onUpdateGoal({
        ...goal,
        tasks: [...goal.tasks, newTask]
      });
      setNewTaskText('');
    }
  };

  const updateTask = (updatedTask: Task) => {
    const updatedTasks = goal.tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    );
    onUpdateGoal({ ...goal, tasks: updatedTasks });
  };

  const deleteTask = (taskId: string) => {
    const filteredTasks = goal.tasks.filter(task => task.id !== taskId);
    const reorderedTasks = filteredTasks.map((task, index) => ({
      ...task,
      order: index
    }));
    onUpdateGoal({ ...goal, tasks: reorderedTasks });
  };

  const moveTask = (taskId: string, direction: 'up' | 'down') => {
    const sortedTasks = [...goal.tasks].sort((a, b) => a.order - b.order);
    const taskIndex = sortedTasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) return;

    const newTasks = [...sortedTasks];
    const targetIndex = direction === 'up' ? taskIndex - 1 : taskIndex + 1;

    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      [newTasks[taskIndex], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[taskIndex]];
      
      newTasks.forEach((task, index) => {
        task.order = index;
      });
      
      onUpdateGoal({ ...goal, tasks: newTasks });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  return (
    <div className="card p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={toggleGoalExpanded}
            className="transition-all duration-200 hover:scale-110"
            style={{ color: 'var(--color-sage)' }}
          >
            {goal.expanded ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
          </button>
          <div className="flex-1">
            <h2 className="text-display text-3xl mb-2" style={{ color: 'var(--color-ink)' }}>
              {goal.title}
            </h2>
            {goal.priority && (
              <div className="mt-2">
                <span className={`inline-flex items-center px-4 py-2 text-sm rounded-full border-2 capitalize text-accent ${getPriorityStyles(goal.priority)}`}>
                  <Flag size={14} className="mr-2" />
                  {goal.priority} priority
                </span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={() => onDeleteGoal(goal.id)}
          className="transition-all duration-200 hover:scale-110"
          style={{ color: 'var(--color-warm-gray)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-terracotta)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-warm-gray)'}
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
          {completedTasks} of {totalTasks} tasks completed
        </span>
        <span className="text-accent text-xl font-semibold" style={{ color: 'var(--color-ink)' }}>
          {progressPercentage}%
        </span>
      </div>

      <div className="w-full rounded-full h-3 mb-8" style={{ backgroundColor: 'var(--color-parchment)' }}>
        <div
          className="progress-bar h-3 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {goal.expanded && (
        <div className="space-y-4">
          {nextTask && !showAllTasks && (
            <div className="mb-6 p-6 rounded-2xl border-2 next-task-highlight">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-warm-white)' }}></div>
                <span className="text-accent text-lg font-semibold" style={{ color: 'var(--color-warm-white)' }}>
                  Next Task
                </span>
              </div>
              <TaskItem
                task={nextTask}
                onUpdateTask={updateTask}
                onDeleteTask={deleteTask}
                onMoveTask={moveTask}
                isFirst={sortedTasks.indexOf(nextTask) === 0}
                isLast={sortedTasks.indexOf(nextTask) === sortedTasks.length - 1}
                showReorder={false}
                isNextTask={true}
              />
            </div>
          )}

          {totalTasks > 1 && (
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setShowAllTasks(!showAllTasks)}
                className="btn-secondary text-accent"
              >
                {showAllTasks ? 'Show Next Task Only' : `Show All Tasks (${totalTasks})`}
              </button>
            </div>
          )}

          {showAllTasks && (
            <div className="space-y-3">
              {tasksToShow.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdateTask={updateTask}
                  onDeleteTask={deleteTask}
                  onMoveTask={moveTask}
                  isFirst={index === 0}
                  isLast={index === tasksToShow.length - 1}
                  showReorder={true}
                  isNextTask={false}
                />
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-3 mt-6 pt-6" style={{ borderTop: '2px solid var(--color-parchment)' }}>
            <Plus size={20} style={{ color: 'var(--color-sage)' }} />
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Add task"
              className="flex-1 text-body text-lg bg-transparent border-none outline-none"
              style={{ color: 'var(--color-ink)' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;
