export function SectionLabel({ label }: { label: string; number?: string }) {
  return (
    <div className="mb-8 flex items-center gap-4 text-xs uppercase tracking-[0.4em] text-gold">
      <span className="h-px w-10 bg-gold/60" />
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}
