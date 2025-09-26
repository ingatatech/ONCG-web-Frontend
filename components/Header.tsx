"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronDown, CheckCircle, ChevronRight, X,  Menu, Plus, Minus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchServices, fetchServiceCategories, fetchIndustries } from "@/lib/api"
import LoadingSpinner from "./LoadingSpinner"

// Types for services data
interface ServiceItem {
  id: string
  name: string
  slug: string
  serviceDescription: string
  experts?: any[]
}

interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  services: ServiceItem[]
}

interface ServicesData {
  categories: ServiceCategory[]
}

// Types for industries data
interface IndustryItem {
  id: string
  name: string
  slug: string
  industryDescription: string
  isActive: boolean
}

interface IndustriesData {
  industries: IndustryItem[]
}

export default function Header() {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false)
  const [mobileWhoWeAreOpen, setMobileWhoWeAreOpen] = useState(false)
  const [mobileActiveCategory, setMobileActiveCategory] = useState<string | null>(null)
  const [mobileActiveIndustryCategory, setMobileActiveIndustryCategory] = useState<string | null>(null)

  const [servicesItemsToShow, setServicesItemsToShow] = useState<Record<string, number>>({})
  const [industriesItemsToShow, setIndustriesItemsToShow] = useState<Record<string, number>>({})
  
  // Services data from API
  const [servicesData, setServicesData] = useState<ServicesData>({ categories: [] })
  const [loading, setLoading] = useState(true)
  
  // Industries data from API
  const [industriesData, setIndustriesData] = useState<IndustriesData>({ industries: [] })
  const [industriesLoading, setIndustriesLoading] = useState(true)

  const INITIAL_ITEMS_COUNT = 6
  const ITEMS_PER_PAGE = 2

  // Fetch services and industries data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setIndustriesLoading(true)
        
        const [categoriesResponse, servicesResponse, industriesResponse] = await Promise.all([
          fetchServiceCategories(),
          fetchServices("isActive=true&limit=100"),
          fetchIndustries("isActive=true&limit=100")
        ])

        const categories = categoriesResponse.data || categoriesResponse
        const services = servicesResponse.data || servicesResponse
        const industries = industriesResponse.industries || industriesResponse

        // Group services by category
        const groupedServices = categories.map((category: any) => ({
          ...category,
          services: services.filter((service: any) => service.category?.id === category.id)
        }))
        
        setServicesData({ categories: groupedServices })
        setIndustriesData({ industries })
        
        // Set first category as active
        if (groupedServices.length > 0) {
          setActiveCategory(groupedServices[0].name)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
        setIndustriesLoading(false)
      }
    }

    loadData()
  }, [])

  const getServicesItemsCount = (category: string) => {
    return servicesItemsToShow[category] || INITIAL_ITEMS_COUNT
  }

  const getIndustriesItemsCount = (category: string) => {
    return industriesItemsToShow[category] || INITIAL_ITEMS_COUNT
  }

  const showMoreServices = (category: string) => {
    const currentCount = getServicesItemsCount(category)
    const totalItems = servicesData.categories.find((s) => s.name === category)?.services.length || 0
    const newCount = Math.min(currentCount + ITEMS_PER_PAGE, totalItems)
    setServicesItemsToShow((prev) => ({ ...prev, [category]: newCount }))
  }

  const showMoreIndustries = (category: string) => {
    const currentCount = getIndustriesItemsCount(category)
    const totalItems = category === "Industries" ? industriesData.industries.length : 0
    const newCount = Math.min(currentCount + ITEMS_PER_PAGE, totalItems)
    setIndustriesItemsToShow((prev) => ({ ...prev, [category]: newCount }))
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setMobileServicesOpen(false)
    setMobileIndustriesOpen(false)
    setMobileWhoWeAreOpen(false)
    setMobileActiveCategory(null)
    setMobileActiveIndustryCategory(null)
  }

  const toggleServicesDropdown = () => {
    setActiveService(activeService === "services" ? null : "services")
  }

  const toggleIndustriesDropdown = () => {
    setActiveService(activeService === "industries" ? null : "industries")
  }

  const toggleWhoWeAreDropdown = () => {
    setActiveService(activeService === "who-we-are" ? null : "who-we-are")
  }

  return (
    <header className="border-b border-border shadow-md sticky top-0 z-50 bg-white">
      <div className="container mx-auto py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center pl-5">
            <Image
              src="/images/oncg-logo1.jpg"
              alt="ONCG"
              width={200}
              height={80}
              className="h-12 w-auto"
            />
          </Link>
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/our-approach" className="text-foreground hover:text-primary transition-colors">
              Our Approach
            </Link>
            <div className="relative group">
              <button
                onClick={toggleServicesDropdown}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors py-2"
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {activeService === "services" && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
                  <div className="absolute top-[80px] left-0 right-0 bg-background border-t border-border shadow-2xl">
                    <div className="container mx-auto">
                      <div className="flex min-h-[500px]">
                        {/* Left Panel - Blue Section */}
                        <div className="w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-white relative">
                          {/* Floating Particles */}
                          <div className="absolute inset-0">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                  y: [-20, 20],
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
                          <button
                            onClick={() => setActiveService(null)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                          >
                            <X className="h-6 w-6" />
                          </button>

                          <div className="pt-4">
                            <h2 className="text-3xl font-bold mb-4">Services</h2>
                            <p className="text-blue-100 leading-relaxed text-lg">
                              ONCG's multi-disciplinary approach and deep, practical industry knowledge help clients
                              meet challenges and respond to opportunities.
                            </p>
                          </div>

                   
                        </div>

                        {/* Right Panel - White Section with Tabs */}
                        <div className="flex-1 bg-white overflow-y-auto max-h-[500px]">
                          {/* Tab Navigation */}
                          <div className="border-b border-gray-200">
                            <div className="flex">
                              {servicesData.categories.map((category) => (
                                <button
                                  key={category.id}
                                  onClick={() => setActiveCategory(category.name)}
                                  className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors relative ${
                                    activeCategory === category.name
                                      ? "border-primary text-gray-900"
                                      : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                                  }`}
                                >
                                  <span className="text-gray-900">{category.name}</span>
                                  {activeCategory === category.name && (
                                    <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Tab Content */}
                          <div className="p-8">
                            {loading ? (
                              <div className="text-center py-8">
                              <LoadingSpinner />
                              </div>
                            ) : (
                              servicesData.categories.map(
                                (category) =>
                                  activeCategory === category.name && (
                                    <div key={category.id} className="space-y-1">
                                      <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                                        {category.services.slice(0, getServicesItemsCount(category.name)).map((service) => (
                                          <Link
                                            key={service.id}
                                            href={`/services?category=${category.slug}&service=${service.slug}`}
                                            className="group flex items-center justify-between py-4 px-4 -mx-4 rounded-lg hover:bg-gray-50 transition-colors"
                                            onClick={() => setActiveService(null)}
                                          >
                                            <div className="flex items-center space-x-4">
                                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                <CheckCircle className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                                              </div>
                                              <div>
                                                <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors">
                                                  {service.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-1" dangerouslySetInnerHTML={{ __html: service.serviceDescription}}/>
                                                
                                              </div>
                                            </div>
                                            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                          </Link>
                                        ))}
                                      </div>

                                      {getServicesItemsCount(category.name) < category.services.length && (
                                        <div className="mt-8 pt-6 border-t border-gray-200">
                                          <button
                                            onClick={() => showMoreServices(category.name)}
                                            className="inline-flex items-center text-primary hover:text-blue-700 font-medium text-sm transition-colors group"
                                          >
                                            View more {category.name.toLowerCase()}
                                            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                          </button>
                                          <span className="ml-2 text-xs text-gray-500">
                                            ({category.services.length - getServicesItemsCount(category.name)} more)
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ),
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative group">
              <button
                onClick={toggleIndustriesDropdown}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors py-2"
              >
                <span>Industries</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {activeService === "industries" && (
                <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40">
                  <div className="absolute top-[80px] left-0 right-0 bg-background border-t border-border shadow-2xl">
                    <div className="container mx-auto">
                      <div className="flex min-h-[500px]">
                        {/* Left Panel - Blue Section */}
                        <div className="w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-8 text-white relative">
                          {/* Floating Particles */}
                          <div className="absolute inset-0">
                            {[...Array(20)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute w-1 h-1 bg-white rounded-full opacity-60"
                                style={{
                                  left: `${Math.random() * 100}%`,
                                  top: `${Math.random() * 100}%`,
                                }}
                                animate={{
                                  y: [-20, 20],
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
                          <button
                            onClick={() => setActiveService(null)}
                            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                          >
                            <X className="h-6 w-6" />
                          </button>

                          <div className="pt-4">
                            <h2 className="text-3xl font-bold mb-4">Industries</h2>
                            <p className="text-blue-100 leading-relaxed text-lg">
                              Helping clients meet their business challenges begins with an in-depth understanding of
                              the industries in which they work. That's why ONCG LLP established its industry-driven
                              structure.
                            </p>
                          </div>
                        </div>

                        {/* Right Panel - White Section with Tabs */}
                        <div className="flex-1 bg-white overflow-y-auto max-h-[500px]">
                          {/* Tab Navigation */}
                          <div className="border-b border-gray-200">
                            <div className="flex">
                              <button
                                className={`px-3 py-1 text-sm font-medium border-b-2 transition-colors relative 
                                   border-primary text-gray-900"
                                   
                                  `}
                              >
                                <span className="text-gray-900">Industries</span>
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></div>
                              </button>
                            </div>
                          </div>

                          {/* Tab Content */}
                          <div className="p-8">
                            {industriesLoading ? (
                              <div className="text-center py-8">
                            <LoadingSpinner />
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                                  {industriesData.industries.slice(0, getIndustriesItemsCount("Industries")).map((industry) => (
                                    <Link
                                      key={industry.id}
                                      href={`/industries?name=${industry.slug}`}
                                      className="group flex items-center justify-between py-4 px-4 -mx-4 rounded-lg hover:bg-gray-50 transition-colors"
                                      onClick={() => setActiveService(null)}
                                    >
                                      <div className="flex items-center space-x-4">
                                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                          <CheckCircle className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div>
                                          <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                                            {industry.name}
                                          </h3>
                                          <p className="text-sm text-gray-500 mt-1 line-clamp-1" dangerouslySetInnerHTML={{ __html:industry.industryDescription}}/>
                                        </div>
                                      </div>
                                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                  ))}
                                </div>

                                {getIndustriesItemsCount("Industries") < industriesData.industries.length && (
                                  <div className="mt-8 pt-6 border-t border-gray-200">
                                    <button
                                      onClick={() => showMoreIndustries("Industries")}
                                      className="inline-flex items-center text-primary hover:text-blue-700 font-medium text-sm transition-colors group"
                                    >
                                      View more industries
                                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <span className="ml-2 text-xs text-gray-500">
                                      ({industriesData.industries.length - getIndustriesItemsCount("Industries")} more)
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/insights" className="text-foreground hover:text-primary transition-colors">
              Insights
            </Link>
            
            {/* Who We Are Dropdown */}
            <div className="relative group">
              <button
                onClick={toggleWhoWeAreDropdown}
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors py-2"
              >
                <span>Who we are</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {activeService === "who-we-are" && (
                <>
                  <div 
                    className="fixed inset-0 bg-transparent z-40"
                    onClick={() => setActiveService(null)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-32 bg-white rounded-lg shadow-xl z-50">
                    <div className="p-2">
                    
                      <div className="pt-2">
                        <Link
                          href="/about"
                          onClick={() => setActiveService(null)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                        >
                          <div>
                            <h3 className="font-medium text-sm">About us</h3>
                          </div>
                        </Link>
                        <Link
                          href="/leadership"
                          onClick={() => setActiveService(null)}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary rounded-lg transition-colors"
                        >
                         <h3 className="font-medium text-sm">Leadership</h3>
                        </Link>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <Link href="/contact-us" className="text-foreground hover:text-primary transition-colors">
              Contact Us
            </Link>
          </nav>
          {/* Desktop CTA and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={closeMobileMenu}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Mobile Menu Header */}
                <div className="flex items-center justify-between mb-8">
                  {/* <Image src="/images/oncg-logo.png" alt="ONCG" width={120} height={48} className="h-8 w-auto" /> */}
                   <Link href="/" className="flex items-center pl-5">
            <Image
              src="/images/oncg-logo1.jpg"
              alt="ONCG"
              width={120} height={48} 
              className="h-12 w-auto"
            />
          </Link>
                  <button onClick={closeMobileMenu} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {/* Mobile Navigation */}
                <nav className="space-y-2">
                    <Link
                    href="/"
                    onClick={closeMobileMenu}
                    className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    href="/our-approach"
                    onClick={closeMobileMenu}
                    className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Our Approach
                  </Link>

                  {/* Services Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-gray-900">Services</span>
                      {mobileServicesOpen ? (
                        <Minus className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {mobileServicesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-2 space-y-1">
                            {loading ? (
                              <div className="text-center py-4">
                              <LoadingSpinner />
                              </div>
                            ) : (
                              servicesData.categories.map((category) => (
                                <div key={category.id}>
                                  <button
                                    onClick={() =>
                                      setMobileActiveCategory(
                                        mobileActiveCategory === category.name ? null : category.name,
                                      )
                                    }
                                    className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                  >
                                    <span className="font-medium text-gray-800">{category.name}</span>
                                    {mobileActiveCategory === category.name ? (
                                      <Minus className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Plus className="h-4 w-4 text-gray-500" />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {mobileActiveCategory === category.name && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="pl-4 pt-1 space-y-1">
                                          {category.services.map((service) => (
                                            <Link
                                              key={service.id}
                                              href={`/services?category=${category.slug}&service=${service.slug}`}
                                              onClick={closeMobileMenu}
                                              className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                            >
                                              {service.name}
                                            </Link>
                                          ))}
                                          {/* <Link
                                            href={`/services?category=${category.slug}`}
                                            onClick={closeMobileMenu}
                                            className="block p-2 text-sm font-medium text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                          >
                                            View all {category.name.toLowerCase()}
                                          </Link> */}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Industries Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileIndustriesOpen(!mobileIndustriesOpen)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-gray-900">Industries</span>
                      {mobileIndustriesOpen ? (
                        <Minus className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {mobileIndustriesOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-2 space-y-1">
                            {industriesLoading ? (
                              <div className="text-center py-4">
                              <LoadingSpinner />
                              </div>
                            ) : (
                              industriesData.industries.map((industry) => (
                                <div key={industry.id}>
                                  <button
                                    onClick={() =>
                                      setMobileActiveIndustryCategory(
                                        mobileActiveIndustryCategory === industry.name ? null : industry.name,
                                      )
                                    }
                                    className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded-lg transition-colors text-sm"
                                  >
                                    <span className="font-medium text-gray-800">{industry.name}</span>
                                    {mobileActiveIndustryCategory === industry.name ? (
                                      <Minus className="h-4 w-4 text-gray-500" />
                                    ) : (
                                      <Plus className="h-4 w-4 text-gray-500" />
                                    )}
                                  </button>

                                  <AnimatePresence>
                                    {mobileActiveIndustryCategory === industry.name && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="pl-4 pt-1 space-y-1">
                                          <Link
                                            href={`/industries?name=${industry.slug}`}
                                            onClick={closeMobileMenu}
                                            className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                                          >
                                            {industry.name}
                                          </Link>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Other Navigation Links */}
                  <Link
                    href="/insights"
                    onClick={closeMobileMenu}
                    className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Insights
                  </Link>
                  
                  {/* Who We Are Dropdown */}
                  <div>
                    <button
                      onClick={() => setMobileWhoWeAreOpen(!mobileWhoWeAreOpen)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <span className="font-medium text-gray-900">Who we are</span>
                      {mobileWhoWeAreOpen ? (
                        <Minus className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Plus className="h-5 w-5 text-gray-500" />
                      )}
                    </button>

                    <AnimatePresence>
                      {mobileWhoWeAreOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pl-4 pt-2 space-y-1">
                            <Link
                              href="/about"
                              onClick={closeMobileMenu}
                              className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              About us
                            </Link>
                            <Link
                              href="/leadership"
                              onClick={closeMobileMenu}
                              className="block p-2 text-sm text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              Leadership
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <Link
                    href="/contact-us"
                    onClick={closeMobileMenu}
                    className="block p-3 font-medium text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    Contact Us
                  </Link>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}