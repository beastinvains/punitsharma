import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl text-center">
      <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          404
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          That page doesn&apos;t exist.
        </p>
        <div className="mt-5">
          <Link
            to="/"
            className="inline-flex rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}

