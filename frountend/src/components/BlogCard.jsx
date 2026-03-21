import { Link } from 'react-router-dom'
import { formatDate, toExcerpt } from '../utils/format'

export default function BlogCard({ blog }) {
  const id = blog?.id ?? blog?._id
  const title = blog?.title ?? 'Untitled'
  const description = blog?.description ?? blog?.summary ?? blog?.content

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
          {formatDate(blog?.date)}
        </p>
      </div>

      <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {toExcerpt(description, 170)}
      </p>

      <div className="mt-4">
        <Link
          to={`/blog/${id}`}
          className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Read
          <span aria-hidden="true" className="text-base leading-none">
            →
          </span>
        </Link>
      </div>
    </article>
  )
}

