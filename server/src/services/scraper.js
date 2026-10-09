import { load } from 'cheerio'

export async function scrapeUrl(rawUrl) {
  let url
  try {
    url = new URL(rawUrl)
  } catch {
    throw new Error('Enter a valid URL.')
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('Only HTTP and HTTPS links are supported.')
  }

  if (url.username || url.password) {
    throw new Error('URLs containing credentials are not allowed.')
  }

  const hostname = url.hostname.toLowerCase()

  if (
    hostname === 'localhost' ||
    hostname.endsWith('.localhost') ||
    hostname.endsWith('.local')
  ) {
    throw new Error('That address is not publicly accessible.')
  }

  const response = await fetch(url, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
        '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    redirect: 'follow',
    signal: AbortSignal.timeout(15000),
  })

  if (!response.ok) {
    throw new Error('Failed to fetch the webpage.')
  }

  const contentType = response.headers.get('content-type') || ''
  if (!/text\/html|application\/xhtml\+xml/i.test(contentType)) {
    throw new Error('The URL must point to an HTML page.')
  }

  const html = await response.text()

  if (Buffer.byteLength(html, 'utf8') > 2 * 1024 * 1024) {
    throw new Error('The webpage is too large.')
  }

  const $ = load(html)

  $('script, style, noscript, nav, footer, header, aside, form, svg').remove()

  const title = $('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text() || url.hostname
  const candidates = [
    $('article').text(),
    $('[itemprop="articleBody"]').text(),
    $('main').text(),
    $('body').text(),
  ].map((candidate) => candidate.replace(/\s+/g, ' ').trim())

  const text = candidates.reduce((longest, candidate) => (candidate.length > longest.length ? candidate : longest), '')

  if (text.length < 120) {
    throw new Error('Not enough readable text found on this page.')
  }

  return {
    url: url.href,
    title: title.trim().slice(0, 300),
    text: text.slice(0, 30000),
    wordCount: text.split(/\s+/).length,
  }
}
