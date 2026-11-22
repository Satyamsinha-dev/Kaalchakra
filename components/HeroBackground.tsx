"use client";

import { useEffect, useRef } from "react";

export default function HeroBackground({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sirf mouse wale devices pe, aur reduce-motion off ho tab
    const fine = window.matchMedia("(pointer: fine)").matches;
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = ref.current;
    if (!fine || calm || !el) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        el.style.transform = `translate3d(${(-x * 14).toFixed(1)}px, ${(-y * 10).toFixed(1)}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 bg-cover bg-no-repeat bg-[position:70%_center] transition-transform duration-300 ease-out will-change-transform"
      style={{ backgroundImage: `url('${src}')`, transform: "scale(1.06)" }}
    />
  );
}