"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  Filter,
  Search,
  BookOpen,
  Download,
  ChevronDown,
  Globe,
  Activity,
  ArrowRight,
  Calendar,
} from "lucide-react"
import { motion } from "framer-motion"
import InsightModal from "@/components/insight-modal"
import { fetchInsights, subscribeNewsletter } from "@/lib/api"
import LoadingSpinner from "@/components/LoadingSpinner"
import api from "@/lib/axios"

interface Insight {
  id: string
  title: string
  content: string
  industry: any
  createdAt: string
  image: string
}

interface Industry {
  id: string
  name: string
}

export default function InsightsPage() {
  const [showFilters, setShowFilters] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [subscribeMsg, setSubscribeMsg] = useState<string | null>(null)
  const [industries, setIndustries] = useState<Industry[]>([])
  const [industryFilter, setIndustryFilter] = useState("All Industries")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadInsights = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetchInsights("isActive=true&limit=100")
        const data = response.insights || response.data || response
        if (Array.isArray(data)) {
          setInsights(data)
        } else if (data?.insights && Array.isArray(data.insights)) {
          setInsights(data.insights)
        } else {
          setInsights([])
        }
      } catch (err) {
        console.error("Error loading insights:", err)
        setError("Failed to load insights.")
      } finally {
        setLoading(false)
      }
    }
    loadInsights()
    fetchIndustries()
  }, [])

  const fetchIndustries = async () => {
    try {
      const { data } = await api.get("/industries")
      setIndustries(data.industries || data || [])
    } catch (error) {
      console.error("Error fetching industries:", error)
      setIndustries([])
    }
  }

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInsight(null)
  }

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesIndustry = industryFilter === "All Industries" || 
      insight.industry?.id === industryFilter ||
      insight.industry === industryFilter

    return matchesSearch && matchesIndustry
  })

  // Custom Select Component
  const CustomSelect = ({ 
    value, 
    onValueChange, 
    options, 
    placeholder, 
    className = "" 
  }: {
    value: string;
    onValueChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
    className?: string;
  }) => {
    const [isOpen, setIsOpen] = useState(false)
    
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as HTMLElement
        if (!target.closest('.custom-select')) {
          setIsOpen(false)
        }
      }
      
      if (isOpen) {
        document.addEventListener('click', handleClickOutside)
      }
      
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }, [isOpen])
    
    return (
      <div className={`relative custom-select ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left flex items-center justify-between hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        >
          <span className={value === placeholder ? "text-gray-500" : "text-gray-900"}>
            {options.find(opt => opt.value === value)?.label || placeholder}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
        
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-2 text-gray-500 text-sm">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onValueChange(option.value)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-left hover:bg-blue-50 hover:text-blue-600 focus:bg-blue-50 focus:text-blue-600 transition-colors ${
                    value === option.value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'
                  }`}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="relative py-14 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white">
        {/* Animated Blobs */}
        <motion.div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-32 right-20 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </motion.div>

        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(18)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-15, 15],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-6xl mx-auto"
          >
            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-5xl font-bold mb-6 leading-tight text-left max-w-6xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                Insights
              </span>{" "}
              & Thought Leadership
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed text-left max-w-6xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Stay ahead with our latest insights on auditing, advisory services, and business consultancy. Discover
              trends, best practices, and strategic perspectives from our industry experts.
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex flex-wrap justify-start gap-8 text-sm md:text-base mb-12 text-left max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              <div className="flex items-center space-x-2">
                <Activity className="h-5 w-5 text-cyan-400" />
                <span>{insights.length}+ Expert Articles</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-blue-400" />
                <span>Global Perspectives</span>
              </div>
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-indigo-400" />
                <span>Downloadable Resources</span>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-start text-left max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <Link
                href="#subscribe"
                className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group"
              >
                Subscribe for Updates
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-white rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </motion.div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search insights..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filter Toggle - Mobile */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors lg:hidden"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              {/* Desktop Filters */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 whitespace-nowrap">Filter by Industry:</span>
                  <CustomSelect
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                    options={[
                      { value: "All Industries", label: "All Industries" },
                      ...industries.map(industry => ({ 
                        value: industry.id, 
                        label: industry.name 
                      }))
                    ]}
                    placeholder="All Industries"
                    className="min-w-[200px]"
                  />
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Industry:
                  </label>
                  <CustomSelect
                    value={industryFilter}
                    onValueChange={setIndustryFilter}
                    options={[
                      { value: "All Industries", label: "All Industries" },
                      ...industries.map(industry => ({ 
                        value: industry.id, 
                        label: industry.name 
                      }))
                    ]}
                    placeholder="All Industries"
                  />
                </div>
              </div>
            )}

            {/* Filter Summary */}
            {(searchTerm || industryFilter !== "All Industries") && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {searchTerm && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Search: "{searchTerm}"
                      <button
                        onClick={() => setSearchTerm("")}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {industryFilter !== "All Industries" && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Industry: {industries.find(i => i.id === industryFilter)?.name || industryFilter}
                      <button
                        onClick={() => setIndustryFilter("All Industries")}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setIndustryFilter("All Industries")
                    }}
                    className="text-sm text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="mb-6 text-sm text-gray-600">
              {filteredInsights.length === insights.length 
                ? `Showing all ${insights.length} insights`
                : `Showing ${filteredInsights.length} of ${insights.length} insights`
              }
            </div>
          )}

          {/* Loading / Error */}
          {loading && (
            <div className="text-center py-12">
              <LoadingSpinner />
            </div>
          )}
          {error && (
            <div className="text-center py-12 text-red-600 bg-red-50 rounded-lg p-4">
              {error}
            </div>
          )}

          {/* Insights Grid */}
          {!loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInsights.map((insight) => {
                return (
                  <article
                    key={insight.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative">
                      <Image
                        src={insight.image || "/placeholder.svg"}
                        alt={insight.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex space-x-2">
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                          {(insight?.industry?.name ?? insight?.industry ?? "").toString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center space-x-2 text-xs text-gray-500 mb-3">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h3 className="text-lg font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                        <button onClick={() => handleInsightClick(insight)} className="text-left w-full">
                          {insight.title}
                        </button>
                      </h3>
                      <div className="flex items-center justify-end">
                        <button
                          onClick={() => handleInsightClick(insight)}
                          className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1 group"
                        >
                          <span>Read more</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {filteredInsights.length === 0 && !loading && !error && (
            <div className="text-center py-12 bg-white rounded-lg">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || industryFilter !== "All Industries"
                  ? "Try adjusting your search or filter criteria."
                  : "No insights are currently available."}
              </p>
              {(searchTerm || industryFilter !== "All Industries") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setIndustryFilter("All Industries")
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section id="subscribe" className="relative py-8 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated with Our Latest Insights</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Get the latest insights, industry trends, and expert analysis delivered directly to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-4 focus:ring-blue-300 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={async () => {
                  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    setSubscribeMsg("Please enter a valid email")
                    return
                  }
                  try {
                    setSubmitting(true)
                    setSubscribeMsg(null)
                    await subscribeNewsletter(email)
                    setSubscribeMsg("Subscribed successfully!")
                    setEmail("")
                  } catch (e) {
                    setSubscribeMsg("Subscription failed. Please try again.")
                  } finally {
                    setSubmitting(false)
                  }
                }}
                disabled={submitting}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors whitespace-nowrap disabled:opacity-60"
              >
                {submitting ? "Subscribing..." : "Subscribe Now"}
              </button>
            </div>
            {subscribeMsg && (
              <p className={`mt-3 ${subscribeMsg.includes('successfully') ? 'text-green-100' : 'text-red-100'}`}>
                {subscribeMsg}
              </p>
            )}
            <p className="text-gray-800 text-sm mt-4">
              Join 2,500+ professionals who trust our insights. Unsubscribe anytime.
            </p>
          </div>
        </div>
        <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
          <svg viewBox="0 0 1920 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-10 md:h-14">
            <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#305ca7" />
          </svg>
        </div>
      </section>

      {/* Insight Modal */}
      <InsightModal insight={selectedInsight} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}