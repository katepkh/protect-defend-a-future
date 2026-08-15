export function Grain() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 opacity-[0.04]">
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        <filter id="az-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#az-grain)" />
      </svg>
    </div>
  );
}