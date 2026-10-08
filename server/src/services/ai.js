function collectText(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectText)
  if (!value || typeof value !== 'object') return []

  if (typeof value.text === 'string') return [value.text]
  return collectText(value.content || value.parts || value.outputs || value.output)
}

export async function summarizeText(text) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    const error = new Error('Gemini is not configured. Add GEMINI_API_KEY to server/.env and restart the backend.')
    error.statusCode = 503
    throw error
  }

  const model = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite'
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      input: `Summarize the following article in 3 to 5 concise sentences. Preserve its main claims and useful specifics. Do not add facts or commentary.\n\nARTICLE:\n${text}`,
    }),
    signal: AbortSignal.timeout(30_000),
  })

  if (!response.ok) {
    const details = await response.json().catch(() => ({}))
    console.error('Gemini request failed:', response.status, details.error?.message || response.statusText)
    const error = new Error('Gemini could not summarize this article. Check the server API key and try again.')
    error.statusCode = response.status === 429 ? 503 : 502
    throw error
  }

  const result = await response.json()
  const modelOutputSteps = result.steps?.filter((step) => step.type === 'model_output') || []
  const summary = collectText(
    result.output_text ||
    (modelOutputSteps.length ? modelOutputSteps : result.outputs || result.output || result.candidates || result.steps),
  ).join('\n').trim()
  if (!summary) throw new Error('The summary service returned an empty result.')
  return summary
}
