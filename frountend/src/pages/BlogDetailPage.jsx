import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { apiFetchBlogById } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'
import { formatDate } from '../utils/format'

function MarkdownContent({ content }) {
  return (
    <div className="mt-6 max-w-3xl">
      <ReactMarkdown
        components={{
          p: ({ children }) => (
            <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">
              {children}
            </p>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md px-1 text-slate-900 underline underline-offset-4 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              {children}
            </a>
          ),
          h1: ({ children }) => (
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-7 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-6 text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {children}
            </h3>
          ),
          ul: ({ children }) => (
            <ul className="mt-4 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-200">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-4 list-decimal space-y-1 pl-5 text-slate-700 dark:text-slate-200">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="mt-5 rounded-xl border-l-4 border-slate-300 bg-slate-50 px-4 py-3 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200">
              {children}
            </blockquote>
          ),
          pre: ({ children }) => (
            <pre className="mt-6 overflow-x-auto rounded-xl bg-slate-900 p-4 text-sm text-slate-100 dark:bg-slate-950">
              {children}
            </pre>
          ),
          code: ({ children }) => (
            <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">
              {children}
            </code>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default function BlogDetailPage() {
  const { id } = useParams()
  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const next = await apiFetchBlogById(id)
        if (!alive) return
        setBlog(next)
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Failed to load blog post.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [id])

  const content = useMemo(() => blog?.content ?? blog?.markdown ?? '', [blog])

  return (
    <div>
      {loading ? (
        <Spinner label="Loading post..." />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : !blog ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">Post not found.</div>
      ) : (
        <article className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
          <header>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
              {blog?.title ?? 'Untitled'}
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {formatDate(blog?.date)}
            </p>
          </header>

          <MarkdownContent content={content} />
        </article>
      )}
    </div>
  )
}

