export function SampleNote({ children }: { children: string }) {
  return (
    <p
      className="glass-chip mt-6 inline-flex max-w-2xl rounded-full px-3.5 py-1.5 text-xs font-medium leading-relaxed text-muted"
      data-sample-note
    >
      {children}
    </p>
  );
}
