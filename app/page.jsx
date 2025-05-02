"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"
import { Tangerine, Ibarra_Real_Nova } from "next/font/google"

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] })
const ibarraRealNova = Ibarra_Real_Nova({ subsets: ["latin"], weight: ["400", "700"] })

export default function QuotePage() {
  const [quotes, setQuotes] = useState([])
  const [index, setIndex] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)

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

        const randomIndex = Math.floor(Math.random() * allQuotes.length)
        setIndex(randomIndex)
      })
  }, [])

  if (!quotes.length || index === null) {
    return <div className="p-12 text-center">Take a breath...</div>
  }

  const quote = quotes[index]
  const prev = () => {
    setIndex((index - 1 + quotes.length) % quotes.length)
    setExplanation("")
  }
  const next = () => {
    setIndex((index + 1) % quotes.length)
    setExplanation("")
  }

  const explainQuote = async () => {
    setIsExplaining(true)
    setExplanation("")
    
    try {
      const response = await fetch("/api/explaination", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote: quote.text,
          author: quote.author,
          category: quote.category
        }),
      })
      
      const data = await response.json()
      setExplanation(data.explanation)
    } catch (error) {
      console.error("Error explaining quote:", error)
      setExplanation("Sorry, I couldn't generate an explanation at this time.")
    } finally {
      setIsExplaining(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center px-4 space-y-4">
          <p className={`text-xl md:text-3xl font-medium ${ibarraRealNova.className}`}>"{quote.text}"</p>
          <p className={`text-2xl md:text-3xl font-semibold text-gray-800 ${tangerine.className}`}>- {quote.author}</p>
          <p className="text-sm text-gray-500">{quote.category}</p>
          
          <div className="mt-8">
            <button
              onClick={explainQuote}
              disabled={isExplaining}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isExplaining ? (
                <span className="flex items-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Explaining...
                </span>
              ) : (
                "Explain this quote"
              )}
            </button>
          </div>
          
          {explanation && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-left">
              <h3 className="font-medium text-lg mb-2">Explanation:</h3>
              <p className="text-gray-700">{explanation}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 py-6">
        <button
          onClick={prev}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 hover:bg-gray-100 transition-colors rounded-l-xl"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
        </button>

        <button
          onClick={next}
          className="flex items-center gap-2 px-5 py-2 border border-gray-300 hover:bg-gray-100 transition-colors rounded-r-xl"
        >
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </main>
  )
}