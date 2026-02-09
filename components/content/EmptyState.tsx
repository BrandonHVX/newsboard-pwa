export function EmptyState({
  title,
  message,
  hint,
}: {
  title: string;
  message?: string;
  hint?: string;
}) {
  return (
    <div className="rounded border border-border-light bg-white p-6 shadow-card">
      <h2 className="font-serif text-xl">{title}</h2>
      {message ? <p className="mt-2 text-sm text-secondary">{message}</p> : null}
      {hint ? (
        <pre className="mt-4 whitespace-pre-wrap rounded bg-bg-secondary p-4 text-xs text-secondary">
          {hint}
        </pre>
      ) : null}
    </div>
  );
}
