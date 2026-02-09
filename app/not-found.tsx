export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 md:px-6">
      <div className="rounded-3xl border hairline bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
        <h1 className="font-serif text-2xl">Not found</h1>
        <p className="mt-2 text-sm text-black/70">
          That page doesn&apos;t exist. Head back to <a className="underline underline-offset-4" href="/today">Today</a>.
        </p>
      </div>
    </div>
  );
}
