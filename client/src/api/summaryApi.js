export async function summarizeUrl(url) {
  let response
  try {
    response = await fetch('/api/summaries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
  } catch {
    throw new Error('Cannot reach the API. Make sure the backend is running on port 5000, then try again.')
  }

  const result = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(result.error || 'Could not summarize that page. Please try another URL.')
  }

  return result
}
