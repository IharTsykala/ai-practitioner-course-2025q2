import express from 'express';
import { askQuestion } from '../../services/rag.js';

const router = express.Router();

/**
 * @openapi
 * /ask:
 *   post:
 *     summary: Ask a question about the museum collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *             properties:
 *               question:
 *                 type: string
 *                 example: Show me artworks related to religion
 *     responses:
 *       200:
 *         description: Answer and sources
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 answer:
 *                   type: string
 *                 sources:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 */
router.post('/', async (req, res) => {
	const { question } = req.body;
	
	if (!question || typeof question !== 'string') {
		return res.status(400).json({ error: 'Invalid question' });
	}
	
	try {
		const { answer, sources } = await askQuestion(question);
		res.json({ answer, sources });
	} catch (err) {
		console.error('Error in /ask:', err);
		res.status(500).json({ error: 'Something went wrong' });
	}
});

export default router;
