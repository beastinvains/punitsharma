export function Textarea({ label, value, onChange, name, placeholder, rows = 8 }) {
  return (
    <label className="block">
      {label ? (
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
          {label}
        </span>
      ) : null}
      <textarea
        name={name}
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={onChange}
        className="mt-1 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-2 focus:ring-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-600 dark:focus:ring-slate-900"
      />
    </label>
  )
}

