'use client'
import { Mail, Phone, MapPin, Award, Users, Linkedin, ArrowRight, Briefcase, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchLeaders } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LoadingSpinner from "@/components/LoadingSpinner";

// Leader interface type
interface Leader {
  id: string
  name: string
  title: string
  bio: string
  image: string
  location: string
  experience: number
  projectsLed: number
  linkedinUrl?: string
  email?: string
  phone?: string
  education: string[]
  specialties: string[]
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}


export default function LeadershipPage() {

  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaders = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetchLeaders("isActive=true&limit=200&sortBy=sortOrder&sortOrder=asc");
        const data = response.leaders || response.data || response;
        
        // Handle both array response and object with leaders property
        const leadersArray = Array.isArray(data) ? data : (data.leaders || []);
        setLeaders(leadersArray);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leaders');
        console.error('Error loading leaders:', err);
      } finally {
        setLoading(false);
      }
    };

    loadLeaders();
  }, []);


  const totalExperience = leaders.reduce((sum, leader) => sum + leader.experience, 0);
  const totalProjects = leaders.reduce((sum, leader) => sum + leader.projectsLed, 0);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Hero Section */}
        <section className="relative py-10 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
          {/* Background Effects */}
          <motion.div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
            <div className="absolute bottom-32 right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
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
          <div className="relative z-10 container px-3 text-left max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="max-w-6xl mx-auto"
            >
              {/* Tagline */}
              <motion.div className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-8">
                Meet Our Exceptional Leaders
              </motion.div>

              {/* Title */}
              <motion.h1 
                className="text-4xl md:text-4xl lg:text-4xl font-bold text-white mb-3 leading-tight"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
              >
                Leadership{" "}
                <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                  Team
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p 
                className="text-xl text-gray-300 mb-5 max-w-6xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
              >
                Our leadership team combines decades of industry experience with innovative thinking to drive exceptional results for our clients. Each leader brings unique expertise and a shared commitment to excellence, integrity, and client success.
              </motion.p>

              {/* CTA */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-6 justify-start"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 1 }}
              >
                <Link href="#team" className="inline-flex items-center bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300 group">
                  Meet the Leadership
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link href="/contact-us" className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group">
                  Connect With Us
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
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

        {/* Team Section */}
        <section id="team" className="py-10 bg-white relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Leadership Team</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
                Experienced professionals dedicated to delivering excellence and driving innovation in every client engagement
              </p>
            </motion.div>


            {/* Leaders Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-center py-20">
                <div className="text-red-600 text-lg mb-4">Failed to load leadership team</div>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : leaders.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-gray-600 text-lg mb-4">No leaders found</div>
                <p className="text-gray-500">Please check back later or contact us for more information.</p>
              </div>
            ) : (
         <AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
  >
    {leaders.map((leader, index) => (
      <motion.div
        key={leader.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.05, y: -8 }}
        className="bg-white rounded-3xl  transition-all duration-500 overflow-hidden border border-gray-100 cursor-pointer group relative max-w-6xl mx-auto"
      >
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30 opacity-0  transition-opacity duration-500 rounded-3xl"></div>
        
        {/* Header Section with Avatar */}
        <div className="relative p-4 pb-4">
          {/* LinkedIn Badge */}
          <div className="absolute top-4 right-4 z-10">
            {leader.linkedinUrl && (
              <a
                href={leader.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center w-10 h-10 rounded-full bg-white shadow-lg text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:scale-110"
                onClick={(e) => e.stopPropagation()}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white ring-4  transition-all duration-300">
                <AvatarImage 
                  src={leader.image || "/api/placeholder/300/400"} 
                  alt={leader.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                  {leader.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
<div className="px-6 pb-6">

              {/* Name and Title */}
<div className="mt-4 space-y-1">
  <h3 className="text-left text-sm font-bold text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
    {leader.name}
  </h3>
  <p className="text-left font-semibold text-sm">
    {leader.title}
  </p>
</div>

{/* Stats Pills */}
<div className="flex items-start justify-start space-y-1 mt-3">
  <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium">
   <h3 className="text-left"> {leader.projectsLed} Projects Led</h3>
  </div>
  <div className="flex items-start text-gray-500 text-xs">
    <MapPin className="w-3 h-3 mr-1" />
    {leader.location}
  </div>
</div>
</div>
        {/* Contact Section */}
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-2xl p-4 space-y-3 group-hover:bg-blue-50 transition-colors duration-300">
            {leader.email && (
              <div className="flex items-center text-gray-600 text-sm group-hover:text-gray-700">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <a
                  href={`mailto:${leader.email}`}
                  className="hover:underline hover:text-blue-700 transition-colors duration-200 truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {leader.email}
                </a>
              </div>
            )}

            {leader.phone && (
              <div className="flex items-start text-gray-600 text-sm group-hover:text-gray-700">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center mr-3 group-hover:bg-emerald-200 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <a
                  href={`tel:${leader.phone}`}
                  className="hover:underline hover:text-emerald-700 transition-colors duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  {leader.phone}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400/0 to-indigo-400/0 group-hover:from-blue-400/5 group-hover:to-indigo-400/5 transition-all duration-500 pointer-events-none"></div>
      </motion.div>
    ))}
  </motion.div>
</AnimatePresence>
            )}
          </div>
        </section>

        {/* Leadership Stats */}
        <section className="py-10 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Leadership Excellence</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto text-left">
                Our leadership team's collective experience and achievements speak to our commitment to excellence
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { number: loading ? "..." : `${totalExperience}+`, label: "Years Combined Experience", icon: Award },
                { number: loading ? "..." : `${totalProjects}+`, label: "Projects Successfully Led", icon: Briefcase },
                { number: loading ? "..." : leaders.length.toString(), label: "Senior Leaders", icon: Users },
                { number: "100%", label: "Client Satisfaction Rate", icon: GraduationCap }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                >
                  <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-10 bg-primary">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
          <div className="relative container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6 text-balance">
                Ready to Work with Our Expert Team?
              </h2>
              <p className="text-xl text-white mb-8 text-pretty leading-relaxed">
                Connect with our leadership team to discuss how we can help transform your business and achieve your strategic goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact-us"
                  className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-all duration-200 hover:shadow-lg hover:scale-105"
                >
                  Contact Us Today
                </a>
                <a
                  href="/services"
                  className="bg-transparent border-2 border-white/20 text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Explore Our Services
                </a>
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

    </>
  )
}