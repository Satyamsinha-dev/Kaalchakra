// Pure CSS particles: browser mein koi JavaScript nahi chalti, to almost free hai.
const rnd = (i: number, k: number) => {
  const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const DUST = Array.from({ length: 28 }, (_, i) => ({
  left: (rnd(i, 1) * 100).toFixed(2),
  top: (40 + rnd(i, 2) * 60).toFixed(2),
  size: (2 + rnd(i, 3) * 4).toFixed(2),
  dur: (9 + rnd(i, 4) * 10).toFixed(2),
  delay: (-rnd(i, 5) * 15).toFixed(2),
  dx: ((rnd(i, 6) - 0.5) * 80).toFixed(2),
}));

export default function GoldDust() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {DUST.map((d, i) => (
        <span
          key={i}
          className="kc-dust"
          style={
            {
              left: `${d.left}%`,
              top: `${d.top}%`,
              width: `${d.size}px`,
              height: `${d.size}px`,
              "--dur": `${d.dur}s`,
              "--delay": `${d.delay}s`,
              "--dx": `${d.dx}px`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}