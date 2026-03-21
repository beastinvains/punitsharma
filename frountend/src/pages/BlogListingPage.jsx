import { useEffect, useState } from 'react'
import { apiFetchBlogs } from '../api/client'
import BlogCard from '../components/BlogCard'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'

export default function BlogListingPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const next = await apiFetchBlogs()
        if (!alive) return
        setBlogs(Array.isArray(next) ? next : [])
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Failed to load blogs.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    load()
    return () => {
      alive = false
    }
  }, [])

  return (
    <div className="space-y-5">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Blog
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Articles, experiments, and notes from my build process.
        </p>
      </div>

      {loading ? (
        <Spinner label="Loading blog posts..." />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : blogs.length === 0 ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">No posts found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b) => (
            <BlogCard key={b.id ?? b._id} blog={b} />
          ))}
        </div>
      )}
    </div>
  )
}

