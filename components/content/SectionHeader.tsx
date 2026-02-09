export function SectionHeader({
  title,
  kicker,
  right,
}: {
  title: string;
  kicker?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          {kicker ? (
            <div className="text-2xs uppercase tracking-widest font-semibold text-accent mb-1">
              {kicker}
            </div>
          ) : null}
          <h1 className="font-serif text-3xl md:text-4xl font-medium">{title}</h1>
        </div>
        {right}
      </div>
      <div className="divider-double mt-4" />
    </div>
  );
}
