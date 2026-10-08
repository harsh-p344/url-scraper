import { Router } from 'express'
import { createSummary } from '../controllers/summaryController.js'

const router = Router()
router.get('/', (_req, res) => {
	res.set('Allow', 'POST').status(405).json({
		error: 'Send a POST request with a webpage URL to create a summary.',
		example: { url: 'https://example.com/article' },
	})
})
router.post('/', createSummary)

export default router
