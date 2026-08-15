export function Graticule({ className = "" }: { className?: string }) {
  const lines = [];
  for (let x = 0; x <= 1600; x += 80) {
    lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={900} />);
  }
  for (let y = 0; y <= 900; y += 80) {
    lines.push(<line key={`h${y}`} x1={0} y1={y} x2={1600} y2={y} />);
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g stroke="hsl(var(--muted-ink))" strokeWidth="0.5" opacity="0.09">
        {lines}
      </g>
      <g stroke="hsl(var(--accent-blue))" strokeWidth="0.8" opacity="0.16">
        <line x1="0" y1="620" x2="1600" y2="620" />
        <line x1="480" y1="0" x2="480" y2="900" />
      </g>
      <g fill="hsl(var(--muted-ink))" opacity="0.28" fontSize="9" fontFamily="Inter, sans-serif" letterSpacing="2">
        <text x="492" y="640">48°27′N</text>
        <text x="1360" y="612">35°02′E</text>
      </g>
    </svg>
  );
}