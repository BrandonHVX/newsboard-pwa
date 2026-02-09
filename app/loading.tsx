export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 rounded-xl bg-black/10" />
        <div className="h-12 rounded-3xl bg-black/10" />
        <div className="h-48 rounded-3xl bg-black/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-28 rounded-3xl bg-black/10" />
          <div className="h-28 rounded-3xl bg-black/10" />
          <div className="h-28 rounded-3xl bg-black/10" />
          <div className="h-28 rounded-3xl bg-black/10" />
        </div>
      </div>
    </div>
  );
}
