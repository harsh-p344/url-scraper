import { useState } from 'react'

export default function UrlForm({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onSubmit(url.trim())
  }

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="article-url">Article URL</label>
      <span className="url-icon" aria-hidden="true">↗</span>
      <input
        id="article-url"
        type="url"
        inputMode="url"
        placeholder="Paste an article link to get started…"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        required
      />
      <button type="submit" disabled={isLoading || !url.trim()}>
        {isLoading ? <><span className="spinner" /> Loading...</> : <>Summarize <span aria-hidden="true">→</span></>}
      </button>
    </form>
  )
}
