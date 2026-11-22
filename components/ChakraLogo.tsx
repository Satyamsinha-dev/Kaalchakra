export default function ChakraLogo({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={`${className} kc-spin-slow text-gold`}
      fill="none"
      stroke="currentColor"
    >
      <circle cx="50" cy="50" r="46" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="38" strokeWidth="1" />
      <circle cx="50" cy="50" r="22" strokeWidth="1" />
      <path d="M50 8 L56 44 L92 50 L56 56 L50 92 L44 56 L8 50 L44 44 Z" fill="currentColor" fillOpacity="0.35" strokeWidth="1" />
      <path d="M20 20 L80 80 M80 20 L20 80" strokeWidth="0.8" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
}