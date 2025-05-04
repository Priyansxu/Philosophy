import React from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: 'Philosophy Quotes | Timeless Wisdom',
  description: 'Discover timeless philosophy quotes from Socrates, Plato, Nietzsche, and other great thinkers. Curated for deep thinkers and lovers of wisdom.',
  keywords: 'philosophy quotes, wisdom, socrates, plato, nietzsche, stoicism, deep quotes, ancient philosophy, thinkers, inspirational quotes',
  metadataBase: new URL("https://philosophy.zone.id"),
  openGraph: {
    title: 'Philosophy Quotes | Timeless Wisdom',
    description: 'Discover timeless philosophy quotes from Socrates, Plato, Nietzsche, and more.',
    url: 'https://philosophy.zone.id',
    siteName: 'Philosophy Quotes',
    images: [
      {
        url: 'https://philosophy.zone.id/icon.svg',
        width: 1080,
        height: 1080,
        alt: 'Philosophy Quotes',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Philosophy Quotes | Timeless Wisdom',
    description: 'Discover timeless philosophy quotes from history's greatest minds.',
    images: ['https://philosophy.zone.id/icon.svg'],
  },
  alternates: {
    canonical: 'https://philosophy.zone.id',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark:bg-slate-950">
      <body className={`${montserrat.className} bg-white text-black dark:bg-slate-950 dark:text-slate-100`}>
        <header className="border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-300">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-center">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-black opacity-75 dark:text-slate-100">Philosophy</span>
                <span className="text-gray-500 dark:text-slate-400"> Quotes</span>
              </h1>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}