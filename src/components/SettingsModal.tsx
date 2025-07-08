import React from 'react';
import { X, Palette } from 'lucide-react';
import { ThemeName, ColorTheme } from '../types';
import { themes } from '../utils/themes';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  currentTheme, 
  onThemeChange 
}) => {
  if (!isOpen) return null;

  const theme = themes[currentTheme];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="card max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-8" style={{ borderBottom: '1px solid var(--color-warm-gray-light)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 border border-solid flex items-center justify-center minimal-shadow" 
                 style={{ 
                   backgroundColor: 'var(--color-sage)',
                   borderColor: 'var(--color-sage-dark)'
                 }}>
              <Palette className="w-6 h-6" style={{ color: 'var(--color-warm-white)' }} />
            </div>
            <div>
              <h2 className="text-display text-3xl" style={{ color: 'var(--color-ink)' }}>
                Settings
              </h2>
              <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                Customize your experience
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="transition-all duration-200 hover:opacity-70"
            style={{ color: 'var(--color-warm-gray)' }}
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h3 className="text-accent text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
              Theme
            </h3>
            <div className="card p-6 border-2" 
                 style={{
                   backgroundColor: 'var(--color-parchment)',
                   borderColor: 'var(--color-sage)'
                 }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-2">
                    <div className="w-4 h-4 border border-solid" 
                         style={{ 
                           backgroundColor: theme.colors.primary,
                           borderColor: theme.colors.primaryDark
                         }} />
                    <div className="w-4 h-4 border border-solid" 
                         style={{ 
                           backgroundColor: theme.colors.secondary,
                           borderColor: theme.colors.secondaryDark
                         }} />
                    <div className="w-4 h-4 border border-solid" 
                         style={{ 
                           backgroundColor: theme.colors.amber,
                           borderColor: theme.colors.warmGrayDark
                         }} />
                  </div>
                  <div>
                    <h4 className="text-accent text-lg font-semibold" 
                        style={{ color: theme.colors.ink }}>
                      {theme.displayName}
                    </h4>
                    <p className="text-body text-sm" 
                       style={{ color: theme.colors.warmGray }}>
                      Classic cream and rich espresso brown with deep forest green accents
                    </p>
                  </div>
                </div>
                <div className="w-3 h-3 border border-solid animate-pulse"
                     style={{ 
                       backgroundColor: theme.colors.primary,
                       borderColor: theme.colors.primaryDark
                     }} />
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-accent text-xl mb-4" style={{ color: 'var(--color-ink)' }}>
              About
            </h3>
            <div className="card p-6">
              <p className="text-body" style={{ color: 'var(--color-warm-gray)' }}>
                This goals app is designed with analog aesthetics inspired by Co-Star astrology app. 
                The cream and espresso color palette creates a timeless, focused environment for 
                tracking your progress and connecting with others.
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="btn-primary"
            >
              <span className="text-accent">Done</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
