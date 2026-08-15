import { Graticule } from "./Graticule";
import { Terrain } from "./Terrain";

export function HeroBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-ink" />
      <div
        className="az-drift absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 22% 78%, hsl(var(--accent-blue) / 0.28) 0%, transparent 65%)," +
            "radial-gradient(45% 40% at 78% 62%, hsl(var(--signal) / 0.10) 0%, transparent 70%)," +
            "radial-gradient(80% 60% at 50% 110%, hsl(var(--accent-blue) / 0.16) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, hsl(var(--ink)) 0%, hsl(var(--ink) / 0.35) 42%, hsl(var(--ink) / 0.85) 88%, hsl(var(--ink)) 100%)",
        }}
      />
      <Graticule />
      <Terrain />
    </div>
  );
}