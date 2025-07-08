import React, { useState } from 'react';
import { X, User, Mail, Lock, MapPin, Heart, UserCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (userData: {
    name: string;
    email: string;
    password: string;
    location?: { city: string; country: string };
    interests: string[];
  }) => Promise<boolean>;
  onGuestMode: () => void;
  showGuestOption?: boolean;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  onLogin, 
  onRegister, 
  onGuestMode,
  showGuestOption = true
}) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: '',
    country: '',
    interests: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const commonInterests = [
    'React Development', 'Photography', 'Yoga', 'Reading', 'Fitness', 'Cooking',
    'Travel', 'Design', 'Meditation', 'Art', 'Music', 'Writing', 'Business',
    'Learning Languages', 'Gardening', 'Running', 'Dancing', 'Painting'
  ];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLoginMode) {
        const success = await onLogin(formData.email, formData.password);
        if (success) {
          onClose();
          resetForm();
        } else {
          setError('Invalid email or password');
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.interests.length === 0) {
          setError('Please select at least one interest');
          setLoading(false);
          return;
        }

        const success = await onRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          location: formData.city && formData.country ? {
            city: formData.city,
            country: formData.country
          } : undefined,
          interests: formData.interests
        });
        
        if (success) {
          onClose();
          resetForm();
        } else {
          setError('Registration failed');
        }
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      city: '',
      country: '',
      interests: []
    });
    setError('');
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const switchMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden" 
           style={{ 
             backgroundColor: 'var(--color-warm-white)',
             borderColor: 'var(--color-parchment)',
             borderWidth: '2px'
           }}>
        <div className="flex items-center justify-between p-8" 
             style={{ borderBottom: '2px solid var(--color-parchment)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center whimsical-shadow" 
                 style={{ background: 'var(--theme-gradient-primary)' }}>
              <User className="w-7 h-7" style={{ color: 'var(--color-warm-white)' }} />
            </div>
            <div>
              <h2 className="text-display text-3xl" style={{ color: 'var(--color-ink)' }}>
                {isLoginMode ? 'Welcome Back' : 'Join Our Community'}
              </h2>
              <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                {isLoginMode ? 'Sign in to continue your journey' : 'Connect with goal-oriented people nearby'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-all duration-300 hover:scale-110"
            style={{ color: 'var(--color-warm-gray)' }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-terracotta)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-warm-gray)'}
          >
            <X size={32} />
          </button>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 rounded-lg border-2" 
                   style={{ 
                     backgroundColor: 'var(--color-rose)', 
                     borderColor: 'var(--color-terracotta)',
                     color: 'var(--color-charcoal)'
                   }}>
                {error}
              </div>
            )}

            {!isLoginMode && (
              <div>
                <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                  <User size={20} className="inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  placeholder="Enter your full name"
                  required={!isLoginMode}
                  style={{
                    backgroundColor: 'var(--color-cream)',
                    borderColor: 'var(--color-parchment)',
                    color: 'var(--color-ink)'
                  }}
                />
              </div>
            )}

            <div>
              <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                <Mail size={20} className="inline mr-2" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="input-field"
                placeholder="Enter your email"
                required
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderColor: 'var(--color-parchment)',
                  color: 'var(--color-ink)'
                }}
              />
            </div>

            <div>
              <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                <Lock size={20} className="inline mr-2" />
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="input-field"
                placeholder="Enter your password"
                required
                style={{
                  backgroundColor: 'var(--color-cream)',
                  borderColor: 'var(--color-parchment)',
                  color: 'var(--color-ink)'
                }}
              />
            </div>

            {!isLoginMode && (
              <>
                <div>
                  <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                    <Lock size={20} className="inline mr-2" />
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="input-field"
                    placeholder="Confirm your password"
                    required
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      borderColor: 'var(--color-parchment)',
                      color: 'var(--color-ink)'
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                      <MapPin size={20} className="inline mr-2" />
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      className="input-field"
                      placeholder="Your city"
                      style={{
                        backgroundColor: 'var(--color-cream)',
                        borderColor: 'var(--color-parchment)',
                        color: 'var(--color-ink)'
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-accent text-lg mb-3" style={{ color: 'var(--color-ink)' }}>
                      Country
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="input-field"
                      placeholder="Your country"
                      style={{
                        backgroundColor: 'var(--color-cream)',
                        borderColor: 'var(--color-parchment)',
                        color: 'var(--color-ink)'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-accent text-lg mb-4" style={{ color: 'var(--color-ink)' }}>
                    <Heart size={20} className="inline mr-2" />
                    Interests & Goals
                  </label>
                  <p className="text-body text-sm mb-4" style={{ color: 'var(--color-warm-gray)' }}>
                    Select topics you're passionate about to connect with like-minded people
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {commonInterests.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-3 rounded-lg border-2 text-sm transition-all duration-300 ${
                          formData.interests.includes(interest)
                            ? 'whimsical-shadow'
                            : ''
                        }`}
                        style={{
                          backgroundColor: formData.interests.includes(interest)
                            ? 'var(--color-sage-light)'
                            : 'var(--color-parchment)',
                          borderColor: formData.interests.includes(interest)
                            ? 'var(--color-sage)'
                            : 'var(--color-warm-gray-light)',
                          color: formData.interests.includes(interest)
                            ? 'var(--color-charcoal)'
                            : 'var(--color-warm-gray)',
                          transform: formData.interests.includes(interest)
                            ? 'rotate(-0.2deg) scale(1.02)'
                            : 'rotate(0deg) scale(1)'
                        }}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full text-lg py-4"
              >
                <span className="text-accent">
                  {loading ? 'Please wait...' : (isLoginMode ? 'Sign In' : 'Create Account')}
                </span>
              </button>

              <button
                type="button"
                onClick={switchMode}
                className="btn-secondary w-full"
              >
                <span className="text-accent">
                  {isLoginMode ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </span>
              </button>

              {showGuestOption && (
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" style={{ borderColor: 'var(--color-parchment)' }} />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 text-accent" 
                          style={{ 
                            backgroundColor: 'var(--color-warm-white)', 
                            color: 'var(--color-warm-gray)' 
                          }}>
                      or
                    </span>
                  </div>
                </div>
              )}

              {showGuestOption && (
                <button
                  type="button"
                  onClick={onGuestMode}
                  className="btn-secondary w-full flex items-center justify-center gap-3"
                >
                  <UserCheck size={20} />
                  <span className="text-accent">Continue as Guest</span>
                </button>
              )}
            </div>

            {showGuestOption && (
              <div className="text-center pt-4">
                <p className="text-body text-sm" style={{ color: 'var(--color-warm-gray)' }}>
                  Guest mode includes full goal tracking with local storage.<br />
                  Create an account to unlock social features and cloud sync.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
