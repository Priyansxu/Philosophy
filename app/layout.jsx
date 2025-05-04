import React from "react";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata = {
  title: 'Philosophy Quotes',
  description: 'Discover timeless philosophy quotes from Socrates, Plato, Nietzsche, and other great thinkers. Curated for deep thinkers and lovers of wisdom.',
  keywords: 'philosophy quotes, wisdom, socrates, plato, nietzsche, stoicism, deep quotes, ancient philosophy, thinkers, inspirational quotes',
  metadataBase: new URL("https://philosophy.zone.id"),
  openGraph: {
    title: 'Philosophy Quotes',
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
    description: 'Discover timeless philosophy quotes from history&aposs greatest minds.',
    images: ['https://philosophy.zone.id/icon.svg'],
  },
  alternates: {
    canonical: 'https://philosophy.zone.id',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} transition-colors duration-300`}>
        {children}
      </body>
    </html>
  );
}