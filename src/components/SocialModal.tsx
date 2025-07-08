import React, { useState, useEffect } from 'react';
import { X, Users, MapPin, Target, UserPlus, Check, MessageCircle } from 'lucide-react';
import { User, FriendSuggestion } from '../types';
import { authService } from '../utils/auth';

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
}

const SocialModal: React.FC<SocialModalProps> = ({ isOpen, onClose, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'discover' | 'requests'>('friends');
  const [friends, setFriends] = useState<User[]>([]);
  const [nearbyUsers, setNearbyUsers] = useState<User[]>([]);
  const [similarGoalUsers, setSimilarGoalUsers] = useState<User[]>([]);
  const [friendRequests, setFriendRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSocialData();
    }
  }, [isOpen]);

  const loadSocialData = async () => {
    setLoading(true);
    try {
      const [friendsData, nearbyData, similarData, requestsData] = await Promise.all([
        Promise.resolve(authService.getFriends()),
        authService.findNearbyUsers(),
        authService.findUsersWithSimilarGoals(),
        Promise.resolve(authService.getFriendRequests())
      ]);

      setFriends(friendsData);
      setNearbyUsers(nearbyData);
      setSimilarGoalUsers(similarData);
      setFriendRequests(requestsData);
    } catch (error) {
      console.error('Error loading social data:', error);
    }
    setLoading(false);
  };

  const handleSendFriendRequest = async (userId: string) => {
    const success = await authService.sendFriendRequest(userId);
    if (success) {
      // Remove from discovery lists
      setNearbyUsers(prev => prev.filter(u => u.id !== userId));
      setSimilarGoalUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const handleAcceptFriendRequest = async (userId: string) => {
    const success = await authService.acceptFriendRequest(userId);
    if (success) {
      setFriendRequests(prev => prev.filter(u => u.id !== userId));
      loadSocialData(); // Refresh to show new friend
    }
  };

  if (!isOpen) return null;

  const UserCard: React.FC<{ user: User; showActions?: boolean; isRequest?: boolean }> = ({ 
    user, 
    showActions = false, 
    isRequest = false 
  }) => (
    <div className="card p-6 mb-4">
      <div className="flex items-start gap-4">
        <div 
          className="w-16 h-16 rounded-full bg-cover bg-center whimsical-shadow"
          style={{ 
            backgroundImage: user.avatar ? `url(${user.avatar})` : 'none',
            backgroundColor: user.avatar ? 'transparent' : 'var(--color-sage-light)'
          }}
        >
          {!user.avatar && (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-8 h-8" style={{ color: 'var(--color-charcoal)' }} />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="text-accent text-xl font-semibold mb-2" style={{ color: 'var(--color-ink)' }}>
            {user.name}
          </h4>
          
          {user.location && (
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} style={{ color: 'var(--color-warm-gray)' }} />
              <span className="text-body text-sm" style={{ color: 'var(--color-warm-gray)' }}>
                {user.location.city}, {user.location.country}
              </span>
            </div>
          )}
          
          {user.bio && (
            <p className="text-body text-sm mb-3" style={{ color: 'var(--color-warm-gray)' }}>
              {user.bio}
            </p>
          )}
          
          {user.interests.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {user.interests.slice(0, 3).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 rounded-full text-xs border"
                  style={{
                    backgroundColor: 'var(--color-parchment)',
                    borderColor: 'var(--color-sage-light)',
                    color: 'var(--color-charcoal)'
                  }}
                >
                  {interest}
                </span>
              ))}
              {user.interests.length > 3 && (
                <span className="text-xs" style={{ color: 'var(--color-warm-gray)' }}>
                  +{user.interests.length - 3} more
                </span>
              )}
            </div>
          )}
          
          {user.goals.filter(g => g.isPublic).length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} style={{ color: 'var(--color-sage)' }} />
                <span className="text-accent text-sm font-medium" style={{ color: 'var(--color-sage)' }}>
                  Public Goals
                </span>
              </div>
              {user.goals.filter(g => g.isPublic).slice(0, 2).map((goal) => (
                <div key={goal.id} className="text-body text-sm mb-1" style={{ color: 'var(--color-warm-gray)' }}>
                  • {goal.title}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {showActions && (
          <div className="flex flex-col gap-2">
            {isRequest ? (
              <button
                onClick={() => handleAcceptFriendRequest(user.id)}
                className="btn-primary px-4 py-2 text-sm"
              >
                <Check size={16} className="mr-2" />
                <span className="text-accent">Accept</span>
              </button>
            ) : (
              <button
                onClick={() => handleSendFriendRequest(user.id)}
                className="btn-secondary px-4 py-2 text-sm"
              >
                <UserPlus size={16} className="mr-2" />
                <span className="text-accent">Add Friend</span>
              </button>
            )}
          </div>
        )}
        
        {!showActions && activeTab === 'friends' && (
          <button className="btn-secondary px-4 py-2 text-sm">
            <MessageCircle size={16} className="mr-2" />
            <span className="text-accent">Message</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="card max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-8" style={{ borderBottom: '2px solid var(--color-parchment)' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center whimsical-shadow" 
                 style={{ background: 'var(--theme-gradient-primary)' }}>
              <Users className="w-7 h-7" style={{ color: 'var(--color-warm-white)' }} />
            </div>
            <div>
              <h2 className="text-display text-3xl" style={{ color: 'var(--color-ink)' }}>
                Social Network
              </h2>
              <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                Connect with goal-oriented people in your area
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

        {/* Tab Navigation */}
        <div className="flex border-b-2" style={{ borderColor: 'var(--color-parchment)' }}>
          {[
            { id: 'friends', label: 'My Friends', count: friends.length },
            { id: 'discover', label: 'Discover', count: nearbyUsers.length + similarGoalUsers.length },
            { id: 'requests', label: 'Requests', count: friendRequests.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 p-6 text-center transition-all duration-300 ${
                activeTab === tab.id ? 'whimsical-shadow' : ''
              }`}
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--color-sage-light)' : 'transparent',
                color: activeTab === tab.id ? 'var(--color-charcoal)' : 'var(--color-warm-gray)',
                borderBottom: activeTab === tab.id ? '3px solid var(--color-sage)' : '3px solid transparent'
              }}
            >
              <span className="text-accent font-medium">{tab.label}</span>
              {tab.count > 0 && (
                <span 
                  className="ml-2 px-2 py-1 rounded-full text-xs"
                  style={{
                    backgroundColor: 'var(--color-terracotta)',
                    color: 'var(--color-warm-white)'
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          {loading ? (
            <div className="text-center py-16">
              <div className="animate-gentle-bounce mb-4">
                <Users className="w-16 h-16 mx-auto" style={{ color: 'var(--color-sage-light)' }} />
              </div>
              <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                Loading your social network...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'friends' && (
                <div>
                  {friends.length === 0 ? (
                    <div className="text-center py-16">
                      <Users className="w-20 h-20 mx-auto mb-6" style={{ color: 'var(--color-sage-light)' }} />
                      <h3 className="text-display text-2xl mb-3" style={{ color: 'var(--color-ink)' }}>
                        No friends yet
                      </h3>
                      <p className="text-body text-lg mb-8" style={{ color: 'var(--color-warm-gray)' }}>
                        Start connecting with people who share your goals and interests.
                      </p>
                      <button
                        onClick={() => setActiveTab('discover')}
                        className="btn-primary"
                      >
                        <span className="text-accent">Discover People</span>
                      </button>
                    </div>
                  ) : (
                    friends.map((friend) => (
                      <UserCard key={friend.id} user={friend} />
                    ))
                  )}
                </div>
              )}

              {activeTab === 'discover' && (
                <div>
                  {nearbyUsers.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-display text-2xl mb-6 flex items-center gap-3" style={{ color: 'var(--color-ink)' }}>
                        <MapPin className="w-6 h-6" style={{ color: 'var(--color-sage)' }} />
                        People Near You
                      </h3>
                      {nearbyUsers.map((user) => (
                        <UserCard key={user.id} user={user} showActions />
                      ))}
                    </div>
                  )}

                  {similarGoalUsers.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-display text-2xl mb-6 flex items-center gap-3" style={{ color: 'var(--color-ink)' }}>
                        <Target className="w-6 h-6" style={{ color: 'var(--color-sage)' }} />
                        Similar Goals
                      </h3>
                      {similarGoalUsers.map((user) => (
                        <UserCard key={user.id} user={user} showActions />
                      ))}
                    </div>
                  )}

                  {nearbyUsers.length === 0 && similarGoalUsers.length === 0 && (
                    <div className="text-center py-16">
                      <Target className="w-20 h-20 mx-auto mb-6" style={{ color: 'var(--color-sage-light)' }} />
                      <h3 className="text-display text-2xl mb-3" style={{ color: 'var(--color-ink)' }}>
                        No matches found
                      </h3>
                      <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                        Try adding more public goals or updating your location to find people with similar interests.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'requests' && (
                <div>
                  {friendRequests.length === 0 ? (
                    <div className="text-center py-16">
                      <UserPlus className="w-20 h-20 mx-auto mb-6" style={{ color: 'var(--color-sage-light)' }} />
                      <h3 className="text-display text-2xl mb-3" style={{ color: 'var(--color-ink)' }}>
                        No friend requests
                      </h3>
                      <p className="text-body text-lg" style={{ color: 'var(--color-warm-gray)' }}>
                        When people send you friend requests, they'll appear here.
                      </p>
                    </div>
                  ) : (
                    friendRequests.map((user) => (
                      <UserCard key={user.id} user={user} showActions isRequest />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialModal;
