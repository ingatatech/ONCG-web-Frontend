"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { 
  ArrowRight, 
  Star,
  Globe,
  BarChart3,
  Target,
  Sparkles,
  ArrowUpRight,

} from "lucide-react"
import ServicesHoverModal from "@/components/ServicesHoverModal"
import { fetchTestimonials } from "@/lib/api"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Partner } from "@/components/admin/partners"
import api from "@/lib/axios"

interface Testimonial {
  id: string
  leaderName: string
  companyName: string
  role: string
  quote: string
  leaderImage: string
  approved: boolean
  createdAt: string
  updatedAt: string
}

interface TestimonialWithUI extends Testimonial {
  rating: number
  delay: number
}


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  
  // Testimonials state
  const [testimonials, setTestimonials] = useState<TestimonialWithUI[]>([])
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)
  const [testimonialsError, setTestimonialsError] = useState<string | null>(null)
  
  const heroRef = useRef(null)
  const whyUsRef = useRef(null)
  const testimonialsRef = useRef(null)
  const partnersRef = useRef(null)
  
  const whyUsInView = useInView(whyUsRef, { once: true, margin: "-100px" })
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" })
  const partnersInView = useInView(partnersRef, { once: true, margin: "-100px" })
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(false)
  // Fetch testimonials on component mount
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        setTestimonialsLoading(true)
        setTestimonialsError(null)
        
        const response = await fetchTestimonials()
        const fetchedTestimonials = response.data || []
        
        // Filter only approved testimonials and transform to include UI properties
        const approvedTestimonials = fetchedTestimonials
          .filter((testimonial: Testimonial) => testimonial.approved)
          .slice(0, 6) // Limit to 6 testimonials
          .map((testimonial: Testimonial, index: number) => ({
            ...testimonial,
            rating: 5, // All testimonials get 5 stars
            delay: index * 0.2
          }))
        
      
          setTestimonials(approvedTestimonials)
        
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        setTestimonialsError('Failed to load testimonials')
        
      } finally {
        setTestimonialsLoading(false)
      }
    }
 fetchPartners()
    loadTestimonials()
  }, [])
  async function fetchPartners() {
    setLoading(true)
    try {
      const res = await api.get("/partners")
      setPartners(res.data)
    } catch (err: any) {
        console.error('Error fetching testimonials:', err)
    } finally {
      setLoading(false)
    }
  }
  return (
    
      <div className="min-h-screen">
        {/* Hero Section */}
        <section ref={heroRef} className="relative py-5 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          {/* Animated Background Elements */}
          <motion.div 
            style={{ y }}
            className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </motion.div>
          {/* Overlay */}

  <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse" />
  <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full translate-y-32 -translate-x-32" />
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
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="relative container mx-auto  z-10">
            <motion.div 
              className="text-center max-w-6xl mx-auto"
                 initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
              <motion.div 
                variants={fadeInUp}
                className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-8 hover:bg-white/10 transition-colors group"
              >
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                Leading Professional Services in Rwanda
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp}
                className="text-lg md:text-5xl lg:text-5xl  font-bold text-white mb-8 text-balance leading-tight"
              >
                Professional{" "}
                <motion.span 
                  className="bg-gradient-to-r from-cyan-400 via-blue-500 to-primary bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  Auditing
                </motion.span>{" "}
                &
                
                <motion.span 
                  className="bg-gradient-to-r from-emerald-400 via-cyan-500 to-blue-600 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                  }}
                  transition={{ 
                    duration: 8, 
                    repeat: Infinity,
                    ease: "linear" 
                  }}
                >
                  Consulting
                </motion.span>{" "}
                Services
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp}
                className="text-xl md:text-2xl text-gray-300 mb-12 text-pretty  max-w-6xl mx-auto leading-relaxed"
              >
                ONCG delivers expert auditing, advisory services, and strategic consultancy to help your
                business achieve compliance, efficiency, and sustainable growth in today's competitive landscape.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
              >
             
               <ServicesHoverModal />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/contact-us" className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group">
                     Get Started Today
                    <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>

       
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <motion.div
                className="w-1 h-3 bg-white rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </section>


        {/* Why Choose Us Section */}
        <section ref={whyUsRef} className="py-7 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
         {/* Animated Background Elements */}
          <motion.div 
            style={{ y }}
            className="absolute inset-0 opacity-20"
          >
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
          </motion.div>
          
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
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={whyUsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium mb-6">
                  Why Choose ONCG
                </div>
                <h2 className="text-4xl lg:text-4xl font-bold text-white mb-8 leading-tight">
                  Why Leading Companies Choose{" "}
                  <span className="text-cyan-400">ONCG</span>
                </h2>
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  With over 15 years of experience and a track record of success, we've helped hundreds of organizations 
                  achieve their goals through expert guidance and innovative solutions.
                </p>
                
               
              </motion.div>
              
             <motion.div 
                  className="space-y-8"
                  variants={staggerContainer}
                  initial="initial"
                  animate={whyUsInView ? "animate" : "initial"}
                >
                  {[
                    {
                      icon: Target,
                      title: "Results-Driven Approach",
                      description: "We focus on delivering measurable outcomes that drive real business value and sustainable growth.",
                      color: "from-emerald-400 to-green-500"
                    },
                    {
                      icon: Globe,
                      title: "Local Expertise, Global Standards",
                      description: "Deep understanding of Rwanda's business landscape combined with international best practices.",
                      color: "from-blue-400 to-cyan-500"
                    },
                    {
                      icon: BarChart3,
                      title: "Proven Track Record",
                      description: "Successfully completed 500+ projects with 99% client satisfaction rate across diverse industries.",
                      color: "from-primary/30 to-primary"
                    }
                  ].map((item, index) => {
                    const IconComponent = item.icon
                    return (
                      <motion.div
                        key={index}
                        variants={{
                          initial: { opacity: 0, x: -30 },
                          animate: { 
                            opacity: 1, 
                            x: 0,
                            transition: { delay: index * 0.2 }
                          }
                        }}
                        whileHover={{ x: 10 }}
                        className="flex items-start space-x-6 group cursor-pointer"
                      >
                        <motion.div 
                          className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} p-3 flex-shrink-0`}
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <IconComponent className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-white mb-2 text-lg group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-gray-200 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )
                  })}
                </motion.div>
            </div>
          </div>
                         <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
  <svg
    viewBox="0 0 1920 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-10 md:h-14"
  >
    <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#305ca7" />
  </svg>
</div>
        </section>

        {/* Testimonials Section */}
        <section ref={testimonialsRef} className="py-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
                Client Stories
              </div>
              <h2 className="text-4xl lg:text-4xl font-bold text-foreground mb-6">
                What Our Clients{" "}
                <span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
                  Say
                </span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl text-left mx-auto">
                Don't just take our word for it. Here's what industry leaders have to say about working with ONCG.
              </p>
            </motion.div>

            {/* Loading State */}
            {testimonialsLoading && (
              <motion.div 
                className="flex justify-center items-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

            <LoadingSpinner />
              </motion.div>
            )}

            {/* Error State */}
            {testimonialsError && !testimonialsLoading && (
              <motion.div 
                className="text-center py-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
                  <p className="text-red-600 mb-4">{testimonialsError}</p>
                  <p className="text-sm text-muted-foreground">Showing default testimonials</p>
                </div>
              </motion.div>
            )}

            {/* Testimonials Grid */}
            {!testimonialsLoading && testimonials.length > 0 && (
              <motion.div 
                className="grid lg:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate={testimonialsInView ? "animate" : "initial"}
              >
                {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, y: 50, rotateX: -15 },
                    animate: { 
                      opacity: 1, 
                      y: 0, 
                      rotateX: 0,
                      transition: { delay: testimonial.delay, duration: 0.6 }
                    }
                  }}
                  whileHover={{ 
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden group"
                >
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
                  
                  <div className="relative">
                    <motion.div 
                      className="flex mb-6"
                      initial={{ scale: 0 }}
                      animate={testimonialsInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: testimonial.delay + 0.3, duration: 0.3 }}
                    >
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: testimonial.delay + 0.4 + i * 0.1 }}
                        >
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                        </motion.div>
                      ))}
                    </motion.div>
                    
                    <blockquote className="text-muted-foreground mb-8 italic leading-relaxed text-lg">
                      "{testimonial.quote}"
                    </blockquote>
                    
                    <div className="flex items-center">
                      {testimonial.leaderImage ? (
                        <img
                          src={testimonial.leaderImage}
                          alt={testimonial.leaderName}
                          className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-primary flex items-center justify-center text-white font-semibold mr-4">
                          {testimonial.leaderName.split(' ').map(name => name[0]).join('')}
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.leaderName}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                        {testimonial.companyName && (
                          <div className="text-xs text-gray-500">{testimonial.companyName}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Partners Section */}
        <section ref={partnersRef} className="relative py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      
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
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          {/* Floating Elements */}
          <motion.div
            className="absolute top-20 left-10 w-20 h-20 border border-white/20 rounded-full"
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity }
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-32 h-32 border border-cyan-400/30 rounded-full"
            animate={{ 
              rotate: -360,
              scale: [1.2, 1, 1.2]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 5, repeat: Infinity }
            }}
          />

          <div className="relative container mx-auto px-4">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 50 }}
              animate={partnersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-cyan-400 rounded-full text-sm font-medium mb-4">
                Our Network
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Trusted by{" "}
                <span className="bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent">
                  Industry Leaders
                </span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto text-left">
                We're proud to work alongside Rwanda's most innovative companies and international organizations,
                building lasting partnerships that drive mutual success.
              </p>
            </motion.div>
{/* Loading State */}
{loading && (
  <motion.div 
    className="flex justify-center items-center py-20"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <LoadingSpinner />
  </motion.div>
)}

{!loading && partners.length > 0 && (
  <div className="relative w-full overflow-hidden mb-7">
    <motion.div
      className="flex space-x-8 animate-scroll"
      variants={staggerContainer}
      initial="initial"
      animate={partnersInView ? "animate" : "initial"}
    >
      {[ ...partners].map((partner, index) => (
        <motion.div
          key={index}
          variants={{
            initial: { opacity: 0, scale: 0.8 },
            animate: {
              opacity: 1,
              scale: 1,
              transition: { delay: index * 0.05, duration: 0.4 },
            },
          }}
          whileHover={{
            scale: 1.1,
            y: -5,
            transition: { duration: 0.2 },
          }}
          className="group flex items-center justify-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-cyan-400/50 transition-all duration-300 hover:bg-white/10 cursor-pointer"
        >
          <div className="w-32 h-16 flex items-center justify-center">
            <img src={partner.image} alt="partner" className="max-h-full max-w-full object-contain" />
          </div>
        </motion.div>
      ))}
    </motion.div>
  </div>
)}


            {/* Professional Affiliations */}
            <div className="border-t border-white/20 pt-4">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                animate={partnersInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-3xl font-bold text-white mb-4">
                  Professional Affiliations & Certifications
                </h3>
                <p className="text-gray-300 max-w-2xl mx-auto text-left">
                  Our team holds prestigious certifications and memberships with leading professional bodies,
                  ensuring we deliver services that meet the highest international standards.
                </p>
              </motion.div>

              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate={partnersInView ? "animate" : "initial"}
              >
                {[
                  {
                    name: "Institute of Certified Public Accountants of Rwanda",
                    acronym: "ICPAR",
                    description: "Full membership and compliance with professional standards",
                    color: "from-blue-400 to-blue-600"
                  },
                  {
                    name: "Institute of Internal Auditors",
                    acronym: "IIA",
                    description: "Global certification in internal auditing practices",
                    color: "from-emerald-400 to-emerald-600"
                  },
                  {
                    name: "Association of Chartered Certified Accountants",
                    acronym: "ACCA",
                    description: "International accounting qualification and membership",
                    color: "from-purple-400 to-purple-600"
                  },
                  {
                    name: "Rwanda Institute of Management",
                    acronym: "RIM",
                    description: "Strategic management and leadership certification",
                    color: "from-cyan-400 to-cyan-600"
                  }
                ].map((affiliation, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      initial: { opacity: 0, y: 30, rotateY: -15 },
                      animate: { 
                        opacity: 1, 
                        y: 0, 
                        rotateY: 0,
                        transition: { delay: 0.5 + index * 0.1, duration: 0.6 }
                      }
                    }}
                    whileHover={{ 
                      y: -10, 
                      rotateY: 10,
                      transition: { duration: 0.3 }
                    }}
                    className="text-center p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/30 transition-all duration-300 group hover:bg-white/10"
                  >
                    <motion.div 
                      className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-br ${affiliation.color} rounded-2xl flex items-center justify-center relative overflow-hidden`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-xl font-bold text-white z-10">{affiliation.acronym}</span>
                      <motion.div
                        className="absolute inset-0 bg-white/20 rounded-full"
                        animate={{ scale: [1, 1.2, 1], opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    </motion.div>
                    <h4 className="font-semibold text-white mb-3 text-sm leading-tight group-hover:text-cyan-400 transition-colors">
                      {affiliation.name}
                    </h4>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                      {affiliation.description}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Call to Action */}
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={partnersInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/contact-us"
                    className="inline-flex items-center bg-gradient-to-r from-primary to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-primary hover:to-blue-700 transition-all duration-300 group shadow-xl hover:shadow-cyan-500/25"
                  >
                    Join Our Success Stories
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
             
              </div>
            </motion.div>
          </div>
               <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none -mb-3">
  <svg
    viewBox="0 0 1920 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-10 md:h-14"
  >
    <path d="M0,40 Q480,80 960,40 T1920,40 V80 H0 Z" fill="#305ca7" />
  </svg>
</div>
        </section>
      </div>
    
  )
}