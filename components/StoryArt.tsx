import type { Section } from "../lib/edition";

const TONES: Record<Section, [string, string]> = {
  India: ["#C98F5A", "#5E3220"],
  World: ["#7C8F86", "#26332F"],
  "Science & Technology": ["#D9B866", "#40321A"],
  Society: ["#B87355", "#3A2822"],
  "Beyond Earth": ["#3B4A63", "#0E121B"],
};

export default function StoryArt({ section, className = "" }: { section: Section; className?: string }) {
  const [a, b] = TONES[section];
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(145deg, ${a}, ${b})` }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 m-auto h-[90%] w-[90%] text-[#F3DCA0] opacity-45"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="50" cy="50" r="46" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="36" strokeWidth="0.6" strokeDasharray="1 3" />
        <circle cx="50" cy="50" r="22" strokeWidth="0.8" />
        <path d="M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z" fill="currentColor" fillOpacity="0.25" strokeWidth="0.6" />
        <path d="M20 20 L80 80 M80 20 L20 80" strokeWidth="0.5" />
        <circle cx="50" cy="50" r="3" fill="currentColor" />
      </svg>
    </div>
  );
}