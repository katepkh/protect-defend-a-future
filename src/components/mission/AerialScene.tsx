import { useMemo } from "react";
import {
  SCENE,
  STRUCTURES,
  type Confidence,
  type Structure,
} from "@/lib/missions/sceneA";

const C = {
  ground: "hsl(var(--panel))",
  ground2: "hsl(var(--panel-2))",
  line: "hsl(var(--line))",
  ivory: "hsl(var(--ivory))",
  muted: "hsl(var(--muted-ink))",
  accent: "hsl(var(--accent-blue))",
  signal: "hsl(var(--signal))",
  verified: "hsl(var(--verified))",
  void: "hsl(var(--ink))",
};

/** Deterministic pseudo-random from a string seed — the frame never changes. */
function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

function collapsePoly(s: Structure) {
  const r = rng(s.id + "collapse");
  const pts: string[] = [];
  const cx = s.w * 0.5;
  const cy = s.h * 0.5;
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rad = 0.24 + r() * 0.2;
    pts.push(`${(cx + Math.cos(a) * s.w * rad).toFixed(1)},${(cy + Math.sin(a) * s.h * rad).toFixed(1)}`);
  }
  return pts.join(" ");
}

function debrisDots(s: Structure, count = 26, spread = 1.5) {
  const r = rng(s.id + "debris");
  return Array.from({ length: count }, (_, i) => {
    const a = r() * Math.PI * 2;
    const d = 0.35 + r() * spread;
    const round = (n: number) => Number(n.toFixed(2));
    return {
      key: i,
      cx: round(s.w / 2 + Math.cos(a) * s.w * 0.5 * d),
      cy: round(s.h / 2 + Math.sin(a) * s.h * 0.6 * d),
      r: round(0.5 + r() * 1.1),
      o: round(0.25 + r() * 0.45),
    };
  });
}

function StructureArt({ s }: { s: Structure }) {
  const darkRoof = s.damage === "dark-roof";
  return (
    <>
      {s.damage === "scorch" ? (
        <ellipse
          cx={s.w / 2}
          cy={s.h / 2}
          rx={s.w * 1.6}
          ry={s.h * 1.8}
          fill={`url(#scorch-${s.id})`}
        />
      ) : null}

      {s.damage === "shadow" ? (
        <polygon
          points={`${s.w * 0.62},0 ${s.w + 14},0 ${s.w + 20},${s.h} ${s.w * 0.7},${s.h}`}
          fill={C.void}
          opacity={0.5}
        />
      ) : null}

      <rect x={2.5} y={2.5} width={s.w} height={s.h} fill={C.void} opacity={0.55} />
      <rect
        x={0}
        y={0}
        width={s.w}
        height={s.h}
        fill={darkRoof ? C.void : C.muted}
        opacity={darkRoof ? 0.82 : 0.52}
      />
      <rect x={0} y={0} width={s.w} height={s.h} fill="none" stroke={C.muted} strokeWidth={0.8} opacity={0.55} />
      {/* roof detail */}
      <line x1={0} y1={s.h * 0.5} x2={s.w} y2={s.h * 0.5} stroke={C.ivory} strokeWidth={0.5} opacity={0.16} />
      <line x1={s.w * 0.5} y1={0} x2={s.w * 0.5} y2={s.h} stroke={C.ivory} strokeWidth={0.4} opacity={0.1} />
      <rect x={s.w * 0.12} y={s.h * 0.14} width={s.w * 0.16} height={s.h * 0.16} fill={C.ivory} opacity={0.12} />

      {s.damage === "collapse" ? (
        <>
          <polygon points={collapsePoly(s)} fill={C.void} opacity={0.97} />
          <polygon points={collapsePoly(s)} fill="none" stroke={C.void} strokeWidth={2.4} opacity={0.5} />
        </>
      ) : null}

      {(s.damage === "collapse" || s.damage === "debris") ? (
        <g>
          {debrisDots(s, s.damage === "debris" ? 34 : 20, s.damage === "debris" ? 1.9 : 1.2).map((d) => (
            <circle key={d.key} cx={d.cx} cy={d.cy} r={d.r} fill={C.ivory} opacity={d.o * 0.85} />
          ))}
        </g>
      ) : null}

      {s.damage === "debris" ? (
        <polygon
          points={`${s.w * 0.1},${s.h * 0.62} ${s.w * 0.46},${s.h * 0.5} ${s.w * 0.4},${s.h} ${s.w * 0.05},${s.h}`}
          fill={C.void}
          opacity={0.72}
        />
      ) : null}
    </>
  );
}

export type SceneMode = "brief" | "active" | "reveal";

export function AerialScene({
  mode,
  flags,
  onToggle,
  focusable = true,
  missed = [],
  falsePositives = [],
}: {
  mode: SceneMode;
  flags: { id: string; confidence: Confidence | null }[];
  onToggle?: (id: string) => void;
  focusable?: boolean;
  missed?: string[];
  falsePositives?: string[];
}) {
  const flagIndex = useMemo(() => {
    const m = new Map<string, number>();
    flags.forEach((f, i) => m.set(f.id, i + 1));
    return m;
  }, [flags]);

  const reveal = mode === "reveal";
  const interactive = mode === "active" && !!onToggle;

  return (
    <div className="relative overflow-hidden border border-line bg-ink">
      <svg
        viewBox={`0 0 ${SCENE.width} ${SCENE.height}`}
        className="block h-auto w-full select-none"
        role="group"
        aria-label="Synthetic top-down sensor frame of a settlement. Select structures you believe are damaged."
      >
        <defs>
          <linearGradient id="az-ground" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={C.ground} />
            <stop offset="55%" stopColor="hsl(var(--ink))" />
            <stop offset="100%" stopColor={C.ground} />
          </linearGradient>
          <linearGradient id="az-river" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--ink))" />
            <stop offset="100%" stopColor="hsl(var(--panel-2))" />
          </linearGradient>
          <pattern id="az-scan" width="4" height="4" patternUnits="userSpaceOnUse">
            <rect width="4" height="1" fill={C.ivory} opacity="0.028" />
          </pattern>
          <filter id="az-scene-grain" x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <radialGradient id="az-vignette" cx="50%" cy="50%" r="72%">
            <stop offset="55%" stopColor="hsl(var(--ink))" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(var(--ink))" stopOpacity="0.5" />
          </radialGradient>
          {STRUCTURES.filter((s) => s.damage === "scorch").map((s) => (
            <radialGradient key={s.id} id={`scorch-${s.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={C.void} stopOpacity="0.85" />
              <stop offset="55%" stopColor={C.void} stopOpacity="0.45" />
              <stop offset="100%" stopColor={C.void} stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>

        <rect width={SCENE.width} height={SCENE.height} fill="url(#az-ground)" />

        {/* field texture */}
        <g opacity="0.35">
          {Array.from({ length: 14 }, (_, i) => (
            <line
              key={i}
              x1={0}
              y1={i * 42}
              x2={SCENE.width}
              y2={i * 42 + 26}
              stroke={C.line}
              strokeWidth={0.4}
              opacity={0.35}
            />
          ))}
        </g>

        {/* river */}
        <path d={SCENE.river} stroke={C.muted} strokeWidth={SCENE.riverWidth + 8} fill="none" opacity={0.16} />
        <path d={SCENE.river} stroke="hsl(var(--ink))" strokeWidth={SCENE.riverWidth} fill="none" opacity={0.95} />
        <path d={SCENE.river} stroke={C.muted} strokeWidth={SCENE.riverWidth - 8} fill="none" opacity={0.12} />
        <path d={SCENE.river} stroke={C.ivory} strokeWidth={0.7} fill="none" opacity={0.12} strokeDasharray="60 30" />

        {/* rail line */}
        <g>
          <line x1={0} y1={SCENE.rail.y} x2={SCENE.width} y2={SCENE.rail.y} stroke={C.muted} strokeWidth={1.1} opacity={0.55} />
          <line x1={0} y1={SCENE.rail.y + 5} x2={SCENE.width} y2={SCENE.rail.y + 5} stroke={C.muted} strokeWidth={1.1} opacity={0.55} />
          {Array.from({ length: 60 }, (_, i) => (
            <line
              key={i}
              x1={i * 15}
              y1={SCENE.rail.y - 2}
              x2={i * 15}
              y2={SCENE.rail.y + 9}
              stroke={C.muted}
              strokeWidth={0.8}
              opacity={0.3}
            />
          ))}
        </g>

        {/* roads */}
        <g>
          {SCENE.roads.map((d) => (
            <g key={d}>
              <path d={d} stroke={C.line} strokeWidth={7} fill="none" opacity={0.5} />
              <path d={d} stroke={C.muted} strokeWidth={0.6} fill="none" opacity={0.3} strokeDasharray="10 12" />
            </g>
          ))}
          {/* bridge road, with one severed span */}
          <path d={SCENE.bridgeRoad} stroke={C.line} strokeWidth={8} fill="none" opacity={0.55} />
          <path
            d={SCENE.bridgeRoad}
            stroke={C.muted}
            strokeWidth={0.6}
            fill="none"
            opacity={0.3}
            strokeDasharray="10 12"
          />
          {/* severed span: mask out a portion of the deck and drop the debris in */}
          <g transform="translate(384 250) rotate(45)">
            <rect x={-18} y={-6} width={36} height={12} fill="hsl(var(--ink))" />
            <polygon points="-16,-5 -2,-5 -6,7 -18,4" fill={C.line} opacity={0.85} />
            <polygon points="4,-5 16,-5 17,6 6,8" fill={C.line} opacity={0.7} />
            <circle cx={-1} cy={9} r={1.4} fill={C.ivory} opacity={0.25} />
            <circle cx={5} cy={12} r={1} fill={C.ivory} opacity={0.2} />
          </g>
        </g>

        {/* electrical substation compound */}
        <g>
          <rect
            x={SCENE.substation.x}
            y={SCENE.substation.y}
            width={SCENE.substation.w}
            height={SCENE.substation.h}
            fill="hsl(var(--ink))"
            stroke={C.line}
            strokeWidth={1}
            opacity={0.9}
          />
          <rect
            x={SCENE.substation.x + 5}
            y={SCENE.substation.y + 5}
            width={SCENE.substation.w - 10}
            height={SCENE.substation.h - 10}
            fill="none"
            stroke={C.muted}
            strokeWidth={0.5}
            strokeDasharray="3 4"
            opacity={0.4}
          />
          {Array.from({ length: 3 }, (_, i) => (
            <rect
              key={i}
              x={SCENE.substation.x + 14 + i * 30}
              y={SCENE.substation.y + 20}
              width={20}
              height={34}
              fill={C.ground2}
              stroke={C.line}
              strokeWidth={0.7}
            />
          ))}
          {Array.from({ length: 4 }, (_, i) => (
            <line
              key={i}
              x1={SCENE.substation.x - 40}
              y1={SCENE.substation.y + 12 + i * 6}
              x2={SCENE.substation.x}
              y2={SCENE.substation.y + 16 + i * 6}
              stroke={C.muted}
              strokeWidth={0.4}
              opacity={0.35}
            />
          ))}
        </g>

        {/* structures */}
        <g>
          {STRUCTURES.map((s) => {
            const idx = flagIndex.get(s.id);
            const flagged = idx !== undefined;
            return (
              <g key={s.id} transform={`translate(${s.x} ${s.y}) rotate(${s.rot} ${s.w / 2} ${s.h / 2})`}>
                <StructureArt s={s} />

                {reveal ? (
                  <rect
                    x={-4}
                    y={-4}
                    width={s.w + 8}
                    height={s.h + 8}
                    fill="none"
                    strokeWidth={1.4}
                    stroke={
                      missed.includes(s.id)
                        ? C.signal
                        : falsePositives.includes(s.id)
                          ? C.muted
                          : s.truth === "damaged"
                            ? C.verified
                            : "none"
                    }
                    strokeDasharray={falsePositives.includes(s.id) ? "4 4" : undefined}
                    opacity={0.95}
                  />
                ) : null}

                {flagged ? (
                  <g>
                    <rect
                      x={-5}
                      y={-5}
                      width={s.w + 10}
                      height={s.h + 10}
                      fill="none"
                      stroke={C.accent}
                      strokeWidth={1}
                    />
                    <line x1={-5} y1={-5} x2={2} y2={-5} stroke={C.accent} strokeWidth={2.2} />
                    <line x1={-5} y1={-5} x2={-5} y2={2} stroke={C.accent} strokeWidth={2.2} />
                    <text
                      x={s.w + 9}
                      y={-7}
                      fontSize={11}
                      fill={C.accent}
                      fontFamily="var(--font-display)"
                    >
                      {idx}
                    </text>
                  </g>
                ) : null}

                {interactive ? (
                  <rect
                    x={-6}
                    y={-6}
                    width={s.w + 12}
                    height={s.h + 12}
                    fill="transparent"
                    className="cursor-crosshair outline-offset-2 hover:fill-[hsl(var(--accent-blue)/0.10)]"
                    tabIndex={focusable ? 0 : -1}
                    role="button"
                    aria-pressed={flagged}
                    aria-label={`${s.label}${flagged ? ", flagged" : ""}`}
                    onClick={() => onToggle?.(s.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onToggle?.(s.id);
                      }
                    }}
                  />
                ) : null}
              </g>
            );
          })}
        </g>

        <rect width={SCENE.width} height={SCENE.height} fill="url(#az-scan)" pointerEvents="none" />
        <rect width={SCENE.width} height={SCENE.height} fill="url(#az-vignette)" pointerEvents="none" />
        <rect
          width={SCENE.width}
          height={SCENE.height}
          filter="url(#az-scene-grain)"
          opacity={0.07}
          pointerEvents="none"
          style={{ mixBlendMode: "overlay" }}
        />

        {/* frame furniture */}
        <g pointerEvents="none" opacity={0.5} fontFamily="var(--font-sans)" fontSize={9} fill={C.muted}>
          <text x={14} y={SCENE.height - 14}>{SCENE.grid}</text>
          <text x={SCENE.width - 14} y={SCENE.height - 14} textAnchor="end">
            SYNTHETIC · NOT OPERATIONAL
          </text>
          <path d={`M14 ${SCENE.height - 34} h 60`} stroke={C.muted} strokeWidth={0.8} />
          <text x={14} y={SCENE.height - 42}>200 m</text>
        </g>
      </svg>
    </div>
  );
}
