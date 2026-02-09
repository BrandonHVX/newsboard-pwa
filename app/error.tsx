'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="mx-auto max-w-3xl p-6">
          <div className="rounded-3xl border hairline bg-white p-6 shadow-[0_12px_40px_rgba(0,0,0,0.06)]">
            <h1 className="font-serif text-2xl">Something went wrong</h1>
            <p className="mt-2 text-sm text-black/70">
              {error?.message || "Unknown error"}
            </p>
            <button
              onClick={() => reset()}
              className="mt-4 rounded-2xl bg-black px-4 py-2 text-sm font-semibold text-white"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
