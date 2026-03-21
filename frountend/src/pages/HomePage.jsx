import { useEffect, useMemo, useState } from 'react'
import { apiFetchBlogs, apiFetchGalleryItems } from '../api/client'
import { profile } from '../config/profile'
import BlogCard from '../components/BlogCard'
import GalleryCard from '../components/GalleryCard'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const [blogs, setBlogs] = useState([])
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        const [nextBlogs, nextGallery] = await Promise.all([
          apiFetchBlogs(),
          apiFetchGalleryItems(),
        ])

        if (!alive) return
        setBlogs(Array.isArray(nextBlogs) ? nextBlogs : [])
        setGallery(Array.isArray(nextGallery) ? nextGallery : [])
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Failed to load content.')
      } finally {
        if (alive) setLoading(false)
      }
    }

    load()
    return () => {
      alive = false
    }
  }, [])

  const featuredBlogs = useMemo(() => blogs.slice(0, 4), [blogs])
  const featuredProjects = useMemo(() => gallery.slice(0, 6), [gallery])

  return (
    <div className="space-y-10">
      <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xl">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
              {profile.bio}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
{profile.skills.map((s, index) => (
  <span
    key={index} // Using index is a safe fallback
    className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
  >
    {s}
  </span>
))}
            </div>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
            <Link
              to="/blog"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
            >
              View Blog
            </Link>
            <Link
              to="/gallery"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900"
            >
              Explore Projects
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Featured Blogs
          </h2>
          <Link to="/blog" className="text-sm text-slate-600 hover:underline dark:text-slate-300">
            See all
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading blog posts..." />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : blogs.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            No blog posts yet.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredBlogs.map((b) => (
              <BlogCard key={b.id ?? b._id} blog={b} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Featured Projects
          </h2>
          <Link
            to="/gallery"
            className="text-sm text-slate-600 hover:underline dark:text-slate-300"
          >
            See all
          </Link>
        </div>

        {loading ? (
          <Spinner label="Loading projects..." />
        ) : error ? (
          <ErrorAlert message={error} />
        ) : gallery.length === 0 ? (
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-300">
            No gallery items yet.
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((item) => (
              <GalleryCard key={item.id ?? item._id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

