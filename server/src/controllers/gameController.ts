import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { getDb } from '../config/db.js';
import { generateStoryChapter } from '../services/geminiService.js';
import { LevelCompletionResponse } from '../../../shared/schema.js';

export const getGameProgress = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.query(
      'SELECT game_id, levels_completed, total_score, updated_at FROM user_game_progress WHERE user_id = $1',
      [req.user!.id]
    );

    return res.json({ progress: result.rows });
  } catch (err: any) {
    console.error('GetGameProgress error:', err);
    return res.status(500).json({ error: 'Failed to fetch game progress' });
  }
};

export const completeLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { gameId, scoreEarned } = req.body;
    const userId = req.user!.id;
    const db = await getDb();

    // 1. Fetch user's current profile
    const userRes = await db.query(
      'SELECT id, preferred_domain, points, current_streak FROM users WHERE id = $1',
      [userId]
    );
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const user = userRes.rows[0];

    // 2. Update or insert game progress
    const existingProgress = await db.query(
      'SELECT id, levels_completed, total_score FROM user_game_progress WHERE user_id = $1 AND game_id = $2',
      [userId, gameId]
    );

    let newLevelsCompleted = 1;
    let newScore = scoreEarned || 100;

    if (existingProgress.rows.length > 0) {
      newLevelsCompleted = (existingProgress.rows[0].levels_completed || 0) + 1;
      newScore = (existingProgress.rows[0].total_score || 0) + (scoreEarned || 100);

      await db.query(
        'UPDATE user_game_progress SET levels_completed = $1, total_score = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
        [newLevelsCompleted, newScore, existingProgress.rows[0].id]
      );
    } else {
      await db.query(
        'INSERT INTO user_game_progress (user_id, game_id, levels_completed, total_score) VALUES ($1, $2, $3, $4)',
        [userId, gameId, newLevelsCompleted, newScore]
      );
    }

    // 3. Award +50 points
    const pointsAwarded = 50;
    const updatedPoints = (user.points || 0) + pointsAwarded;
    await db.query('UPDATE users SET points = $1 WHERE id = $2', [updatedPoints, userId]);

    // 4. Calculate total levels completed across ALL games
    const allProgressRes = await db.query(
      'SELECT SUM(levels_completed) as total_levels FROM user_game_progress WHERE user_id = $1',
      [userId]
    );
    const totalLevelsCompleted = parseInt(allProgressRes.rows[0]?.total_levels || `${newLevelsCompleted}`, 10);

    // 5. Milestone Check: Every 2 completed levels unlock a new twist-ending story chapter!
    let storyUnlocked = false;
    let unlockedStory: any = undefined;

    if (totalLevelsCompleted > 0 && totalLevelsCompleted % 2 === 0) {
      const chapterNumber = Math.floor(totalLevelsCompleted / 2);
      const domain = user.preferred_domain || 'Vedic & Indian Heritage';

      // Generate exciting twist-ending story chapter via Gemini
      const generated = await generateStoryChapter(domain, undefined, chapterNumber);

      // Save to unlocked_stories table
      const insertStoryRes = await db.query(
        `INSERT INTO unlocked_stories (user_id, domain, title, chapter_number, content, twist_ending, cliffhanger_question)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, domain, title, chapter_number, content, twist_ending, cliffhanger_question, unlocked_at`,
        [
          userId,
          domain,
          generated.title,
          chapterNumber,
          generated.storyBody,
          generated.twistEnding,
          generated.cliffhangerQuestion
        ]
      );

      unlockedStory = insertStoryRes.rows[0];
      storyUnlocked = true;
    }

    const responsePayload: LevelCompletionResponse = {
      success: true,
      pointsAwarded,
      totalPoints: updatedPoints,
      totalLevelsCompleted,
      currentStreak: user.current_streak,
      storyUnlocked,
      unlockedStory,
      message: storyUnlocked
        ? `🎉 Level Cleared! +50 Points Awarded & NEW TWIST STORY UNLOCKED: "${unlockedStory?.title}"!`
        : `🎉 Level Cleared! +50 Points Awarded! Complete 1 more level to unlock the next chapter twist!`
    };

    return res.json(responsePayload);
  } catch (err: any) {
    console.error('CompleteLevel error:', err);
    return res.status(500).json({ error: 'Failed to complete level and record progress' });
  }
};
