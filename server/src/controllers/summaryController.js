import { scrapeUrl } from '../services/scraper.js'
import { summarizeText } from '../services/ai.js'

export async function createSummary(req, res, next) {
  try {
    const { url } = req.body || {}
    if (typeof url !== 'string' || !url.trim()) {
      return res.status(400).json({ error: 'Provide a URL to summarize.' })
    }

    const article = await scrapeUrl(url.trim())
    const summary = await summarizeText(article.text)
    return res.json({
      url: article.url,
      title: article.title,
      summary,
      wordCount: article.wordCount,
      readingTime: `${Math.max(1, Math.ceil(article.wordCount / 220))} min read`,
    })
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      return res.status(504).json({ error: 'The page took too long to respond. Try again later.' })
    }
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message })
    }
    if (error.message?.startsWith('Enter a valid') || error.message?.startsWith('Only ') || error.message?.includes('publicly accessible') || error.message?.includes('credentials')) {
      return res.status(400).json({ error: error.message })
    }
    if (error.message?.startsWith('Failed to fetch') || error.message?.startsWith('The URL') || error.message?.startsWith('The webpage') || error.message?.startsWith('Not enough readable')) {
      return res.status(422).json({ error: error.message })
    }
    return next(error)
  }
}
