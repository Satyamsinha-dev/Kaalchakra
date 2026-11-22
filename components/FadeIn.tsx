"use client";

import { useEffect, useState } from "react";

export default function FadeIn({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      className={`${className} transition duration-700 ease-out motion-reduce:transition-none ${
        on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}