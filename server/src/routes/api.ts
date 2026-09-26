import { Router } from 'express';
import { register, login, getMe, updateProfile, logout } from '../controllers/authController.js';
import { getGameProgress, completeLevel } from '../controllers/gameController.js';
import { getMyLibrary, getStoryById, generateTwist } from '../controllers/storyController.js';
import { getStoreItems, unlockStoreItem } from '../controllers/storeController.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { validateBody } from '../middleware/validateMiddleware.js';
import {
  registerSchema,
  loginSchema,
  levelCompleteSchema,
  generateTwistSchema,
  unlockStoreItemSchema,
  updateProfileSchema
} from '../../../shared/schema.js';

const router = Router();

// ==========================================
// AUTHENTICATION & PROFILES
// ==========================================
router.post('/auth/register', validateBody(registerSchema), register);
router.post('/auth/login', validateBody(loginSchema), login);
router.post('/auth/logout', logout);
router.get('/auth/me', requireAuth, getMe);
router.put('/auth/profile', requireAuth, validateBody(updateProfileSchema), updateProfile);

// ==========================================
// GAMES & LEVEL PROGRESSION
// ==========================================
router.get('/games/progress', requireAuth, getGameProgress);
router.post('/games/complete-level', requireAuth, validateBody(levelCompleteSchema), completeLevel);

// ==========================================
// STORIES & TWIST GENERATOR
// ==========================================
router.get('/stories/my-library', requireAuth, getMyLibrary);
router.get('/stories/:storyId', requireAuth, getStoryById);
router.post('/stories/generate-twist', requireAuth, validateBody(generateTwistSchema), generateTwist);

// ==========================================
// STEM / SPACE STORE
// ==========================================
router.get('/store/items', requireAuth, getStoreItems);
router.post('/store/unlock', requireAuth, validateBody(unlockStoreItemSchema), unlockStoreItem);

export default router;
