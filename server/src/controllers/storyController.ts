import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { getDb } from '../config/db.js';
import { generateStoryChapter } from '../services/geminiService.js';

export const getMyLibrary = async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const result = await db.query(
      `SELECT id, domain, title, chapter_number, content, twist_ending, cliffhanger_question, unlocked_at
       FROM unlocked_stories
       WHERE user_id = $1
       ORDER BY id DESC`,
      [req.user!.id]
    );

    return res.json({ stories: result.rows });
  } catch (err: any) {
    console.error('GetMyLibrary error:', err);
    return res.status(500).json({ error: 'Failed to fetch unlocked stories' });
  }
};

export const getStoryById = async (req: AuthRequest, res: Response) => {
  try {
    const { storyId } = req.params;
    const db = await getDb();

    const result = await db.query(
      `SELECT id, domain, title, chapter_number, content, twist_ending, cliffhanger_question, unlocked_at
       FROM unlocked_stories
       WHERE id = $1 AND user_id = $2`,
      [storyId, req.user!.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Story not found or not unlocked yet' });
    }

    return res.json({ story: result.rows[0] });
  } catch (err: any) {
    console.error('GetStoryById error:', err);
    return res.status(500).json({ error: 'Failed to retrieve story' });
  }
};

export const generateTwist = async (req: AuthRequest, res: Response) => {
  try {
    const { domain, topic, chapterNumber } = req.body;
    const effectiveDomain = domain || 'Vedic & Indian Heritage';
    const effectiveChapter = chapterNumber || 1;

    const chapter = await generateStoryChapter(effectiveDomain, topic, effectiveChapter);
    return res.json({ story: chapter });
  } catch (err: any) {
    console.error('GenerateTwist error:', err);
    return res.status(500).json({ error: 'Failed to generate story twist' });
  }
};
