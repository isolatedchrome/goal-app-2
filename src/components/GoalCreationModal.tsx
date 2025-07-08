import React, { useState } from 'react';
import { X, Target, Plus, Trash2, Globe, Lock } from 'lucide-react';
import { Goal, Priority } from '../types';

interface GoalCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGoal: (goal: Goal) => void;
}

const GoalCreationModal: React.FC<GoalCreationModalProps> = ({ isOpen, onClose, onCreateGoal }) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [tasks, setTasks] = useState<string[]>(['']);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: title.trim(),
      priority,
      category: category.trim() || undefined,
      isPublic,
      expanded: true,
      tasks: tasks
        .filter(task => task.trim())
        .map((task, index) => ({
          id: `${Date.now()}-${index}`,
          text: task.trim(),
          completed: false,
          subtasks: [],
          expanded: false,
          order: index
        }))
    };

    onCreateGoal(newGoal);
    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setPriority('medium');
    setCategory('');
    setIsPublic(false);
    setTasks(['']);
    onClose();
  };

  const addTask = () => {
    setTasks([...tasks, '']);
  };

  const updateTask = (index: number, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = value;
    setTasks(newTasks);
  };

  const removeTask = (index: number) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter((_, i) => i !== index));
    }
  };

  const priorityColors = {
    high: 'var(--color-rose)',
    medium: 'var(--color-amber)',
    low: 'var(--color-dusty-blue-light)'
  };

  const categories = [
    'Health & Fitness', 'Career', 'Education', 'Personal Growth', 
    'Relationships', 'Finance', 'Hobbies', 'Travel', 'Technology', 'Business'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-8" style={{ borderBottom: '2px solid var(--color-parchment)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center whimsical-shadow" 
                 style={{ background: 'var(--theme-gradient-primary)' }}>
              <Target className="w-7 h-7" style={{ color: 'var(--color-warm-white)' }} />
            </div>
            <div>
              <h2 className="text-display text-3xl" style={{ color: 'var(--color-ink)' }}>
                Create New Goal
              </h2>
              <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                Break down your aspirations into actionable steps
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--color-warm-gray)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-terracotta)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-warm-gray)'}
          >
            <X size={32} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Goal Title */}
            <div>
              <label className="block text-accent text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
                What's your goal?
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field text-lg"
                placeholder="e.g., Learn React Development"
                required
              />
            </div>

            {/* Priority and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-accent text-lg mb-4" style={{ color: 'var(--color-ink)' }}>
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`p-4 rounded-lg border-2 text-center transition-all duration-300 ${
                        priority === p ? 'whimsical-shadow' : ''
                      }`}
                      style={{
                        backgroundColor: priority === p ? priorityColors[p] : 'var(--color-parchment)',
                        borderColor: priority === p ? 'var(--color-charcoal)' : 'var(--color-warm-gray-light)',
                        color: 'var(--color-charcoal)',
                        transform: priority === p ? 'rotate(-0.2deg) scale(1.02)' : 'rotate(0deg) scale(1)'
                      }}
                    >
                      <span className="text-accent font-medium capitalize">{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-accent text-lg mb-4" style={{ color: 'var(--color-ink)' }}>
                  Category (Optional)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Privacy Setting */}
            <div>
              <label className="block text-accent text-lg mb-4" style={{ color: 'var(--color-ink)' }}>
                Privacy & Sharing
              </label>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsPublic(false)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                    !isPublic ? 'whimsical-shadow' : ''
                  }`}
                  style={{
                    backgroundColor: !isPublic ? 'var(--color-sage-light)' : 'var(--color-parchment)',
                    borderColor: !isPublic ? 'var(--color-sage)' : 'var(--color-warm-gray-light)',
                    color: 'var(--color-charcoal)',
                    transform: !isPublic ? 'rotate(-0.1deg)' : 'rotate(0deg)'
                  }}
                >
                  <Lock size={20} />
                  <span className="text-accent">Private</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPublic(true)}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 ${
                    isPublic ? 'whimsical-shadow' : ''
                  }`}
                  style={{
                    backgroundColor: isPublic ? 'var(--color-sage-light)' : 'var(--color-parchment)',
                    borderColor: isPublic ? 'var(--color-sage)' : 'var(--color-warm-gray-light)',
                    color: 'var(--color-charcoal)',
                    transform: isPublic ? 'rotate(0.1deg)' : 'rotate(0deg)'
                  }}
                >
                  <Globe size={20} />
                  <span className="text-accent">Public</span>
                </button>
              </div>
              <p className="text-body text-sm mt-2" style={{ color: 'var(--color-warm-gray)' }}>
                {isPublic 
                  ? 'Others can see this goal and connect with you if they have similar aspirations'
                  : 'Only you can see this goal'
                }
              </p>
            </div>

            {/* Tasks */}
            <div>
              <label className="block text-accent text-lg mb-4" style={{ color: 'var(--color-ink)' }}>
                Break it down into tasks
              </label>
              <div className="space-y-4">
                {tasks.map((task, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => updateTask(index, e.target.value)}
                      className="input-field flex-1"
                      placeholder={`Task ${index + 1}`}
                    />
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="p-3 rounded-lg transition-all duration-300 hover:scale-110"
                        style={{ color: 'var(--color-terracotta)' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTask}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  <span className="text-accent">Add Another Task</span>
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="btn-secondary"
              >
                <span className="text-accent">Cancel</span>
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                <span className="text-accent">Create Goal</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GoalCreationModal;
