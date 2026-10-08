import { useState } from 'react'
import SummaryCard from '../components/SummaryCard.jsx'
import UrlForm from '../components/UrlForm.jsx'
import { summarizeUrl } from '../api/summaryApi.js'

const features = [
  { icon: '⌁', title: 'Just the essentials', text: 'Get the central ideas without the scroll.' },
  { icon: '◷', title: 'A little more time', text: 'Spend less time reading, more time thinking.' },
  { icon: '◎', title: 'Works with any link', text: 'Drop in a public article and get the gist.' },
]

export default function Home() {
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSummarize(url) {
    setError('')
    setSummary(null)
    setIsLoading(true)
    try {
      setSummary(await summarizeUrl(url))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Briefly home"><span className="brand-mark">b.</span> briefly</a>
        <span className="top-note"><span className="status-dot" /> YOUR READING, REIMAGINED</span>
      </header>

      <section className="hero">
        <div className="eyebrow"><span>✳</span> THE INTERNET, IN A NUTSHELL</div>
        <h1>Less reading.<br /><span>More knowing.</span></h1>
        <p className="hero-copy">Some links are worth opening. All of them are worth understanding.<br className="desktop-break" /> Get the good stuff, without the long scroll.</p>
        <UrlForm onSubmit={handleSummarize} isLoading={isLoading} />
        {error && <p className="error-message" role="alert">{error}</p>}
        <p className="privacy-note"><span aria-hidden="true">✦</span> Free to use · No account needed</p>
        <SummaryCard summary={summary} />
      </section>

      {!summary && !isLoading && (
        <section className="features" aria-label="How Briefly helps">
          {features.map((feature, index) => (
            <article className="feature" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-number">0{index + 1} /</div>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          ))}
        </section>
      )}
      <footer className="footer"><span>briefly<span className="footer-period">.</span></span><span>Make room for what matters.</span><span>© 2026</span></footer>
    </main>
  )
}
