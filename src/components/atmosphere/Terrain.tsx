function ridge(y: number, amp: number, seed: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 1600; x += 100) {
    const h = y - Math.abs(Math.sin((x + seed) / 260)) * amp - Math.sin((x + seed) / 90) * amp * 0.3;
    d += ` L${x} ${h.toFixed(1)}`;
  }
  return `${d} L1600 900 L0 900 Z`;
}

function contour(y: number, amp: number, seed: number) {
  let d = `M0 ${y}`;
  for (let x = 0; x <= 1600; x += 60) {
    const h = y + Math.sin((x + seed) / 180) * amp + Math.cos((x + seed) / 70) * amp * 0.35;
    d += ` L${x} ${h.toFixed(1)}`;
  }
  return d;
}

export function Terrain({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <g stroke="hsl(var(--accent-blue))" fill="none" strokeWidth="0.7" opacity="0.13">
        {Array.from({ length: 14 }, (_, i) => (
          <path key={i} d={contour(300 + i * 34, 16 + i * 2, i * 130)} />
        ))}
      </g>
      <path d={ridge(760, 110, 0)} fill="hsl(var(--panel))" opacity="0.75" />
      <path d={ridge(820, 80, 640)} fill="hsl(var(--panel-2))" opacity="0.7" />
      <path d={ridge(880, 60, 1220)} fill="hsl(var(--ink))" opacity="0.92" />
    </svg>
  );
}