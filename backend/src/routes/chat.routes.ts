import { Router, Response } from 'express';
import { AuthRequest } from '../types';
import { query } from '../config/database';
import { logger } from '../config/logger';
import { getAIResponse } from '../services/chatAI.service';

const router = Router();

// Send a message to the AI chat
router.post('/send-message', async (req: AuthRequest, res: Response) => {
  try {
    const { message, userId, sessionId, context } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Get AI response using OpenAI
    const aiResponse = await getAIResponse(message, context);

    // Store conversation in database (optional - for history)
    if (userId) {
      await query(`
        INSERT INTO chat_messages (user_id, user_message, bot_response, session_id)
        VALUES ($1, $2, $3, $4)
      `, [userId, message, aiResponse, sessionId || null]);
    }

    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error in chat send-message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Get chat history
router.get('/history/:userId', async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const history = await query(`
      SELECT user_message, bot_response, created_at
      FROM chat_messages
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, parseInt(limit as string), parseInt(offset as string)]);

    res.json({
      messages: history.rows,
      count: history.rows.length
    });
  } catch (error) {
    logger.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
});

// Get chat history for session
router.get('/session/:sessionId', async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;

    const history = await query(`
      SELECT user_message, bot_response, created_at
      FROM chat_messages
      WHERE session_id = $1
      ORDER BY created_at ASC
    `, [sessionId]);

    res.json({
      messages: history.rows,
      count: history.rows.length
    });
  } catch (error) {
    logger.error('Error fetching session history:', error);
    res.status(500).json({ error: 'Failed to fetch session history' });
  }
});

// Feedback for a message (useful for improving AI)
router.post('/feedback', async (req: AuthRequest, res: Response) => {
  try {
    const { messageId, rating, feedback } = req.body;

    if (!messageId || !rating) {
      res.status(400).json({ error: 'Message ID and rating are required' });
      return;
    }

    // In real implementation, you might want to store feedback in a separate table
    // For now, we'll just log it
    logger.info(`Chat feedback: Message ${messageId}, Rating: ${rating}, Feedback: ${feedback || 'N/A'}`);

    res.json({
      success: true,
      message: 'Feedback received'
    });
  } catch (error) {
    logger.error('Error processing feedback:', error);
    res.status(500).json({ error: 'Failed to process feedback' });
  }
});

export default router;
