"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import {  CheckCircle, ChevronDown, ChevronRight, X } from "lucide-react"
import { fetchServices, fetchServiceCategories } from "@/lib/api"
import LoadingSpinner from "./LoadingSpinner"

// Types for API data
interface ServiceItem {
  id: string
  name: string
  slug: string
  serviceDescription: string
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

export default function ServicesClickModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [servicesItemsToShow, setServicesItemsToShow] = useState<Record<string, number>>({})
  
  // API data states
  const [servicesData, setServicesData] = useState<ServicesData>({ categories: [] })
  const [loading, setLoading] = useState(true)

  const INITIAL_ITEMS_COUNT = 6
  const ITEMS_PER_PAGE = 2

  // Fetch services data on component mount
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true)
        const [categoriesResponse, servicesResponse] = await Promise.all([
          fetchServiceCategories(),
          fetchServices("isActive=true&limit=100")
        ])

        const categories = categoriesResponse.data || categoriesResponse
        const services = servicesResponse.data || servicesResponse

        // Group services by category
        const groupedServices = categories.map((category: any) => ({
          ...category,
          services: services.filter((service: any) => service.category?.id === category.id)
        }))

        setServicesData({ categories: groupedServices })
        
        // Set first category as active
        if (groupedServices.length > 0) {
          setActiveCategory(groupedServices[0].name)
        }
      } catch (error) {
        console.error("Error loading services:", error)
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const getServicesItemsCount = (category: string) => servicesItemsToShow[category] || INITIAL_ITEMS_COUNT

  const showMoreServices = (category: string) => {
    const currentCount = getServicesItemsCount(category)
    const totalItems = servicesData.categories.find((s) => s.name === category)?.services.length || 0
    const newCount = Math.min(currentCount + ITEMS_PER_PAGE, totalItems)
    setServicesItemsToShow((prev) => ({ ...prev, [category]: newCount }))
  }

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const modal = document.getElementById('services-modal')
      const button = document.getElementById('services-button')
      
      if (isOpen && modal && !modal.contains(target) && !button?.contains(target)) {
        setIsOpen(false)
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscapeKey)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const toggleModal = () => {
    setIsOpen(prev => !prev)
  }

  const closeModal = () => {
    setIsOpen(false)
  }

  return (
    <div className="relative inline-block">
      <button
        id="services-button"
        onClick={toggleModal}
        className={`inline-flex items-center bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300 group ${
          isOpen ? 'ring-2 ring-primary ring-offset-2' : ''
        }`}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
      >
        <span>View our Services</span>
        <ChevronDown 
          className={`w-5 h-5 ml-3 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'
          }`} 
        />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 overflow-y-auto">
          <div 
            id="services-modal"
            className="absolute top-16 lg:top-[80px] left-0 right-0 bg-background border-t border-border shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="services-modal-title"
          >
            <div className="container mx-auto">
              <div className="flex flex-col lg:flex-row min-h-screen lg:min-h-[500px]">
                <div className="w-full lg:w-80 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6 lg:p-8 text-white relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10"
                    aria-label="Close services modal"
                  >
                    <X className="h-6 w-6" />
                  </button>

                  <div className="pt-4">
                    <h2 id="services-modal-title" className="text-3xl font-bold mb-4 text-left">Services</h2>
                    <p className="text-blue-100 leading-relaxed text-lg text-left">
                      ONCG's multi-disciplinary approach and deep, practical industry knowledge help clients meet
                      challenges and respond to opportunities.
                    </p>
                  </div>

            
                </div>

                <div className="flex-1 bg-white overflow-y-auto max-h-[calc(100vh-4rem)] lg:max-h-[500px]">
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
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
                                {category.services.slice(0, getServicesItemsCount(category.name)).map((service) => (
                                  <Link
                                    key={service.id}
                                    href={`/services?category=${category.slug}&service=${service.slug}`}
                                    className="group flex items-center justify-between py-4 px-4 -mx-4 rounded-lg hover:bg-gray-50 transition-colors"
                                    onClick={closeModal}
                                  >
                                    <div className="flex items-start space-x-4">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <CheckCircle className="h-4 w-4 text-gray-600 group-hover:text-primary transition-colors" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium text-sm text-gray-900 text-left group-hover:text-primary transition-colors">
                                          {service.name}
                                        </h3>
                                        <p className="text-sm text-left text-gray-500 mt-1 line-clamp-1"  dangerouslySetInnerHTML={{ __html: service.serviceDescription}} />
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
                                  <span className="ml-2 text-sm text-gray-500">
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
  )
}