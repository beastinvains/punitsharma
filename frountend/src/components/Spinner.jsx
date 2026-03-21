export default function Spinner({ label = 'Loading...', inline = false }) {
  if (inline) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-slate-100">
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-200"
        />
        <span>{label}</span>
      </span>
    )
  }

  return (
    <div className="flex items-center justify-center gap-3 py-10">
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900 dark:border-slate-600 dark:border-t-slate-200"
      />
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
    </div>
  )
}

