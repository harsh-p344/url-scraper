export default function SummaryCard({ summary }) {
  if (!summary) return null

  return (
    <article className="summary-card" aria-live="polite">
      <div className="summary-meta">
        <span className="summary-badge"><span /> SUMMARY READY</span>
        <span>{summary.readingTime || 'Quick read'}</span>
      </div>
      <h2>{summary.title || 'Your article, in brief'}</h2>
      <p className="summary-text">{summary.summary}</p>
      <div className="card-footer">
        <a href={summary.url} target="_blank" rel="noreferrer">
          View original article <span aria-hidden="true">↗</span>
        </a>
        <span>{summary.wordCount ? `${summary.wordCount.toLocaleString()} words analyzed` : 'Made for a faster read'}</span>
      </div>
    </article>
  )
}
