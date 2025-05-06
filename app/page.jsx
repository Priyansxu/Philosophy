"use client"

import Head from "next/head";
import { useEffect, useState, useRef } from "react"
import { ArrowLeft, ArrowRight, Loader2, Lightbulb, Heart, Search, Share2, X, Moon, Sun, BookOpen, ChevronDown, Home } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tangerine, Ibarra_Real_Nova } from "next/font/google"

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] })
const ibarraRealNova = Ibarra_Real_Nova({ subsets: ["latin"], weight: ["400", "700"] })

export default function QuotePage() {
  const [quotes, setQuotes] = useState([])
  const [allQuotes, setAllQuotes] = useState([])
  const [index, setIndex] = useState(null)
  const [previousIndices, setPreviousIndices] = useState([]) // Store previous indices for navigation
  const [explanation, setExplanation] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [saved, setSaved] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const dropdownRef = useRef(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load saved quotes from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    }

    const savedQuotes = localStorage.getItem("savedQuotes")
    const savedList = savedQuotes ? JSON.parse(savedQuotes) : []
    setSaved(savedList)

    // Fetch quotes data
    fetch("/quotes.json")
      .then(res => res.json())
      .then(data => {
        const categoryList = ["All", "Saved", ...Object.keys(data.categories)]
        setCategories(categoryList)

        const allQuotesData = Object.entries(data.categories).flatMap(([categoryName, category]) => {
          return category.quotes.map(quote => ({
            ...quote,
            category: categoryName,
          }))
        })

        setAllQuotes(allQuotesData)

        // Set initial quotes but wait for filters to be applied
        setQuotes(allQuotesData)

        const lastIndex = localStorage.getItem("lastQuoteIndex")
        if (lastIndex && !isNaN(Number(lastIndex))) {
          const newIndex = Number(lastIndex)
          setIndex(newIndex)
          setPreviousIndices([newIndex]) // Initialize previous indices with current index
          localStorage.setItem("lastQuoteIndex", newIndex.toString())
        } else {
          const randomIndex = Math.floor(Math.random() * allQuotesData.length)
          setIndex(randomIndex)
          setPreviousIndices([randomIndex]) // Initialize previous indices with current index
          localStorage.setItem("lastQuoteIndex", randomIndex.toString())
        }

        setIsLoaded(true)
      })
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("savedQuotes", JSON.stringify(saved))
    }
  }, [saved, isLoaded])
  
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("darkMode", darkMode)
      if (darkMode) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [darkMode, isLoaded])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCategoryDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const getQuoteId = (quote) => {
    return `${quote.author}-${quote.text.substring(0, 20)}`
  }

  useEffect(() => {
    if (!isLoaded || allQuotes.length === 0) return;

    let filtered = [...allQuotes]

    if (searchQuery) {
      filtered = filtered.filter(quote =>
        quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (selectedCategory === "Saved") {
      filtered = filtered.filter(quote => {
        const quoteId = getQuoteId(quote)
        return saved.includes(quoteId)
      })
    } else if (selectedCategory !== "All") {
      filtered = filtered.filter(quote => quote.category === selectedCategory)
    }

    setQuotes(filtered)
    if (filtered.length > 0) {
      if (index !== null && index < filtered.length) {
        // Keep current index
      } else {
        const newIndex = 0
        setIndex(newIndex)
        setPreviousIndices([newIndex]) // Reset previous indices with new index
      }
    } else {
      setIndex(null)
      setPreviousIndices([]) // Reset previous indices when no quotes available
    }
  }, [searchQuery, selectedCategory, allQuotes, saved, isLoaded, index])

  const goToHomePage = () => {
    setSelectedCategory("All")
    setSearchQuery("")
    const randomIndex = Math.floor(Math.random() * allQuotes.length)
    setIndex(randomIndex)
    setPreviousIndices([randomIndex]) // Reset previous indices with new random index
  }

  if (!isLoaded) {
    return (
      <div className={`p-12 text-center min-h-screen flex items-center justify-center ${darkMode ? "dark:bg-black dark:text-neutral-200" : ""}`}>
        <div>
          <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8" />
          <p>Take a breath... Loading quotes.</p>
        </div>
      </div>
    )
  }

  if (quotes.length === 0 || index === null) {
    return (
      <div className={`p-12 text-center min-h-screen flex items-center justify-center ${darkMode ? "dark:bg-black dark:text-neutral-200" : ""}`}>
        <div>
          {allQuotes.length === 0 ? (
            <>
              <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8" />
              <p>Take a breath... Loading quotes.</p>
            </>
          ) : selectedCategory === "Saved" && saved.length === 0 ? (
            <div className="space-y-4 text-sm">
              <p>No saved quotes yet. Save quotes you like by clicking the heart icon.</p>
              <button 
                onClick={goToHomePage}
                className={`px-4 py-2 rounded-md inline-flex items-center gap-2 border-zinc-300 ${
                  darkMode ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-200 hover:bg-neutral-300"
                }`}
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <p>No quotes match your search.</p>
              <button 
                onClick={goToHomePage}
                className={`px-4 py-2 rounded-md inline-flex items-center gap-2 border-zinc-300 ${
                  darkMode ? "bg-neutral-800 hover:bg-neutral-700" : "bg-neutral-200 hover:bg-neutral-300"
                }`}
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const quote = quotes[index]

  const prev = () => {
    // Get the previous index from our history
    if (previousIndices.length > 1) {
      const newPreviousIndices = [...previousIndices]
      newPreviousIndices.pop() // Remove current index
      const prevIndex = newPreviousIndices[newPreviousIndices.length - 1]
      setIndex(prevIndex)
      setPreviousIndices(newPreviousIndices)
      localStorage.setItem("lastQuoteIndex", prevIndex.toString())
    } else {
      // If no history, just go to previous quote in the current filtered list
      const prevIndex = (index - 1 + quotes.length) % quotes.length
      setIndex(prevIndex)
      localStorage.setItem("lastQuoteIndex", prevIndex.toString())
    }
    
    setExplanation("")
    setShowExplanation(false)
  }

  const next = () => {
    let nextIndex
    
    if (selectedCategory === "All" && !searchQuery) {
      // For "All" category without search, choose a random quote from allQuotes
      nextIndex = Math.floor(Math.random() * quotes.length)
      
      // Make sure we don't show the same quote
      while (nextIndex === index && quotes.length > 1) {
        nextIndex = Math.floor(Math.random() * quotes.length)
      }
    } else {
      // For other categories or when searching, use sequential navigation
      nextIndex = (index + 1) % quotes.length
    }
    
    // Add the new index to our history
    setPreviousIndices([...previousIndices, nextIndex])
    setIndex(nextIndex)
    setExplanation("")
    setShowExplanation(false)
    localStorage.setItem("lastQuoteIndex", nextIndex.toString())
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

  const toggleSave = () => {
    const quoteId = getQuoteId(quote)
    if (saved.includes(quoteId)) {
      setSaved(saved.filter(id => id !== quoteId))
    } else {
      setSaved([...saved, quoteId])
    }
  }

  const isSaved = () => {
    const quoteId = getQuoteId(quote)
    return saved.includes(quoteId)
  }

  const shareQuote = async () => {
    const shareText = `"${quote.text}" - ${quote.author}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Philosophy Quote',
          text: shareText,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Quote copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err))
    }
  }

  return (
   <>
      <Head>
        <title>Philosophy Quotes</title>
        <meta name="description" content="Discover timeless philosophy quotes from Socrates, Plato, Nietzsche, and other great thinkers. Curated for deep thinkers and lovers of wisdom." />
        <meta name="keywords" content="philosophy quotes, wisdom, socrates, plato, nietzsche, stoicism, deep quotes, ancient philosophy, thinkers, inspirational quotes" />
        <meta name="theme-color" content="#080808" />
        <link rel="icon" href="/icon.svg" />
      </Head>

    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-black text-neutral-200" : "bg-white text-gray-800"}`}>
      <header className={`p-4 flex justify-between items-center ${darkMode ? "dark:bg-black border-zinc-800" : "bg-white border-zinc-200"} border-b transition-colors duration-300`}>
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${darkMode ? "bg-neutral-900 hover:bg-neutral-800" : "bg-neutral-100 hover:bg-neutral-200"}`}
          >
            <BookOpen className="w-4 h-4" />
            {selectedCategory}
            <ChevronDown className="w-3 h-3" />
          </button>

          {showCategoryDropdown && (
            <div
              className={`absolute top-14 left-4 z-10 mt-1 rounded-md shadow-lg ${darkMode ? "bg-black border border-zinc-800" : "bg-white border border-zinc-200"}`}
            >
              <div className="py-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowCategoryDropdown(false)
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedCategory === category ? (darkMode ? "bg-neutral-900" : "bg-neutral-100") : ""} ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-neutral-900" : "hover:bg-neutral-100"}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-b ${darkMode ? "border-zinc-800 bg-black" : "border-zinc-200 bg-white"} overflow-hidden`}
          >
            <div className="p-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by keyword or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-grow outline-none ${darkMode ? "bg-black text-neutral-200" : "bg-white text-gray-800"}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className={`w-5 h-5 ${darkMode ? "text-neutral-500 hover:text-neutral-300" : "text-gray-500 hover:text-gray-700"}`} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <p className={`text-lg md:text-2xl font-medium ${ibarraRealNova.className} ${darkMode ? "text-neutral-100" : "text-neutral-800"}`}>"{quote.text}"</p>
              <p className={`text-xl md:text-2xl font-semibold ${tangerine.className} ${darkMode ? "text-neutral-200" : "text-neutral-800"}`}>- {quote.author}</p>
              <p className={`text-xs ${darkMode ? "text-neutral-400" : "text-gray-500"}`}>{quote.category}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button
              onClick={toggleSave}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors inline-flex items-center gap-2 ${
                isSaved()
                  ? "bg-amber-100 border-amber-300 text-amber-700 hover:bg-amber-200"
                  : darkMode
                    ? "bg-neutral-900 border-zinc-800 hover:bg-neutral-800 text-neutral-300"
                    : "bg-neutral-100 border-zinc-300 hover:bg-neutral-200"
              } ${darkMode && !isSaved() ? "text-neutral-300" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isSaved() ? "fill-amber-500 text-amber-500" : ""}`} />
              {isSaved() ? "Saved" : "Save"}
            </button>

            <button
              onClick={shareQuote}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors inline-flex items-center gap-2 ${darkMode ? "bg-neutral-900 border-zinc-800 hover:bg-neutral-800 text-neutral-300" : "bg-neutral-100 border-zinc-300 hover:bg-neutral-200"}`}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            <button
              onClick={explainQuote}
              disabled={isExplaining}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors disabled:opacity-50 inline-flex items-center gap-2 ${darkMode ? "bg-neutral-900 border-zinc-800 hover:bg-neutral-800 text-neutral-300" : "bg-neutral-100 border-zinc-300 hover:bg-neutral-200"}`}
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
                  className={`mt-5 p-4 rounded-md text-left ${darkMode ? "bg-neutral-900" : "bg-neutral-50"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-sm mb-1">Explanation:</h3>
                  <p className={`text-sm ${darkMode ? "text-neutral-300" : "text-gray-700"}`}>{explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center gap-8 py-6 fixed bottom-2 w-full mt-4">
        <button
          onClick={prev}
          className={`flex items-center gap-2 px-5 py-2 border rounded-l-xl transition-colors ${
            darkMode
              ? "border-zinc-800 bg-black/70 hover:bg-neutral-900"
              : "border-zinc-300 bg-white/70 hover:bg-neutral-100"
          } backdrop-blur-xl`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
        </button>

        <button
          onClick={next}
          className={`flex items-center gap-2 px-5 py-2 border rounded-r-xl transition-colors ${
            darkMode
              ? "border-zinc-800 bg-black/70 hover:bg-neutral-900"
              : "border-zinc-300 bg-white/70 hover:bg-neutral-100"
          } backdrop-blur-xl`}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </main>
   </>
  )
}