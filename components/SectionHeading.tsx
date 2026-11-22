import Rule from "./Rule";

export default function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-4 text-xs uppercase tracking-[0.3em] text-terracotta">
      <span className="whitespace-nowrap">{children}</span>
      <Rule />
    </div>
  );
}