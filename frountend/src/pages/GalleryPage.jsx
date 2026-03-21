import { useEffect, useState } from 'react'
import { apiFetchGalleryItems } from '../api/client'
import GalleryCard from '../components/GalleryCard'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let alive = true
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const next = await apiFetchGalleryItems()
        if (!alive) return
        setItems(Array.isArray(next) ? next : [])
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Failed to load gallery.')
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
          Gallery
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Projects and achievements. Updated as I ship.
        </p>
      </div>

      {loading ? (
        <Spinner label="Loading gallery items..." />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : items.length === 0 ? (
        <div className="text-sm text-slate-600 dark:text-slate-300">No items found.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.id ?? item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

