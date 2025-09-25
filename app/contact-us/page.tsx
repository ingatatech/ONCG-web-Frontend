"use client"

import { useState } from "react"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  User,
  MessageSquare,
  Building,
  ArrowRight,
  Linkedin,
  Twitter,
  Facebook,
  ChevronDown,
  PhoneCall,
  SubtitlesIcon
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { sendContactMessage } from "@/lib/api"

interface ContactForm {
  name: string
  subject: string
  email: string
  phone: string
  company: string
  serviceInterest: string
  message: string
}

interface Office {
  id: string
  name: string
  address: string
  phone: string
  email: string
  hours: string
  coordinates: { lat: number; lng: number }
}

const offices: Office[] = [
  {
    id: "main",
    name: "Headquarter",
    address: "Kimironko, Triump House",
    phone: "+(250) 788 303 061",
    email: " info@oncg.rw",
    hours: "Mon-Fri: 9:00 AM - 6:00 PM",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
]
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }
}
const services = [
  "Audit Services",
  "Tax Advisory", 
  "Business Consulting",
  "Financial Planning",
  "Risk Management",
  "ESG Consulting",
  "Digital Transformation",
  "Other"
]

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    subject: "",
    email: "",
    phone: "",
    company: "",
    serviceInterest: "",
    message: ""
  })
  
  const [selectedOffice, setSelectedOffice] = useState<string>("main")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Partial<ContactForm>>({})
  const [focusedField, setFocusedField] = useState<string>("")
  const [submitError, setSubmitError] = useState<string>("")

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }
    
    switch (name) {
      case "name":
      case "subject":
        if (!value.trim()) {
          newErrors[name as keyof ContactForm] = "This field is required"
        } else {
          delete newErrors[name as keyof ContactForm]
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = "Email is required"
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break
      case "phone":
        if (!value.trim()) {
          newErrors.phone = "Phone number is required"
        } else {
          delete newErrors.phone
        }
        break
      case "message":
        if (!value.trim()) {
          newErrors.message = "Message is required"
        } else if (value.trim().length < 10) {
          newErrors.message = "Message should be at least 10 characters"
        } else {
          delete newErrors.message
        }
        break
      default:
        break
    }
    
    setErrors(newErrors)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name as keyof ContactForm]) {
      validateField(name, value)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Clear previous errors
    setErrors({})
    setSubmitError("")
    
    // Validate all fields
    Object.keys(formData).forEach(key => {
      if (key !== "company" && key !== "serviceInterest") { // company and serviceInterest are optional
        validateField(key, formData[key as keyof ContactForm])
      }
    })
    
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) return
    
    setIsSubmitting(true)
    
    try {
      // Call the API
      await sendContactMessage({
        name: formData.name,
        subject: formData.subject,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        serviceInterest: formData.serviceInterest,
        message: formData.message
      })
      
      setIsSubmitting(false)
      setIsSubmitted(true)
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          name: "",
          subject: "",
          email: "",
          phone: "",
          company: "",
          serviceInterest: "",
          message: ""
        })
      }, 5000)
    } catch (error: any) {
      setIsSubmitting(false)
      console.error('Error sending message:', error)
      
      // Handle validation errors from the API
      if (error.response?.data?.errors) {
        const apiErrors: Partial<ContactForm> = {}
        error.response.data.errors.forEach((err: any) => {
          if (err.field && err.field in formData) {
            apiErrors[err.field as keyof ContactForm] = err.message
          }
        })
        setErrors(apiErrors)
      } else {
        // Show generic error message
        setSubmitError(error.response?.data?.message || 'Failed to send message. Please try again.')
      }
    }
  }

  return (
  
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
   <section className="relative py-6 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white">
    
  {/* Background Overlay */}
  <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full translate-y-32 -translate-x-32" />
  {/* Animated Blobs */}
  <motion.div className="absolute inset-0 opacity-20">
    <div className="absolute top-20 right-20 w-80 h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
    <div className="absolute bottom-32 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
  </motion.div>

  {/* Floating Particles */}
  <div className="absolute inset-0">
    {[...Array(15)].map((_, i) => (
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
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
    ))}
  </div>

  {/* Content */}
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="relative z-10 mx-auto px-4 text-center"
    >
      {/* Title */}
      <motion.h1 
        className="text-3xl md:text-3xl lg:text-5xl font-bold mb-6 leading-tight text-left max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        Get in{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Touch
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p 
              className="text-xl md:text-xl text-gray-300 mb-8 text-pretty text-left max-w-6xl mx-auto leading-relaxed"

        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Ready to transform your business? Our experts are here to provide 
        personalized solutions tailored to your unique challenges and opportunities.
      </motion.p>
  <motion.p 
        className="text-xl md:text-xl text-gray-200 mb-10 leading-relaxed text-left max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
 Reach out today and take the first step toward building stronger systems, 
          smarter strategies, and sustainable growth with our dedicated team of professionals
      </motion.p>

       <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-6 justify-start mb-4 text-left max-w-6xl mx-auto"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="mailto:info@oncg.com" className="inline-flex items-center  bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300 group shadow-2xl hover:shadow-primary/25">
                          Email Us
                    <Mail className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                   <Link href="tel:+250700000000"  className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group">
                      Call Us
                    <PhoneCall className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              </motion.div>
    </motion.div>

  {/* Scroll Indicator */}
   <motion.div
    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
    animate={{ y: [0, 10, 0] }}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <ChevronDown className="w-6 h-6 mx-auto text-white/70" /> 
  </motion.div>
</section>


 {/* Main Content */}
<section className="py-10">
  <div className="container mx-auto px-4">
    <div className="grid lg:grid-cols-2 gap-16 lg:items-stretch">
      {/* Contact Form */}
      <div className="animate-in fade-in slide-in-from-left duration-500 flex">
        <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden w-full flex flex-col">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full -translate-y-16 translate-x-16 opacity-10" />
          
          <div className="relative flex-1 flex flex-col">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                <p className="text-gray-600">We'll get back to you within 24 hours</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 flex-1 flex items-center justify-center">
                <div>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We'll be in touch soon.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
                {/* Name Fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => {
                          setFocusedField("")
                          validateField("name", formData.name)
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        } ${focusedField === "name" ? 'scale-105' : ''}`}
                        placeholder="John"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>
   <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => {
                          setFocusedField("")
                          validateField("email", formData.email)
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } ${focusedField === "email" ? 'scale-105' : ''}`}
                        placeholder="john@company.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                 
                </div>

                {/* Email and Phone */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("phone")}
                        onBlur={() => {
                          setFocusedField("")
                          validateField("phone", formData.phone)
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } ${focusedField === "phone" ? 'scale-105' : ''}`}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                   <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <div className="relative">
                      <SubtitlesIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("subject")}
                        onBlur={() => {
                          setFocusedField("")
                          validateField("subject", formData.subject)
                        }}
                        className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        } ${focusedField === "subject" ? 'scale-105' : ''}`}
                        placeholder="Your subject"
                      />
                    </div>
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.subject}
                      </p>
                    )}
                  </div>
                </div>

                {/* Company and Service */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("company")}
                        className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                          focusedField === "company" ? 'scale-105' : ''
                        }`}
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interest
                    </label>
                    <select
                      name="serviceInterest"
                      value={formData.serviceInterest}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service} value={service}>{service}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="relative flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => {
                      setFocusedField("")
                      validateField("message", formData.message)
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none  ${
                      errors.message ? 'border-red-500' : 'border-gray-300'
                    } ${focusedField === "message" ? 'scale-105' : ''}`}
                    placeholder="Tell us about your project or how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 flex items-center animate-in fade-in slide-in-from-top-1 duration-200">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Error */}
                {submitError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2 mt-auto"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="animate-in fade-in slide-in-from-right duration-500 flex">
        <div className="space-y-8 w-full flex flex-col">
          {/* Office Selection */}
          <div className="bg-white rounded-2xl shadow-xl p-8 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Our Offices</h3>
            
            <div className="space-y-3 mb-6 flex-1">
              {offices.map(office => (
                <button
                  key={office.id}
                  onClick={() => setSelectedOffice(office.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                    selectedOffice === office.id
                      ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{office.name}</h4>
                      <p className="text-sm text-gray-600">{office.address}</p>
                    </div>
                    <ArrowRight className={`h-4 w-4 transition-transform duration-200 ${
                      selectedOffice === office.id ? 'rotate-90 text-blue-600' : 'text-gray-400'
                    }`} />
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Office Details */}
            {selectedOffice && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 mt-auto">
                {offices.filter(office => office.id === selectedOffice).map(office => (
                  <div key={office.id} className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Address</p>
                        <p className="text-gray-600">{office.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Phone</p>
                        <p className="text-gray-600">{office.phone}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Email</p>
                        <p className="text-gray-600">{office.email}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900">Business Hours</p>
                        <p className="text-gray-600">{office.hours}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Social Links */}
          <div className="bg-gradient-to-r from-blue-50 rounded-2xl shadow-xl p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
            
            <div className="flex space-x-4 mb-4">
              <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110">
                <Linkedin className="h-5 w-5" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 bg-sky-500 text-white rounded-xl hover:bg-sky-600 transition-all duration-200 hover:scale-110">
                <Twitter className="h-5 w-5" />
              </button>
              <button className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 hover:scale-110">
                <Facebook className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600">
              Follow us for industry insights, company updates, and expert tips.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      {/* Map Section */}
      <section className="relative py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
              <p className="text-gray-600 text-lg">Find us at our convenient locations worldwide</p>
            </div>
            
            {/* Mock Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="h-96 bg-gradient-to-br from-blue-100 via-cyan-100 to-green-100 relative flex items-center justify-center">
               
                   {/* Content */}
                <div className="relative z-10 w-full h-full flex items-center justify-center">
                  <iframe
                    title="ONCG Office Map"
                    src="https://www.google.com/maps?q=Triumph+House+Kimironko+Kigali&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, borderRadius: "1rem", minHeight: "350px" }}
                    allowFullScreen={true}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>

                {/* Floating particles */}
                <div
                  className="absolute top-2 left-2 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute top-4 right-3 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "1s" }}
                ></div>
                <div
                  className="absolute bottom-3 left-4 w-1 h-1 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                  style={{ animationDelay: "1.5s" }}
                ></div> 
               
              </div>
              
            
            </div>
          </div>
        </div>
                                       {/* Bottom wave */}
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