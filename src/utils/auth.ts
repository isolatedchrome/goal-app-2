import { User } from '../types';

// Mock authentication service
class AuthService {
  private currentUser: User | null = null;
  private users: User[] = [
    {
      id: '1',
      name: 'Emma Thompson',
      email: 'emma@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      location: {
        city: 'San Francisco',
        country: 'USA',
        coordinates: { lat: 37.7749, lng: -122.4194 }
      },
      bio: 'Passionate about personal growth and creative pursuits. Always learning something new!',
      interests: ['React Development', 'Photography', 'Yoga', 'Reading'],
      goals: [
        {
          id: 'g1',
          title: 'Master React Development',
          expanded: false,
          priority: 'high',
          category: 'Technology',
          isPublic: true,
          tasks: [
            { id: 't1', text: 'Complete advanced React course', completed: false, subtasks: [], expanded: false, order: 0 },
            { id: 't2', text: 'Build portfolio project', completed: false, subtasks: [], expanded: false, order: 1 }
          ]
        }
      ],
      friends: ['2', '3'],
      friendRequests: { sent: [], received: [] },
      privacy: { showLocation: true, showGoals: true, allowFriendRequests: true },
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Marcus Chen',
      email: 'marcus@example.com',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      location: {
        city: 'San Francisco',
        country: 'USA',
        coordinates: { lat: 37.7849, lng: -122.4094 }
      },
      bio: 'Full-stack developer and fitness enthusiast. Love connecting with like-minded people!',
      interests: ['Web Development', 'Fitness', 'Cooking', 'Travel'],
      goals: [
        {
          id: 'g2',
          title: 'Learn React Development',
          expanded: false,
          priority: 'high',
          category: 'Technology',
          isPublic: true,
          tasks: [
            { id: 't3', text: 'Set up development environment', completed: true, subtasks: [], expanded: false, order: 0 },
            { id: 't4', text: 'Build first React app', completed: false, subtasks: [], expanded: false, order: 1 }
          ]
        }
      ],
      friends: ['1'],
      friendRequests: { sent: [], received: [] },
      privacy: { showLocation: true, showGoals: true, allowFriendRequests: true },
      joinedAt: '2024-02-01'
    },
    {
      id: '3',
      name: 'Sofia Rodriguez',
      email: 'sofia@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      location: {
        city: 'Oakland',
        country: 'USA',
        coordinates: { lat: 37.8044, lng: -122.2711 }
      },
      bio: 'Designer and yoga instructor. Passionate about mindful living and creative expression.',
      interests: ['Design', 'Yoga', 'Meditation', 'Art'],
      goals: [
        {
          id: 'g3',
          title: 'Start Photography Business',
          expanded: false,
          priority: 'medium',
          category: 'Business',
          isPublic: true,
          tasks: [
            { id: 't5', text: 'Build portfolio website', completed: false, subtasks: [], expanded: false, order: 0 },
            { id: 't6', text: 'Get first 5 clients', completed: false, subtasks: [], expanded: false, order: 1 }
          ]
        }
      ],
      friends: ['1'],
      friendRequests: { sent: [], received: [] },
      privacy: { showLocation: true, showGoals: true, allowFriendRequests: true },
      joinedAt: '2024-01-20'
    }
  ];

  constructor() {
    // Load from localStorage if available
    const stored = localStorage.getItem('goals-app-user');
    if (stored) {
      this.currentUser = JSON.parse(stored);
    }
    
    const storedUsers = localStorage.getItem('goals-app-users');
    if (storedUsers) {
      this.users = JSON.parse(storedUsers);
    }
  }

  async login(email: string, password: string): Promise<User | null> {
    // Mock login - in real app, this would validate credentials
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      localStorage.setItem('goals-app-user', JSON.stringify(user));
      return user;
    }
    return null;
  }

  async register(userData: {
    name: string;
    email: string;
    password: string;
    location?: { city: string; country: string };
    interests: string[];
  }): Promise<User> {
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      location: userData.location,
      interests: userData.interests,
      goals: [],
      friends: [],
      friendRequests: { sent: [], received: [] },
      privacy: { showLocation: true, showGoals: true, allowFriendRequests: true },
      joinedAt: new Date().toISOString()
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    
    localStorage.setItem('goals-app-user', JSON.stringify(newUser));
    localStorage.setItem('goals-app-users', JSON.stringify(this.users));
    
    return newUser;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('goals-app-user');
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  async updateUser(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) return null;
    
    this.currentUser = { ...this.currentUser, ...updates };
    const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
    if (userIndex !== -1) {
      this.users[userIndex] = this.currentUser;
    }
    
    localStorage.setItem('goals-app-user', JSON.stringify(this.currentUser));
    localStorage.setItem('goals-app-users', JSON.stringify(this.users));
    
    return this.currentUser;
  }

  async findNearbyUsers(maxDistance: number = 50): Promise<User[]> {
    if (!this.currentUser?.location?.coordinates) return [];
    
    const { lat: userLat, lng: userLng } = this.currentUser.location.coordinates;
    
    return this.users.filter(user => {
      if (user.id === this.currentUser!.id) return false;
      if (!user.location?.coordinates) return false;
      if (!user.privacy.showLocation) return false;
      
      const distance = this.calculateDistance(
        userLat, userLng,
        user.location.coordinates.lat, user.location.coordinates.lng
      );
      
      return distance <= maxDistance;
    });
  }

  async findUsersWithSimilarGoals(): Promise<User[]> {
    if (!this.currentUser) return [];
    
    const userGoalTitles = this.currentUser.goals
      .filter(g => g.isPublic)
      .map(g => g.title.toLowerCase());
    
    return this.users.filter(user => {
      if (user.id === this.currentUser!.id) return false;
      if (!user.privacy.showGoals) return false;
      
      const userPublicGoals = user.goals
        .filter(g => g.isPublic)
        .map(g => g.title.toLowerCase());
      
      return userPublicGoals.some(goal => 
        userGoalTitles.some(userGoal => 
          goal.includes(userGoal) || userGoal.includes(goal)
        )
      );
    });
  }

  async sendFriendRequest(userId: string): Promise<boolean> {
    if (!this.currentUser) return false;
    
    const targetUser = this.users.find(u => u.id === userId);
    if (!targetUser || !targetUser.privacy.allowFriendRequests) return false;
    
    // Add to current user's sent requests
    if (!this.currentUser.friendRequests.sent.includes(userId)) {
      this.currentUser.friendRequests.sent.push(userId);
    }
    
    // Add to target user's received requests
    if (!targetUser.friendRequests.received.includes(this.currentUser.id)) {
      targetUser.friendRequests.received.push(this.currentUser.id);
    }
    
    this.updateUsersInStorage();
    return true;
  }

  async acceptFriendRequest(userId: string): Promise<boolean> {
    if (!this.currentUser) return false;
    
    const requestIndex = this.currentUser.friendRequests.received.indexOf(userId);
    if (requestIndex === -1) return false;
    
    // Remove from received requests
    this.currentUser.friendRequests.received.splice(requestIndex, 1);
    
    // Add to friends
    if (!this.currentUser.friends.includes(userId)) {
      this.currentUser.friends.push(userId);
    }
    
    // Update the other user
    const otherUser = this.users.find(u => u.id === userId);
    if (otherUser) {
      const sentIndex = otherUser.friendRequests.sent.indexOf(this.currentUser.id);
      if (sentIndex !== -1) {
        otherUser.friendRequests.sent.splice(sentIndex, 1);
      }
      if (!otherUser.friends.includes(this.currentUser.id)) {
        otherUser.friends.push(this.currentUser.id);
      }
    }
    
    this.updateUsersInStorage();
    return true;
  }

  getFriends(): User[] {
    if (!this.currentUser) return [];
    return this.users.filter(u => this.currentUser!.friends.includes(u.id));
  }

  getFriendRequests(): User[] {
    if (!this.currentUser) return [];
    return this.users.filter(u => this.currentUser!.friendRequests.received.includes(u.id));
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private updateUsersInStorage(): void {
    if (this.currentUser) {
      const userIndex = this.users.findIndex(u => u.id === this.currentUser!.id);
      if (userIndex !== -1) {
        this.users[userIndex] = this.currentUser;
      }
      localStorage.setItem('goals-app-user', JSON.stringify(this.currentUser));
    }
    localStorage.setItem('goals-app-users', JSON.stringify(this.users));
  }
}

export const authService = new AuthService();
