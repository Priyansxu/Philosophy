"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Tangerine, Ibarra_Real_Nova } from "next/font/google";

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] });
const ibarraRealNova = Ibarra_Real_Nova({ subsets: ["latin"], weight: ["400", "700"] });

export default function QuotePage() {
  const [quotes, setQuotes] = useState([])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    fetch("/quotes.json")
      .then(res => res.json())
      .then(data => {
        const allQuotes = Object.entries(data.categories).flatMap(([categoryName, category]) => {
          return category.quotes.map(quote => ({
            ...quote,
            category: categoryName,
          }))
        })
        setQuotes(allQuotes)
        setIndex(Math.floor(Math.random() * allQuotes.length))
      })
  }, [])

  if (!quotes.length) {
    return <div className="p-12 text-center">Take a breath...</div>
  }

  const quote = quotes[index]
  const getRandomIndex = () => {
    let newIndex
    do {
      newIndex = Math.floor(Math.random() * quotes.length)
    } while (newIndex === index)
    setIndex(newIndex)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center px-4 space-y-4">
          <p className={`text-3xl md:text-5xl font-medium ${ibarraRealNova.className}`}>"{quote.text}"</p>
          <p className={`text-xl font-semibold text-gray-800 ${tangerine.className}`}>- {quote.author}</p>
          <p className="text-sm text-gray-500">{quote.category}</p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 py-6">
        <button
          onClick={getRandomIndex}
          className="flex items-center gap-2 px-5 py-2 border border-[2px] border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span> </span>
        </button>

        <button
          onClick={getRandomIndex}
          className="flex items-center gap-2 px-5 py-2 border border-[2px] border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <span> </span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  )
}