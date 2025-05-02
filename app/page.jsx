"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, Loader2, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tangerine, Ibarra_Real_Nova } from "next/font/google"

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] })
const ibarraRealNova = Ibarra_Real_Nova({ subsets: ["latin"], weight: ["400", "700"] })

export default function QuotePage() {
  const [quotes, setQuotes] = useState([])
  const [index, setIndex] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

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
    setShowExplanation(false)
  }

  const next = () => {
    setIndex((index + 1) % quotes.length)
    setExplanation("")
    setShowExplanation(false)
  }

  const explainQuote = async () => {
    if (explanation) {
      setShowExplanation(prev => !prev)
      return
    }

    setIsExplaining(true)
    setExplanation("")
    setShowExplanation(true)

    try {
      const response = await fetch("/api/explanation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quote: quote.text,
          author: quote.author,
          category: quote.category,
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

          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className={`text-lg md:text-2xl font-medium ${ibarraRealNova.className}`}>"{quote.text}"</p>
              <p className={`text-xl md:text-2xl font-semibold text-gray-800 ${tangerine.className}`}>- {quote.author}</p>
              <p className="text-xs text-gray-500">{quote.category}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6">
            <button
              onClick={explainQuote}
              disabled={isExplaining}
              className="px-4 py-1.5 text-sm bg-warmGray-100 text-gray-800 rounded-md border border-warmGray-300 hover:bg-warmGray-200 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
            >
              {isExplaining ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Explaining...
                </>
              ) : (
                <>
                  {explanation
                    ? showExplanation ? "Hide Explanation" : "Show Explanation"
                    : "Explain this quote"}
                  <Lightbulb className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="min-h-[120px]">
            <AnimatePresence>
              {showExplanation && explanation && (
                <motion.div
                  key="explanation"
                  className="mt-5 p-4 bg-gray-50 rounded-md text-left"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-sm mb-1">Explanation:</h3>
                  <p className="text-sm text-gray-700">{explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 py-6 fixed bottom-2 inset-0">
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