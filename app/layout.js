import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import TopNav from "@/components/TopNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MAT 306 — Computational Techniques",
  description: "Interactive molecular dynamics visualizations for MAT 306.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen selection:bg-primary/30 selection:text-primary-foreground`}
      >
        <TopNav />
        {/* pt-14 offsets the fixed nav bar height */}
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
