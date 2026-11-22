import type { Metadata } from "next";
import { Newsreader, Inter, Noto_Sans_Devanagari, Noto_Serif_Devanagari } from "next/font/google";
import IntroPortal from "../components/IntroPortal";
import { LanguageProvider } from "../components/LanguageProvider";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
});
const devanagariSerif = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari-serif",
});

export const metadata: Metadata = {
  title: "KAALCHAKRA · The Wheel of Time",
  description: "A fictional, AI-powered future newspaper. Choose any year.",
};

const bootScript = `try{var d=document.documentElement;if(localStorage.getItem("kc-theme")==="dark")d.dataset.theme="dark";if(!matchMedia("(prefers-reduced-motion: reduce)").matches)d.dataset.intro="1"}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${inter.variable} ${devanagari.variable} ${devanagariSerif.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <IntroPortal />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}