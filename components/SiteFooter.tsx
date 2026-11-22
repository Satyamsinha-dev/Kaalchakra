import Link from "next/link";
import T from "./T";

const GITHUB = "https://github.com/Satyamsinha-dev";
const LINKEDIN = "https://linkedin.com/in/satyamsinha-dev/";

export default function SiteFooter() {
  const link = "underline-offset-4 hover:text-terracotta hover:underline";
  return (
    <footer className="pb-2 text-xs text-ink/60">
      <nav className="mb-2 flex flex-wrap gap-x-4 gap-y-1 uppercase tracking-widest">
        <Link href="/about" className={link}><T k="nav.about" /></Link>
        <a href={GITHUB} target="_blank" rel="noopener noreferrer" className={link}>GitHub</a>
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className={link}>LinkedIn</a>
        <Link href="/about/vision#disclaimer" className={link}><T k="footer.disclaimerLink" /></Link>
      </nav>
      <p><T k="disclaimer.short" /></p>
    </footer>
  );
}