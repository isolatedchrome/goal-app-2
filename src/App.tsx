import React, { useState, useEffect } from 'react';
import { Target, Plus, List, Settings, Users, LogOut, UserCheck } from 'lucide-react';
import { Goal, ThemeName, User } from './types';
import { themes, applyTheme, getStoredTheme, setStoredTheme } from './utils/themes';
import { authService } from './utils/auth';
import GoalCard from './components/GoalCard';
import GoalCreationModal from './components/GoalCreationModal';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import SocialModal from './components/SocialModal';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(getStoredTheme());

  // Check for existing user or guest mode on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    const guestMode = localStorage.getItem('goals-app-guest-mode') === 'true';
    const guestGoals = localStorage.getItem('goals-app-guest-goals');
    
    if (user) {
      setCurrentUser(user);
      setGoals(user.goals);
      setIsGuest(false);
    } else if (guestMode && guestGoals) {
      setIsGuest(true);
      setGoals(JSON.parse(guestGoals));
    }
  }, []);

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyTheme(themes[currentTheme]);
  }, [currentTheme]);

  const handleThemeChange = (newTheme: ThemeName) => {
    setCurrentTheme(newTheme);
    setStoredTheme(newTheme);
    applyTheme(themes[newTheme]);
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    const user = await authService.login(email, password);
    if (user) {
      setCurrentUser(user);
      setGoals(user.goals);
      setIsGuest(false);
      // Clear guest data
      localStorage.removeItem('goals-app-guest-mode');
      localStorage.removeItem('goals-app-guest-goals');
      return true;
    }
    return false;
  };

  const handleRegister = async (userData: {
    name: string;
    email: string;
    password: string;
    location?: { city: string; country: string };
    interests: string[];
  }): Promise<boolean> => {
    try {
      const user = await authService.register(userData);
      setCurrentUser(user);
      setGoals(user.goals);
      setIsGuest(false);
      // Clear guest data
      localStorage.removeItem('goals-app-guest-mode');
      localStorage.removeItem('goals-app-guest-goals');
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleGuestMode = () => {
    setIsGuest(true);
    localStorage.setItem('goals-app-guest-mode', 'true');
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsGuest(false);
    setGoals([]);
    localStorage.removeItem('goals-app-guest-mode');
    localStorage.removeItem('goals-app-guest-goals');
  };

  const addGoal = async (newGoal: Goal) => {
    const updatedGoals = [...goals, newGoal];
    setGoals(updatedGoals);
    
    if (currentUser) {
      await authService.updateUser({ goals: updatedGoals });
    } else if (isGuest) {
      localStorage.setItem('goals-app-guest-goals', JSON.stringify(updatedGoals));
    }
  };

  const updateGoal = async (updatedGoal: Goal) => {
    const updatedGoals = goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal);
    setGoals(updatedGoals);
    
    if (currentUser) {
      await authService.updateUser({ goals: updatedGoals });
    } else if (isGuest) {
      localStorage.setItem('goals-app-guest-goals', JSON.stringify(updatedGoals));
    }
  };

  const deleteGoal = async (goalId: string) => {
    const updatedGoals = goals.filter(goal => goal.id !== goalId);
    setGoals(updatedGoals);
    
    if (currentUser) {
      await authService.updateUser({ goals: updatedGoals });
    } else if (isGuest) {
      localStorage.setItem('goals-app-guest-goals', JSON.stringify(updatedGoals));
    }
  };

  // Show welcome screen if no user is logged in and not in guest mode
  if (!currentUser && !isGuest) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-cream)' }}>
        <div className="text-center max-w-2xl mx-auto px-6">
          <div className="w-20 h-20 border border-solid flex items-center justify-center minimal-shadow mx-auto mb-12" 
               style={{ 
                 backgroundColor: 'var(--color-sage)',
                 borderColor: 'var(--color-sage-dark)'
               }}>
            <Target className="w-10 h-10" style={{ color: 'var(--color-warm-white)' }} />
          </div>
          
          <h1 className="text-display text-6xl mb-8" style={{ color: 'var(--color-ink)' }}>
            Goals
          </h1>
          <p className="text-body text-xl mb-6" style={{ color: 'var(--color-charcoal)' }}>
            Break it down, check it off, connect with others
          </p>
          <p className="text-body text-lg mb-16" style={{ color: 'var(--color-warm-gray)' }}>
            Track your progress, find accountability partners, and discover others with similar aspirations. 
            Start immediately as a guest or create an account to unlock social features.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setShowAuthModal(true)}
              className="btn-primary text-lg px-16 py-4"
            >
              <span className="text-accent">Create Account</span>
            </button>
            
            <button
              onClick={handleGuestMode}
              className="btn-secondary text-lg px-16 py-4 flex items-center justify-center gap-3"
            >
              <UserCheck size={20} />
              <span className="text-accent">Continue as Guest</span>
            </button>
          </div>
          
          <p className="text-body text-sm mt-8" style={{ color: 'var(--color-warm-gray)' }}>
            Guest mode: Full goal tracking • No social features • Data saved locally
          </p>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
          onGuestMode={handleGuestMode}
        />
      </div>
    );
  }

  const displayName = currentUser ? currentUser.name.split(' ')[0] : 'Guest';
  const canUseSocial = currentUser && !isGuest;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-cream)' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 border border-solid flex items-center justify-center minimal-shadow" 
                 style={{ 
                   backgroundColor: 'var(--color-sage)',
                   borderColor: 'var(--color-sage-dark)'
                 }}>
              <Target className="w-7 h-7" style={{ color: 'var(--color-warm-white)' }} />
            </div>
            <div>
              <h1 className="text-display" style={{ color: 'var(--color-ink)', fontSize: '2.5rem' }}>
                Welcome back, {displayName}
              </h1>
              <p className="text-accent text-lg flex items-center gap-2" style={{ color: 'var(--color-warm-gray)', fontStyle: 'italic' }}>
                {isGuest && <UserCheck size={18} />}
                {isGuest ? 'Guest Mode • ' : ''}Break it down, check it off
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {canUseSocial && (
              <button 
                onClick={() => setShowSocialModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Users size={18} />
                <span className="text-accent">Social</span>
              </button>
            )}
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="btn-secondary flex items-center gap-2"
            >
              <Settings size={18} />
              <span className="text-accent">Settings</span>
            </button>
            <button className="btn-secondary flex items-center gap-2">
              <List size={18} />
              <span className="text-accent">Overview</span>
            </button>
            {isGuest ? (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="btn-primary flex items-center gap-2"
              >
                <UserCheck size={18} />
                <span className="text-accent">Sign Up</span>
              </button>
            ) : (
              <button 
                onClick={handleLogout}
                className="btn-secondary flex items-center gap-2"
              >
                <LogOut size={18} />
                <span className="text-accent">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Guest Mode Notice */}
        {isGuest && (
          <div className="mb-8 p-6 card border-2" 
               style={{ 
                 backgroundColor: 'var(--color-parchment)',
                 borderColor: 'var(--color-sage)'
               }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 border border-solid flex items-center justify-center" 
                   style={{ 
                     backgroundColor: 'var(--color-sage)',
                     borderColor: 'var(--color-sage-dark)'
                   }}>
                <UserCheck className="w-5 h-5" style={{ color: 'var(--color-warm-white)' }} />
              </div>
              <div className="flex-1">
                <h3 className="text-accent text-lg font-semibold mb-1" style={{ color: 'var(--color-ink)' }}>
                  You're using Guest Mode
                </h3>
                <p className="text-body text-sm" style={{ color: 'var(--color-warm-gray)' }}>
                  Your goals are saved locally. Create an account to unlock social features, cloud sync, and connect with others.
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(true)}
                className="btn-primary px-6 py-3"
              >
                <span className="text-accent">Upgrade Account</span>
              </button>
            </div>
          </div>
        )}

        {/* Add New Goal */}
        <div className="mb-8">
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-full card p-8 border-2 border-dashed transition-all duration-300 flex items-center justify-center gap-3 group"
            style={{ 
              borderColor: 'var(--color-warm-gray-light)',
              color: 'var(--color-warm-gray)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-sage)';
              e.currentTarget.style.color = 'var(--color-charcoal)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-warm-gray-light)';
              e.currentTarget.style.color = 'var(--color-warm-gray)';
            }}
          >
            <Plus size={20} />
            <span className="text-accent text-lg">Add new goal</span>
          </button>
        </div>

        {/* Goals List */}
        <div className="space-y-6">
          {goals.map((goal, index) => (
            <div key={goal.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <GoalCard
                goal={goal}
                onUpdateGoal={updateGoal}
                onDeleteGoal={deleteGoal}
              />
            </div>
          ))}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-16">
            <Target className="w-16 h-16 mx-auto mb-8" 
                   style={{ color: 'var(--color-warm-gray)' }} />
            <h3 className="text-display text-2xl mb-4" style={{ color: 'var(--color-ink)' }}>
              No goals yet
            </h3>
            <p className="text-body text-lg mb-8" style={{ color: 'var(--color-warm-gray)' }}>
              Start by creating your first goal to track your progress{canUseSocial ? ' and connect with others' : ''}.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary text-lg px-8 py-4"
            >
              <span className="text-accent">Create Your First Goal</span>
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <GoalCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateGoal={addGoal}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentTheme={currentTheme}
        onThemeChange={handleThemeChange}
      />

      {canUseSocial && (
        <SocialModal
          isOpen={showSocialModal}
          onClose={() => setShowSocialModal(false)}
          currentUser={currentUser}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuestMode={handleGuestMode}
        showGuestOption={!isGuest}
      />
    </div>
  );
}

export default App;
