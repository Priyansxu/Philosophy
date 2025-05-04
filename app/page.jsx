"use client"

import { useEffect, useState } from "react"
import { 
  ArrowLeft, 
  ArrowRight, 
  Loader2, 
  Lightbulb, 
  Heart, 
  Search, 
  Share2, 
  X, 
  Moon, 
  Sun, 
  BookOpen,
  ChevronDown,
  Filter
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Tangerine, Ibarra_Real_Nova } from "next/font/google"

const tangerine = Tangerine({ subsets: ["latin"], weight: ["400", "700"] })
const ibarraRealNova = Ibarra_Real_Nova({ subsets: ["latin"], weight: ["400", "700"] })

export default function QuotePage() {
  const [quotes, setQuotes] = useState([])
  const [allQuotes, setAllQuotes] = useState([])
  const [index, setIndex] = useState(null)
  const [explanation, setExplanation] = useState("")
  const [isExplaining, setIsExplaining] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [darkMode, setDarkMode] = useState(false)
  // Removed author info states
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)

  // Load quotes and initialize states
  useEffect(() => {
    fetch("/quotes.json")
      .then(res => res.json())
      .then(data => {
        // Load favorites from local storage first
        const savedFavorites = localStorage.getItem("favorites")
        const favList = savedFavorites ? JSON.parse(savedFavorites) : []
        setFavorites(favList)
        
        const categoryList = ["All", "Favorites", ...Object.keys(data.categories)]
        setCategories(categoryList)
        
        const allQuotesData = Object.entries(data.categories).flatMap(([categoryName, category]) => {
          return category.quotes.map(quote => ({
            ...quote,
            category: categoryName,
          }))
        })
        
        setAllQuotes(allQuotesData)
        setQuotes(allQuotesData)
        const randomIndex = Math.floor(Math.random() * allQuotesData.length)
        setIndex(randomIndex)
        
        // Load dark mode preference from local storage
        const savedDarkMode = localStorage.getItem("darkMode") === "true"
        setDarkMode(savedDarkMode)
        if (savedDarkMode) {
          document.documentElement.classList.add("dark")
        }
      })
  }, [])

  // Save favorites to local storage when they change
  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites])

  // Toggle dark mode and save to local storage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Filter quotes based on search query and category
  useEffect(() => {
    let filtered = [...allQuotes]
    
    if (searchQuery) {
      filtered = filtered.filter(quote => 
        quote.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    if (selectedCategory === "Favorites") {
      filtered = filtered.filter(quote => {
        const quoteId = `${quote.author}-${quote.text.substring(0, 20)}`
        return favorites.includes(quoteId)
      })
    } else if (selectedCategory !== "All") {
      filtered = filtered.filter(quote => quote.category === selectedCategory)
    }
    
    setQuotes(filtered)
    if (filtered.length > 0) {
      setIndex(0)
    } else {
      setIndex(null)
    }
  }, [searchQuery, selectedCategory, allQuotes, favorites])

  if (!quotes.length || index === null) {
    return (
      <div className={`p-12 text-center min-h-screen flex items-center justify-center ${darkMode ? "dark:bg-gray-900 dark:text-gray-100" : ""}`}>
        <div>
          <Loader2 className="animate-spin mx-auto mb-4 w-8 h-8" />
          <p>Take a breath... {quotes.length === 0 ? "Loading quotes." : "No quotes match your search."}</p>
        </div>
      </div>
    )
  }

  const quote = quotes[index]

  // Navigation functions
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

  // Explanation API call
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

  // Toggle favorite status
  const toggleFavorite = () => {
    const quoteId = `${quote.author}-${quote.text.substring(0, 20)}`
    if (favorites.includes(quoteId)) {
      setFavorites(favorites.filter(id => id !== quoteId))
    } else {
      setFavorites([...favorites, quoteId])
    }
  }

  // Check if current quote is favorited
  const isFavorite = () => {
    const quoteId = `${quote.author}-${quote.text.substring(0, 20)}`
    return favorites.includes(quoteId)
  }

  // Share quote function
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
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Quote copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err))
    }
  }

  // Author info feature removed

  return (
    <main className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "dark bg-slate-900 text-gray-100" : "bg-white text-gray-800"}`}>
      {/* Header with search and dark mode */}
      <header className={`p-4 flex justify-between items-center ${darkMode ? "dark:bg-slate-800 border-slate-700" : "bg-white border-gray-200"} border-b transition-colors duration-300`}>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1 ${darkMode ? "bg-slate-700 hover:bg-slate-600" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            <BookOpen className="w-4 h-4" />
            {selectedCategory}
            <ChevronDown className="w-3 h-3" />
          </button>
          
          {showCategoryDropdown && (
            <div 
              className={`absolute top-14 left-4 z-10 mt-1 rounded-md shadow-lg ${darkMode ? "bg-slate-800 border border-slate-700" : "bg-white border border-gray-200"}`}
            >
              <div className="py-1">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category)
                      setShowCategoryDropdown(false)
                    }}
                    className={`block px-4 py-2 text-sm w-full text-left ${selectedCategory === category ? (darkMode ? "bg-slate-700" : "bg-gray-100") : ""} ${darkMode ? "hover:bg-slate-700" : "hover:bg-gray-100"}`}
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
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            <Search className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </header>
      
      {/* Search bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`border-b ${darkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} overflow-hidden`}
          >
            <div className="p-3 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by keyword or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`flex-grow outline-none ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-800"}`}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}>
                  <X className={`w-5 h-5 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main content */}
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
              <p className={`text-lg md:text-2xl font-medium ${ibarraRealNova.className} ${darkMode ? "text-gray-100" : "text-gray-800"}`}>"{quote.text}"</p>
              <p className={`text-xl md:text-2xl font-semibold ${tangerine.className} ${darkMode ? "text-gray-300" : "text-gray-800"}`}>- {quote.author}</p>
              <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{quote.category}</p>
            </motion.div>
          </AnimatePresence>

          {/* Action buttons */}
          <div className="mt-6 flex justify-center gap-2 flex-wrap">
            <button
              onClick={explainQuote}
              disabled={isExplaining}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors disabled:opacity-50 inline-flex items-center gap-2 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700" : "bg-warmGray-100 border-warmGray-300 hover:bg-warmGray-200"}`}
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
            
            <button
              onClick={toggleFavorite}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors inline-flex items-center gap-2 ${
                isFavorite() 
                  ? "bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200" 
                  : darkMode 
                    ? "bg-gray-800 border-gray-700 hover:bg-gray-700" 
                    : "bg-warmGray-100 border-warmGray-300 hover:bg-warmGray-200"
              } ${darkMode && !isFavorite() ? "text-gray-100" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isFavorite() ? "fill-pink-500 text-pink-500" : ""}`} />
              {isFavorite() ? "Favorited" : "Add to Favorites"}
            </button>
            
            <button
              onClick={shareQuote}
              className={`px-4 py-1.5 text-sm rounded-md border transition-colors inline-flex items-center gap-2 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700 text-gray-100" : "bg-warmGray-100 border-warmGray-300 hover:bg-warmGray-200"}`}
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>

          {/* Explanation section */}
          <div className="min-h-[120px]">
            <AnimatePresence>
              {showExplanation && explanation && (
                <motion.div
                  key="explanation"
                  className={`mt-5 p-4 rounded-md text-left ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-medium text-sm mb-1">Explanation:</h3>
                  <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Author information section removed */}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center items-center gap-8 py-6 fixed bottom-2 w-full">
        <button
          onClick={prev}
          className={`flex items-center gap-2 px-5 py-2 border rounded-l-xl transition-colors ${
            darkMode 
              ? "border-gray-700 bg-gray-800/70 hover:bg-gray-700" 
              : "border-gray-300 bg-white/70 hover:bg-gray-100"
          } backdrop-blur-xl`}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
        </button>

        <button
          onClick={next}
          className={`flex items-center gap-2 px-5 py-2 border rounded-r-xl transition-colors ${
            darkMode 
              ? "border-gray-700 bg-gray-800/70 hover:bg-gray-700" 
              : "border-gray-300 bg-white/70 hover:bg-gray-100"
          } backdrop-blur-xl`}
        >
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </main>
  )
}