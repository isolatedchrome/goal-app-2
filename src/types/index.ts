export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  subtasks: Subtask[];
  expanded: boolean;
  order: number;
}

export interface Goal {
  id: string;
  title: string;
  tasks: Task[];
  expanded: boolean;
  priority?: Priority;
  category?: string;
  isPublic?: boolean;
}

export type ThemeName = 'wild-rose' | 'honey-blonde' | 'sweet-espresso' | 'sage-garden' | 'cream-espresso';

export interface ColorTheme {
  name: ThemeName;
  displayName: string;
  colors: {
    cream: string;
    warmWhite: string;
    parchment: string;
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    secondaryLight: string;
    secondaryDark: string;
    accent: string;
    accentLight: string;
    accentDark: string;
    warmGray: string;
    warmGrayLight: string;
    warmGrayDark: string;
    charcoal: string;
    ink: string;
    amber: string;
    amberLight: string;
    rose: string;
    lavender: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: {
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  bio?: string;
  interests: string[];
  goals: Goal[];
  friends: string[];
  friendRequests: {
    sent: string[];
    received: string[];
  };
  privacy: {
    showLocation: boolean;
    showGoals: boolean;
    allowFriendRequests: boolean;
  };
  joinedAt: string;
}

export interface FriendSuggestion {
  user: User;
  commonGoals: number;
  distance?: number;
  mutualFriends: number;
}

export interface LocationMatch {
  user: User;
  sharedGoals: Goal[];
  distance: number;
}
