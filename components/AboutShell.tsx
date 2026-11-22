import FadeIn from "./FadeIn";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export default function AboutShell({
  overlay = "bg-ivory/40",
  children,
}: {
  overlay?: string;
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-ivory">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/timeline-bg.jpg')" }}
      />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-6 md:px-14">
        <SiteHeader />
        <FadeIn className="flex flex-1 flex-col py-12 md:py-16">{children}</FadeIn>
        <SiteFooter />
      </div>
    </main>
  );
}