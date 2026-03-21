export function formatDate(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' })
}

export function toExcerpt(text, maxChars = 140) {
  if (!text) return ''
  const s = String(text).replace(/\s+/g, ' ').trim()
  if (s.length <= maxChars) return s
  return s.slice(0, maxChars - 1).trimEnd() + '…'
}

