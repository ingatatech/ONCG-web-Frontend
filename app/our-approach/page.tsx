"use client"

import Link from "next/link"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useRef } from "react"
import { 
  ArrowRight, 
  CheckCircle, 
  Shield,
  Users,
  Lightbulb,
  Target,
  BarChart3,
  Zap,
  ArrowUpRight,
  Search,
  Settings,
  Rocket,
  Brain,
  Sparkles,

} from "lucide-react"
import ServicesHoverModal from "@/components/ServicesHoverModal"
import React from "react"

const approachSteps = [
  {
    icon: Search,
    title: "Discovery & Analysis",
    description: "We begin with comprehensive research and analysis of your business environment, challenges, and objectives.",
    details: [
      "Stakeholder interviews and workshops",
      "Business process mapping",
      "Risk assessment and gap analysis",
      "Market and regulatory landscape review"
    ],
    color: "from-blue-500 to-cyan-500",
    delay: 0
  },
  {
    icon: Lightbulb,
    title: "Strategic Planning",
    description: "Develop customized strategies and frameworks tailored to your specific needs and industry requirements.",
    details: [
      "Solution architecture design",
      "Implementation roadmap creation",
      "Resource allocation planning",
      "Timeline and milestone definition"
    ],
    color: "from-emerald-500 to-green-500",
    delay: 0.2
  },
  {
    icon: Settings,
    title: "Implementation",
    description: "Execute the planned solutions with precision, ensuring minimal disruption to your operations.",
    details: [
      "Phased rollout approach",
      "Change management support",
      "Training and capability building",
      "Quality assurance protocols"
    ],
    color: "from-purple-500 to-indigo-500",
    delay: 0.4
  },
  {
    icon: BarChart3,
    title: "Monitoring & Optimization",
    description: "Continuously monitor performance and optimize processes to ensure sustained value delivery.",
    details: [
      "Performance tracking and reporting",
      "Continuous improvement initiatives",
      "Regular health checks",
      "Long-term partnership support"
    ],
    color: "from-orange-500 to-red-500",
    delay: 0.6
  }
]

const coreValues = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We uphold the highest ethical standards in all our professional dealings.",
    color: "from-blue-600 to-blue-800"
  },
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for exceptional quality in every service we deliver.",
    color: "from-emerald-600 to-emerald-800"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We work as trusted partners, fostering long-term relationships.",
    color: "from-purple-600 to-purple-800"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We embrace cutting-edge solutions and continuous improvement.",
    color: "from-orange-600 to-orange-800"
  }
]

const methodologies = [
  {
    title: "Agile Project Management",
    description: "Flexible, iterative approach ensuring rapid value delivery and adaptability to changing requirements.",
    features: ["Sprint-based delivery", "Regular stakeholder feedback", "Continuous improvement"],
    icon: Rocket
  },
  {
    title: "Risk-Based Auditing",
    description: "Focus resources on areas of highest risk and impact, maximizing audit effectiveness and efficiency.",
    features: ["Risk assessment matrix", "Materiality analysis", "Control testing"],
    icon: Shield
  },
  {
    title: "Data-Driven Insights",
    description: "Leverage advanced analytics and business intelligence to inform strategic recommendations.",
    features: ["Statistical analysis", "Predictive modeling", "Performance dashboards"],
    icon: BarChart3
  },
  {
    title: "Stakeholder Engagement",
    description: "Comprehensive communication strategy ensuring all parties are informed and aligned throughout the process.",
    features: ["Regular updates", "Executive briefings", "Training sessions"],
    icon: Users
  }
]

const differentiators = [
  {
    title: "Local Expertise with Global Standards",
    description: "Deep understanding of Rwanda's business landscape combined with international best practices.",
    stat: "15+",
    label: "Years in Rwanda Market"
  },
  {
    title: "Certified Professional Team",
    description: "Our team holds prestigious international certifications and continuous professional development.",
    stat: "95%",
    label: "Certified Professionals"
  },
  {
    title: "Technology-Enabled Solutions",
    description: "Leveraging cutting-edge tools and platforms to deliver efficient and effective services.",
    stat: "50+",
    label: "Technology Partners"
  },
  {
    title: "Proven Track Record",
    description: "Consistent delivery of high-quality results across diverse industries and project complexities.",
    stat: "500+",
    label: "Successful Projects"
  }
]

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

export default function OurApproachPage() {
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  
  const heroRef = useRef(null)
  const approachRef = useRef(null)
  const valuesRef = useRef(null)
  const methodologyRef = useRef(null)
  const differentiatorRef = useRef(null)
//   const ctaRef = useRef(null)
  
  const heroInView = useInView(heroRef, { once: true })
  const approachInView = useInView(approachRef, { once: true, margin: "-100px" })
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" })
  const methodologyInView = useInView(methodologyRef, { once: true, margin: "-100px" })
  const differentiatorInView = useInView(differentiatorRef, { once: true, margin: "-100px" })
//   const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative py-10 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
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

        <div className="relative container mx-auto px-4 py-4 z-10">
          <motion.div 
            className=" text-left max-w-6xl mx-auto"
            initial="initial"
            animate={heroInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            <motion.div 
              variants={fadeInUp}
              className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-8 hover:bg-white/10 transition-colors group"
            >
              <Brain className="w-4 h-4 mr-2 text-cyan-400" />
              Our Methodology & Philosophy
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-8 text-balance leading-tight"
            >
              Our Strategic{" "}
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
                Approach
              </motion.span>
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-gray-300 mb-12 text-pretty max-w-6xl mx-auto leading-relaxed"
            >
              We believe in a systematic, client-centric approach that combines industry expertise with 
              innovative methodologies to deliver measurable results and sustainable value.
            </motion.p>
            
             {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-start text-left max-w-6xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
            >
              {/* Hover-triggered Services modal button */}
              <ServicesHoverModal />
                            <motion.div
                                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                   
              <Link
                href="/contact-us"
                className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </Link>
            </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

     {/* Our Approach Process - Modern Redesign */}
<section ref={approachRef} className="py-8 relative overflow-hidden">
  {/* Dynamic Background */}
  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
    {/* Animated mesh gradient */}
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-blob dark:bg-purple-900"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 dark:bg-yellow-900"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 dark:bg-pink-900"></div>
    </div>
    
    {/* Grid pattern overlay */}
    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
  </div>

  <div className="container mx-auto px-4 relative z-10">
    {/* Header Section */}
    <motion.div 
      className="text-center mb-20"
      initial={{ opacity: 0, y: 50 }}
      animate={approachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-slate-800/80 backdrop-blur-sm border border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold mb-6 shadow-lg "
        whileHover={{ scale: 1.05, y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Our Proven Process
        <ArrowRight className="w-4 h-4 ml-2" />
      </motion.div>
      
      <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6 leading-tight text-left max-w-6xl mx-auto ">
        Four Steps to{" "}
        <span className="relative">
          <span className="bg-gradient-to-r from-indigo-600 via-primary to-cyan-600 bg-clip-text text-transparent">
            Excellence
          </span>
          <motion.div
            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-full"
            initial={{ scaleX: 0 }}
            animate={approachInView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </span>
      </h2>
      
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-6xl mx-auto leading-relaxed text-left">
        Our systematic methodology transforms complex challenges into streamlined solutions, 
        delivering measurable results at every phase.
      </p>
    </motion.div>

    {/* Process Cards Grid */}
    <motion.div 
      className="grid lg:grid-cols-4 gap-8 mb-8 text-left max-w-6xl mx-auto"
      variants={staggerContainer}
      initial="initial"
      animate={approachInView ? "animate" : "initial"}
    >
      {approachSteps.map((step, index) => {
        const IconComponent = step.icon
        
        return (
          <motion.div
            key={index}
            variants={{
              initial: { opacity: 0, y: 80 },
              animate: { 
                opacity: 1, 
                y: 0,
                transition: { delay: step.delay, duration: 0.6, ease: "easeOut" }
              }
            }}
            className="group relative"
          >
            {/* Connection Line */}
            {index < approachSteps.length - 1 && (
              <motion.div
                className="hidden xl:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-indigo-300 to-cyan-300 dark:from-indigo-600 dark:to-cyan-600 z-10"
                initial={{ scaleX: 0 }}
                animate={approachInView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ delay: step.delay + 0.3, duration: 0.5 }}
              >
                <div className="absolute -right-1 top-1/2 w-2 h-2 bg-cyan-400 rounded-full transform -translate-y-1/2"></div>
              </motion.div>
            )}

            {/* Main Card */}
            <motion.div
              className="relative bg-white/70 h-full flex flex-col dark:bg-slate-800/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-500"
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Background Gradient on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`}></div>
              
     
              {/* Icon */}
              <motion.div 
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} p-4 mb-6 relative overflow-hidden shadow-lg`}
                whileHover={{ 
                  rotate: [0, -5, 5, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.5 }}
              >
                <IconComponent className="w-8 h-8 text-white relative z-10" />
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0, 0.4, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                />
              </motion.div>

              {/* Content */}
              <div className="relative z-10">
                <div className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mb-3 tracking-wider uppercase">
                  Phase {index + 1}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {step.description}
                </p>

                {/* Key Points */}
                <div className="space-y-3">
                  {step.details.slice(0, 3).map((detail, detailIndex) => (
                    <motion.div 
                      key={detailIndex} 
                      className="flex items-start text-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={approachInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ delay: step.delay + 0.2 + detailIndex * 0.1 }}
                    >
                      <div className="w-5 h-5 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center mr-3 mt-0.5 shadow-sm">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {detail}
                      </span>
                    </motion.div>
                  ))}
                </div>

            
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </motion.div>

    {/* Process Flow Visualization */}
    <motion.div
      className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 shadow-xl"
      initial={{ opacity: 0, y: 50 }}
      animate={approachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay: 1.5 }}
    >
      <div className="text-center mb-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Seamless Process Flow
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Each phase builds upon the previous, ensuring continuous momentum and optimal results.
        </p>
      </div>

      {/* Flow Steps */}
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0 lg:space-x-8">
        {approachSteps.map((step, index) => {
          const IconComponent = step.icon
          
          return (
            <React.Fragment key={index}>
              <motion.div
                className="flex flex-col items-center text-center group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                // transition={{ duration: 0.2 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={approachInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ delay: 1.8 + index * 0.1, duration: 0.5 }}
              >
                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-5 mb-4 shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                  <IconComponent className="w-10 h-10 text-white" />
                </div>
                
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {step.title}
                </div>
                
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Phase {index + 1}
                </div>
              </motion.div>

              {/* Arrow between steps */}
              {index < approachSteps.length - 1 && (
                <motion.div
                  className="hidden lg:block text-gray-300 dark:text-gray-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={approachInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 2 + index * 0.1, duration: 0.3 }}
                >
                  <ArrowRight className="w-6 h-6" />
                </motion.div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </motion.div>

  
  </div>
</section>

      {/* Core Values Section */}
      <section ref={valuesRef} className="py-10 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 relative overflow-hidden">
        {/* Background Elements */}
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
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm text-cyan-400 rounded-full text-sm font-medium mb-4">
              Our Foundation
            </div>
            <h2 className="text-4xl lg:text-4xl font-bold text-white mb-6 text-left max-w-6xl mx-auto">
              Core Values That{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-primary bg-clip-text text-transparent">
                Drive Us
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-6xl mx-auto text-left">
              Our values form the foundation of everything we do, guiding our decisions, 
              actions, and relationships with clients and stakeholders.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate={valuesInView ? "animate" : "initial"}
          >
            {coreValues.map((value, index) => {
              const IconComponent = value.icon
              return (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, y: 50, rotateY: -15 },
                    animate: { 
                      opacity: 1, 
                      y: 0, 
                      rotateY: 0,
                      transition: { delay: index * 0.1, duration: 0.6 }
                    }
                  }}
                  whileHover={{ 
                    y: -10, 
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all duration-500 hover:bg-white/10"
                >
                  <div className="flex items-center mb-6">
                    <motion.div 
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${value.color} p-4 mr-6`}
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                      {value.title}
                    </h3>
                  </div>
                  <p className="text-gray-200 text-lg leading-relaxed group-hover:text-white transition-colors">
                    {value.description}
                  </p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Methodologies Section */}
      <section ref={methodologyRef} className="py-10 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 50 }}
            animate={methodologyInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
              Our Methodologies
            </div>
            <h2 className="text-4xl lg:text-4xl font-bold text-foreground mb-6 max-w-6xl mx-auto">
              Proven{" "}
              <span className="bg-gradient-to-r from-blue-500 to-primary bg-clip-text text-transparent">
                Frameworks
              </span>
            </h2>
            <p className="text-xl text-muted-foreground  text-left max-w-6xl mx-auto">
              We employ industry-leading methodologies and frameworks to ensure consistent, 
              high-quality delivery across all our engagements.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="initial"
            animate={methodologyInView ? "animate" : "initial"}
          >
            {methodologies.map((methodology, index) => {
              const IconComponent = methodology.icon
              return (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, y: 50 },
                    animate: { 
                      opacity: 1, 
                      y: 0,
                      transition: { delay: index * 0.1, duration: 0.6 }
                    }
                  }}
                  whileHover={{ y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-primary p-4 mb-6">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    {methodology.title}
                  </h3>
                  
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {methodology.description}
                  </p>

                  <ul className="space-y-3">
                    {methodology.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mr-3">
                          <CheckCircle className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section ref={differentiatorRef} className="py-10 bg-gradient-to-br from-primary/10 to-blue-50 dark:from-primary/5 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            animate={differentiatorInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-full text-sm font-medium mb-4">
              Our Differentiators
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              What Sets{" "}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Us Apart
              </span>
            </h2>
            <p className="text-xl text-muted-foreground text-left max-w-6xl mx-auto">
              Our unique combination of local insight, global expertise, and innovative approach 
              delivers exceptional value to our clients.
            </p>
          </motion.div>

          <motion.div 
            className="grid lg:grid-cols-2 gap-12"
            variants={staggerContainer}
            initial="initial"
            animate={differentiatorInView ? "animate" : "initial"}
          >
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, scale: 0.9 },
                  animate: { 
                    opacity: 1, 
                    scale: 1,
                    transition: { delay: index * 0.1, duration: 0.6 }
                  }
                }}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-6">
                  <motion.div
                    className="text-4xl font-bold text-primary"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {item.stat}
                  </motion.div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {item.label}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {item.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

 

      {/* CTA Section */}
      <section className="relative py-10 px-4 bg-primary text-primary-foreground">
         <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-balance">Ready to Experience Our Approach?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 text-pretty">
            Let's discuss how our proven methodology can help you achieve your strategic objectives.
          </p>
          <div className="flex justify-center">
        
           <ServicesHoverModal/>
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
    </div>
  )
}
