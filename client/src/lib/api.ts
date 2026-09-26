import {
  RegisterInput,
  LoginInput,
  LevelCompleteInput,
  GenerateTwistInput,
  UnlockStoreItemInput,
  User,
  UnlockedStory,
  StoreItem,
  LevelCompletionResponse
} from '@shared/schema';

const API_BASE = '/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  details?: any[];
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('katha_token');
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include'
  };

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const message = data.error || (data.details ? data.details[0]?.message : 'Request failed');
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  // Auth
  register: (input: RegisterInput) =>
    request<{ message: string; token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input)
    }),

  login: (input: LoginInput) =>
    request<{ message: string; token: string; user: User; streakBonusAwarded?: boolean }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input)
    }),

  logout: () =>
    request<{ message: string }>('/auth/logout', {
      method: 'POST'
    }),

  getMe: () =>
    request<{
      user: User;
      stats: {
        unlockedStoriesCount: number;
        purchasedVideosCount: number;
        totalLevelsCompleted: number;
      };
    }>('/auth/me'),

  updateProfile: (data: { avatarUrl?: string; preferredDomain?: string; ageGroup?: string }) =>
    request<{ message: string; user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  // Games & Progress
  getGameProgress: () =>
    request<{
      progress: {
        game_id: string;
        levels_completed: number;
        total_score: number;
        updated_at: string;
      }[];
    }>('/games/progress'),

  completeLevel: (input: LevelCompleteInput) =>
    request<LevelCompletionResponse>('/games/complete-level', {
      method: 'POST',
      body: JSON.stringify(input)
    }),

  // Stories
  getMyStories: () =>
    request<{ stories: UnlockedStory[] }>('/stories/my-library'),

  getStoryById: (id: number | string) =>
    request<{ story: UnlockedStory }>(`/stories/${id}`),

  generateTwist: (input: GenerateTwistInput) =>
    request<{ story: any }>('/stories/generate-twist', {
      method: 'POST',
      body: JSON.stringify(input)
    }),

  // Store
  getStoreItems: () =>
    request<{ items: StoreItem[] }>('/store/items'),

  unlockStoreItem: (input: UnlockStoreItemInput) =>
    request<{ message: string; remainingPoints: number; item: StoreItem }>('/store/unlock', {
      method: 'POST',
      body: JSON.stringify(input)
    })
};
