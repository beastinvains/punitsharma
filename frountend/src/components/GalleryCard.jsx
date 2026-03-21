export default function GalleryCard({ item }) {
  const id = item?.id ?? item?._id
  const title = item?.title ?? 'Untitled'
  const description = item?.description ?? ''
  const imageUrl =
    item?.imageUrl ??
    item?.image ??
    item?.thumbnailUrl ??
    item?.image?.url ??
    item?.fileUrl ??
    null

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-950">
      {imageUrl ? (
        <div className="aspect-[16/10] w-full overflow-hidden bg-slate-100 dark:bg-slate-900">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-slate-100 dark:bg-slate-900" />
      )}

      <div className="p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        {description ? (
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {description}
          </p>
        ) : null}
        {id ? (
          <div className="mt-4 text-[11px] text-slate-500 dark:text-slate-400">
            ID: {String(id).slice(0, 8)}
          </div>
        ) : null}
      </div>
    </article>
  )
}

