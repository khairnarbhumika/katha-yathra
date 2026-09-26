import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { getDb } from '../config/db.js';

export const getStoreItems = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const db = await getDb();

    // Fetch all store items
    const itemsRes = await db.query('SELECT * FROM store_items ORDER BY id ASC');

    // Fetch user purchases if user is logged in
    let purchasedItemIds: number[] = [];
    if (userId) {
      const purchasesRes = await db.query(
        'SELECT item_id FROM user_purchases WHERE user_id = $1',
        [userId]
      );
      purchasedItemIds = purchasesRes.rows.map(r => r.item_id);
    }

    const items = itemsRes.rows.map(item => {
      let parsedHighlights: string[] = [];
      try {
        parsedHighlights = typeof item.highlights === 'string' ? JSON.parse(item.highlights) : (item.highlights || []);
      } catch {
        parsedHighlights = [];
      }

      return {
        ...item,
        highlights: parsedHighlights,
        isUnlocked: purchasedItemIds.includes(item.id)
      };
    });

    return res.json({ items });
  } catch (err: any) {
    console.error('GetStoreItems error:', err);
    return res.status(500).json({ error: 'Failed to fetch store items' });
  }
};

export const unlockStoreItem = async (req: AuthRequest, res: Response) => {
  try {
    const { itemId } = req.body;
    const userId = req.user!.id;
    const db = await getDb();

    // 1. Fetch item
    const itemRes = await db.query('SELECT * FROM store_items WHERE id = $1', [itemId]);
    if (itemRes.rows.length === 0) {
      return res.status(404).json({ error: 'Store item not found' });
    }
    const item = itemRes.rows[0];

    // 2. Check if already purchased
    const purchaseCheck = await db.query(
      'SELECT id FROM user_purchases WHERE user_id = $1 AND item_id = $2',
      [userId, itemId]
    );
    if (purchaseCheck.rows.length > 0) {
      return res.status(400).json({ error: 'You have already unlocked this premium module!' });
    }

    // 3. Check user points
    const userRes = await db.query('SELECT points FROM users WHERE id = $1', [userId]);
    if (userRes.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    const userPoints = userRes.rows[0].points || 0;

    if (userPoints < item.cost_points) {
      return res.status(400).json({
        error: `Insufficient points. You need ${item.cost_points} points (you have ${userPoints} points). Play more mini-game levels to earn points!`
      });
    }

    // 4. Atomic deduction and purchase insertion
    const updatedPoints = userPoints - item.cost_points;
    await db.query('UPDATE users SET points = $1 WHERE id = $2', [updatedPoints, userId]);

    await db.query(
      'INSERT INTO user_purchases (user_id, item_id) VALUES ($1, $2)',
      [userId, itemId]
    );

    let parsedHighlights: string[] = [];
    try {
      parsedHighlights = typeof item.highlights === 'string' ? JSON.parse(item.highlights) : (item.highlights || []);
    } catch {
      parsedHighlights = [];
    }

    return res.json({
      message: `🚀 Successfully unlocked "${item.title}"! Enjoy your Space & STEM voyage!`,
      remainingPoints: updatedPoints,
      item: {
        ...item,
        highlights: parsedHighlights,
        isUnlocked: true
      }
    });
  } catch (err: any) {
    console.error('UnlockStoreItem error:', err);
    return res.status(500).json({ error: 'Failed to unlock store item' });
  }
};
