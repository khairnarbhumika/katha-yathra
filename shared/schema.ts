import { z } from 'zod';

// ==========================================
// CULTURAL DOMAINS & CIVILIZATION CONSTANTS
// ==========================================
export const CULTURAL_DOMAINS = [
  {
    id: 'vedic-indian',
    name: 'Vedic & Indian Heritage',
    tagline: 'Epics, Philosophy, Ancient Mathematics & Indus Marvels',
    description: 'Explore the timeless sagas of Ramayana, Mahabharata, tales of Panchatantra, and the urban planning of Harappa & Mohenjo-daro.',
    icon: 'Flame',
    themeColor: 'from-amber-500 to-orange-600',
    bannerImage: 'https://images.unsplash.com/photo-1599827556793-68d76d4957ca?auto=format&fit=crop&w=1200&q=80',
    topics: ['Ramayana & Valmiki', 'Mahabharata & Kurukshetra Wisdom', 'Indus Valley Urban Architecture', 'Panchatantra & Hitopadesha']
  },
  {
    id: 'egyptian-african',
    name: 'Ancient Egyptian & African Civilizations',
    tagline: 'Pyramids, Pharaohs, Nile Mystery & Nubian Kingdoms',
    description: 'Decode sacred hieroglyphs, marvel at the Great Pyramids of Giza, discover the golden treasures of Tutankhamun and the Kingdom of Kush.',
    icon: 'Sun',
    themeColor: 'from-yellow-500 to-amber-700',
    bannerImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?auto=format&fit=crop&w=1200&q=80',
    topics: ['The Great Pyramids & Imhotep', 'Hieroglyphs & The Rosetta Stone', 'Gods of the Nile & Osiris', 'Kingdom of Kush & Nubian Pharaohs']
  },
  {
    id: 'greco-roman',
    name: 'Greco-Roman & European History',
    tagline: 'Myths of Olympus, Roman Aqueducts & Renaissance Sparks',
    description: 'Walk through Athens with Socrates, witness gladiators in the Colosseum, explore Archimedes’ inventions and the Da Vinci era.',
    icon: 'Shield',
    themeColor: 'from-blue-500 to-indigo-700',
    bannerImage: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    topics: ['Twelve Olympians & Hercules', 'Roman Engineering & Aqueducts', 'Alexander & The Library of Alexandria', 'Renaissance Inventions & Da Vinci']
  },
  {
    id: 'islamic-golden-age',
    name: 'Islamic Golden Age & Middle Eastern Lore',
    tagline: 'House of Wisdom, Astrolabes, Algebra & Stargazers',
    description: 'Step into ancient Baghdad, navigate starry seas with astrolabes, learn from Al-Khwarizmi and Ibn Battuta’s globetrotting adventures.',
    icon: 'Moon',
    themeColor: 'from-emerald-500 to-teal-700',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    topics: ['The House of Wisdom & Bayt al-Hikma', 'Astrolabes & Celestial Maps', 'Ibn Battuta’s Epic Journeys', 'Al-Khwarizmi & The Birth of Algebra']
  },
  {
    id: 'asian-silk-road',
    name: 'Asian & Silk Road Lore',
    tagline: 'Great Wall, Dragon Legends, Feudal Castles & Caravan Routes',
    description: 'Unravel the secrets of the Terracotta Army, explore feudal samurai traditions, follow Silk Road spice merchants, and invent paper & gunpowder.',
    icon: 'Compass',
    themeColor: 'from-rose-500 to-red-700',
    bannerImage: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=1200&q=80',
    topics: ['The Great Wall & First Emperor', 'Silk Road Merchants & Caravans', 'Four Great Inventions of China', 'Samurai Honor & Feudal Castles']
  },
  {
    id: 'biblical-ancient-western',
    name: 'Biblical & Mesopotamian Heritage',
    tagline: 'Cradle of Civilization, Hammurabi’s Code & Fertile Crescent',
    description: 'Explore ancient Babylon and the Hanging Gardens, decode cuneiform tablets, discover the Epic of Gilgamesh and ancient Fertile Crescent stories.',
    icon: 'BookOpen',
    themeColor: 'from-purple-500 to-violet-800',
    bannerImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    topics: ['Epic of Gilgamesh & Uruk', 'Hanging Gardens of Babylon', 'Code of Hammurabi & Scribes', 'Noah’s Ark & Mesopotamian Floods']
  }
] as const;

export const AVATARS = [
  { id: 'explorer', name: 'Time Explorer', icon: '🧭', bg: 'bg-amber-100 text-amber-600' },
  { id: 'scholar', name: 'Royal Scholar', icon: '📜', bg: 'bg-blue-100 text-blue-600' },
  { id: 'archaeologist', name: 'Artifact Hunter', icon: '🏺', bg: 'bg-emerald-100 text-emerald-600' },
  { id: 'astronomer', name: 'Cosmic Stargazer', icon: '🔭', bg: 'bg-purple-100 text-purple-600' },
  { id: 'warrior', name: 'Epic Guardian', icon: '🛡️', bg: 'bg-rose-100 text-rose-600' },
  { id: 'architect', name: 'Monument Builder', icon: '🏛️', bg: 'bg-teal-100 text-teal-600' }
];

export const AGE_GROUPS = ['6-9', '10-13', '14+'] as const;

// ==========================================
// ZOD VALIDATION SCHEMAS
// ==========================================
export const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username max 30 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  ageGroup: z.enum(AGE_GROUPS),
  preferredDomain: z.string().min(1, 'Please select a preferred heritage domain'),
  avatarUrl: z.string().optional().default('explorer')
});

export const loginSchema = z.object({
  email: z.string().email('Please enter your email'),
  password: z.string().min(1, 'Password is required')
});

export const levelCompleteSchema = z.object({
  gameId: z.string().min(1, 'Game ID is required'),
  scoreEarned: z.number().min(0),
  timeTakenSeconds: z.number().min(1)
});

export const generateTwistSchema = z.object({
  domain: z.string().min(1),
  topic: z.string().optional(),
  chapterNumber: z.number().int().positive().optional()
});

export const unlockStoreItemSchema = z.object({
  itemId: z.number().int().positive('Item ID must be a positive integer')
});

export const updateProfileSchema = z.object({
  avatarUrl: z.string().optional(),
  preferredDomain: z.string().optional(),
  ageGroup: z.enum(AGE_GROUPS).optional()
});

// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LevelCompleteInput = z.infer<typeof levelCompleteSchema>;
export type GenerateTwistInput = z.infer<typeof generateTwistSchema>;
export type UnlockStoreItemInput = z.infer<typeof unlockStoreItemSchema>;

export interface User {
  id: number;
  username: string;
  email: string;
  age_group: string;
  preferred_domain: string;
  points: number;
  current_streak: number;
  last_login_date: string;
  avatar_url: string;
  created_at: string;
}

export interface UserGameProgress {
  id: number;
  user_id: number;
  game_id: string;
  levels_completed: number;
  total_score: number;
  updated_at: string;
}

export interface UnlockedStory {
  id: number;
  user_id: number;
  domain: string;
  title: string;
  chapter_number: number;
  content: string;
  twist_ending: string;
  cliffhanger_question?: string;
  unlocked_at: string;
}

export interface StoreItem {
  id: number;
  title: string;
  category: 'Space' | 'Applied Science' | 'Robotics' | 'Quantum & Physics';
  description: string;
  cost_points: number;
  video_url: string;
  thumbnail_url: string;
  duration_minutes: number;
  highlights: string[];
}

export interface UserPurchase {
  id: number;
  user_id: number;
  item_id: number;
  purchased_at: string;
}

export interface LevelCompletionResponse {
  success: boolean;
  pointsAwarded: number;
  totalPoints: number;
  totalLevelsCompleted: number;
  currentStreak: number;
  storyUnlocked: boolean;
  unlockedStory?: UnlockedStory;
  message: string;
}
