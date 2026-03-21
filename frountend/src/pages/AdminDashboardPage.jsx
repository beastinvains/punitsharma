import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthContext'
import {
  apiCreateBlog,
  apiDeleteBlog,
  apiFetchBlogs,
  apiFetchGalleryItems,
  apiCreateGalleryItem,
  apiUpdateBlog,
  apiUpdateGalleryItem,
  apiDeleteGalleryItem,
} from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import Spinner from '../components/Spinner'
import { Button } from '../components/forms/Button'
import { TextInput } from '../components/forms/TextInput'
import GalleryCard from '../components/GalleryCard'
import { formatDate } from '../utils/format'

function getId(item) {
  return item?.id ?? item?._id ?? null
}

function toDateInputValue(value) {
  if (!value) return ''
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return String(value)
  // YYYY-MM-DD
  return d.toISOString().slice(0, 10)
}

export default function AdminDashboardPage() {
  const { token, isAuthenticated } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [tab, setTab] = useState('blogs') // 'blogs' | 'gallery'
  const [blogs, setBlogs] = useState([])
  const [gallery, setGallery] = useState([])

  const [saving, setSaving] = useState(false)

  const [blogForm, setBlogForm] = useState({
    title: '',
    description: '',
    date: '',
    content: '',
  })
  const [editingBlogId, setEditingBlogId] = useState(null)

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
  })
  const [galleryImageFile, setGalleryImageFile] = useState(null)
  const [editingGalleryId, setEditingGalleryId] = useState(null)

  const loadAll = async () => {
    setError(null)
    const [nextBlogs, nextGallery] = await Promise.all([
      apiFetchBlogs(token),
      apiFetchGalleryItems(token),
    ])
    setBlogs(Array.isArray(nextBlogs) ? nextBlogs : [])
    setGallery(Array.isArray(nextGallery) ? nextGallery : [])
  }

  useEffect(() => {
    let alive = true
    async function run() {
      try {
        setLoading(true)
        if (!isAuthenticated) return
        await loadAll()
        if (!alive) return
      } catch (e) {
        if (!alive) return
        setError(e?.message || 'Failed to load admin data.')
      } finally {
        if (alive) setLoading(false)
      }
    }
    run()
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const resetBlogForm = () => {
    setEditingBlogId(null)
    setBlogForm({ title: '', description: '', date: '', content: '' })
  }

  const onStartEditBlog = (blog) => {
    const id = getId(blog)
    if (!id) return
    setEditingBlogId(id)
    setBlogForm({
      title: blog?.title ?? '',
      description: blog?.description ?? '',
      date: toDateInputValue(blog?.date),
      content: blog?.content ?? blog?.markdown ?? '',
    })
  }

  const onSubmitBlog = async (e) => {
    e.preventDefault()
    if (!token) return

    setSaving(true)
    setError(null)
    try {
      if (editingBlogId) {
        await apiUpdateBlog(editingBlogId, blogForm, token)
      } else {
        await apiCreateBlog(blogForm, token)
      }
      await loadAll()
      resetBlogForm()
    } catch (e2) {
      setError(e2?.message || 'Failed to save blog.')
    } finally {
      setSaving(false)
    }
  }

  const onDeleteBlog = async (id) => {
    if (!token) return
    const ok = window.confirm('Delete this blog post?')
    if (!ok) return
    setSaving(true)
    setError(null)
    try {
      await apiDeleteBlog(id, token)
      await loadAll()
      if (editingBlogId === id) resetBlogForm()
    } catch (e2) {
      setError(e2?.message || 'Failed to delete blog.')
    } finally {
      setSaving(false)
    }
  }

  const onStartEditGallery = (item) => {
    const id = getId(item)
    if (!id) return
    setEditingGalleryId(id)
    setGalleryForm({
      title: item?.title ?? '',
      description: item?.description ?? '',
    })
    setGalleryImageFile(null) // keep existing unless user chooses a replacement
  }

  const onSubmitGallery = async (e) => {
    e.preventDefault()
    if (!token) return
    setSaving(true)
    setError(null)

    try {
      if (editingGalleryId) {
        await apiUpdateGalleryItem(
          editingGalleryId,
          { ...galleryForm, imageFile: galleryImageFile },
          token,
        )
      } else {
        await apiCreateGalleryItem(
          { ...galleryForm, imageFile: galleryImageFile },
          token,
        )
      }

      await loadAll()
      setEditingGalleryId(null)
      setGalleryImageFile(null)
      setGalleryForm({ title: '', description: '' })
    } catch (e2) {
      setError(e2?.message || 'Failed to save gallery item.')
    } finally {
      setSaving(false)
    }
  }

  const onDeleteGallery = async (id) => {
    if (!token) return
    const ok = window.confirm('Delete this gallery item?')
    if (!ok) return
    setSaving(true)
    setError(null)
    try {
      await apiDeleteGalleryItem(id, token)
      await loadAll()
      if (editingGalleryId === id) {
        setEditingGalleryId(null)
        setGalleryImageFile(null)
        setGalleryForm({ title: '', description: '' })
      }
    } catch (e2) {
      setError(e2?.message || 'Failed to delete gallery item.')
    } finally {
      setSaving(false)
    }
  }

  const blogList = useMemo(() => blogs ?? [], [blogs])
  const galleryList = useMemo(() => gallery ?? [], [gallery])

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Manage blogs and gallery items. All API calls use your login token.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setTab('blogs')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'blogs'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          Blogs
        </button>
        <button
          type="button"
          onClick={() => setTab('gallery')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === 'gallery'
              ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
              : 'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:hover:bg-slate-900'
          }`}
        >
          Gallery
        </button>
      </div>

      {loading ? (
        <Spinner label="Loading admin data..." />
      ) : error ? (
        <ErrorAlert message={error} />
      ) : null}

      {tab === 'blogs' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {editingBlogId ? 'Edit Blog' : 'Create New Blog'}
            </h2>

            <form onSubmit={onSubmitBlog} className="mt-4 space-y-4">
              <TextInput
                label="Title"
                name="title"
                value={blogForm.title}
                onChange={(e) => setBlogForm((v) => ({ ...v, title: e.target.value }))}
                placeholder="e.g. Building a Full-Stack Blog"
              />

              <TextInput
                label="Short Description"
                name="description"
                value={blogForm.description}
                onChange={(e) =>
                  setBlogForm((v) => ({ ...v, description: e.target.value }))
                }
                placeholder="A one-liner summary for blog cards."
              />

              <TextInput
                label="Date"
                name="date"
                type="date"
                value={blogForm.date}
                onChange={(e) => setBlogForm((v) => ({ ...v, date: e.target.value }))}
              />

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Content (Markdown)
                </span>
                <textarea
                  name="content"
                  value={blogForm.content}
                  onChange={(e) =>
                    setBlogForm((v) => ({ ...v, content: e.target.value }))
                  }
                  rows={10}
                  className="mt-1 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-900"
                  placeholder="Write markdown here..."
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={saving} variant="primary">
                  {saving ? 'Saving...' : editingBlogId ? 'Update Blog' : 'Create Blog'}
                </Button>
                {editingBlogId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={saving}
                    onClick={resetBlogForm}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Existing Posts
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {blogList.length} total
              </div>
            </div>

            {blogList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                No blog posts yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {blogList.map((b, idx) => {
                  const id = getId(b)
                  return (
                    <div
                      key={id ?? idx}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {b?.title ?? 'Untitled'}
                          </div>
                          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            {formatDate(b?.date)}
                          </div>
                          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                            {b?.description ?? ''}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={saving}
                            onClick={() => onStartEditBlog(b)}
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={saving}
                            onClick={() => onDeleteBlog(id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      ) : null}

      {tab === 'gallery' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {editingGalleryId ? 'Edit Gallery Item' : 'Upload New Gallery Item'}
            </h2>

            <form onSubmit={onSubmitGallery} className="mt-4 space-y-4">
              <TextInput
                label="Title"
                name="gallery-title"
                value={galleryForm.title}
                onChange={(e) =>
                  setGalleryForm((v) => ({ ...v, title: e.target.value }))
                }
                placeholder="e.g. Portfolio Website"
              />

              <TextInput
                label="Description"
                name="gallery-description"
                value={galleryForm.description}
                onChange={(e) =>
                  setGalleryForm((v) => ({ ...v, description: e.target.value }))
                }
                placeholder="What you built / achievement context"
              />

              <label className="block">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Image {editingGalleryId ? '(optional)' : '(required)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setGalleryImageFile(e.target.files?.[0] ?? null)}
                  className="mt-1 block w-full text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-slate-900 hover:file:bg-slate-200 dark:text-slate-200 dark:file:bg-slate-900 dark:file:text-slate-100"
                />
              </label>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button type="submit" disabled={saving} variant="primary">
                  {saving ? 'Saving...' : editingGalleryId ? 'Update Item' : 'Upload Item'}
                </Button>
                {editingGalleryId ? (
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={saving}
                    onClick={() => {
                      setEditingGalleryId(null)
                      setGalleryImageFile(null)
                      setGalleryForm({ title: '', description: '' })
                    }}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div>
            </form>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Gallery Items
              </h2>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {galleryList.length} total
              </div>
            </div>

            {galleryList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                No gallery items yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {galleryList.map((item, idx) => {
                  const id = getId(item)
                  return (
                    <div
                      key={id ?? idx}
                      className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                    >
                      <GalleryCard item={item} />
                      <div className="mt-3 flex gap-2">
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={saving}
                          onClick={() => onStartEditGallery(item)}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={saving}
                          onClick={() => onDeleteGallery(id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </div>
  )
}

