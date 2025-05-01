import React from "react";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const tangerine = Tangerine({ subsets: ["latin"] });

export const metadata = {
  title: "PhiloQuotes",
  description: "Explore philosophical quotes from the greatest thinkers throughout history",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${tangerine.className} bg-white text-black`}>
        <header className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-center">
              <h1 className="text-xl font-bold tracking-tight">
                <span className="text-black">Philo</span>
                <span className="text-gray-500">Quotes</span>
              </h1>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}