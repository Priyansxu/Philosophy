"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"

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
      })
  }, [])

  if (!quotes.length) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const quote = quotes[index]
  const prev = () => setIndex((index - 1 + quotes.length) % quotes.length)
  const next = () => setIndex((index + 1) % quotes.length)

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center px-4 space-y-4">
          <p className="text-2xl md:text-3xl font-medium">"{quote.text}"</p>
          <p className="text-lg font-semibold text-gray-800">Author: {quote.author}</p>
          <p className="text-sm text-gray-500">Category: {quote.category}</p>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 py-12">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={next}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <span>Next</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </main>
  )
}