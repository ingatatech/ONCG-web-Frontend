'use client'
import {  Target, TrendingUp, Shield, CheckCircle, Lightbulb, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
import {  useState } from "react";
import Link from "next/link";

const tabs = [
  { id: 'mission', label: 'Our Mission', icon: Target },
  { id: 'vision', label: 'Our Vision', icon: TrendingUp },
  { id: 'approach', label: 'Our Approach', icon: Lightbulb },
  { id: 'commitment', label: 'Our Commitment', icon: Shield }
];

const tabContent = {
  mission: {
    title: "Innovative Assurance & Advisory Services",
    content: "To provide its current and future customers with high quality, innovative assurance and advisory services based on latest professional knowledge and ethical values.",
    highlights: ["High-quality Solutions", "Focus On Innovation", "Backed by Latest Professional Knowledge","Serving Current and Future Customers"]
  },
  vision: {
    title: "Respected Regional Leader in Assurance & Advisory",
    content: "To be the most respected and leading assurance and advisory services provider in the Region. The region means where we operate.",
    highlights: ["Strive to be The Most Respected Provider", "Leading Assurance & Advisory Services", "Recognized Excellence in Every Region of Operation", "Stand Out Across All Regions of Operation"]
  },
  approach: {
    title: "Client-Centric Methodology",
    content: "We combine deep industry expertise with innovative methodologies, leveraging data-driven insights and cutting-edge technology to deliver customized solutions that address each client's unique challenges and opportunities.",
    highlights: ["Industry Expertise", "Data-Driven Insights", "Custom Solutions", "Proven Methods"]
  },
  commitment: {
    title: "Excellence in Every Engagement",
    content: "Our commitment extends beyond service delivery to building long-term relationships, ensuring continuous value creation, and maintaining the highest standards of professional excellence and ethical conduct.",
    highlights: ["Long-term Value", "Professional Excellence", "Ethical Standards", "Continuous Support"]
  }
};

const coreValues = [
  {
    icon: "🛡️",
    title: "Integrity",
    description: "We uphold the highest ethical standards, ensuring honesty and fairness in all our actions."
  },
  {
    icon: "🤝",
    title: "Respect",
    description: "We value diversity, treat everyone with dignity, and foster an inclusive environment."
  },
  {
    icon: "📌",
    title: "Accountability",
    description: "We take responsibility for our actions, decisions, and their impact on our stakeholders."
  },
  {
    icon: "👥",
    title: "Team Work",
    description: "We believe in collaboration, leveraging collective strengths to achieve shared success."
  },
  {
    icon: "🏆",
    title: "Excellence",
    description: "We strive for superior performance and continuous improvement in everything we do."
  },
  {
    icon: "🌱",
    title: "Sustainability",
    description: "We are committed to practices that support long-term growth and positive social impact."
  }
];

export default function AboutPage() {
   const [activeTab, setActiveTab] = useState('mission');




   
   
   
  return (
<>

    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
  <section className="relative py-10 flex items-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
  {/* Background Blobs */}
  <motion.div className="absolute inset-0 opacity-20">
    <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
    <div className="absolute bottom-32 right-20 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
  </motion.div>

  {/* Floating Particles (like homepage) */}
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
  <div className="relative z-10 container px-3  text-left max-w-6xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="max-w-6xl mx-auto"
    >
      {/* Tagline */}
      <motion.div 
        className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 text-white rounded-full text-sm font-medium mb-8"
      >
        Our Journey of Excellence
      </motion.div>

      {/* Title */}
      <motion.h1 
        className="text-4xl md:text-4xl lg:text-4xl font-bold text-white mb-3 leading-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 1 }}
      >
        About{" "}
        <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
          ON Consulting Group
        </span>
      </motion.h1>

      {/* Description */}
      <motion.p 
        className="text-xl text-gray-300 mb-5 max-w-6xl mx-auto leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
 ON Consulting Group Ltd “ONCG” is a business consulting firm registered and domiciled in the Republic of Rwanda with principal activities that are divided into four divisions including Research & Consulting Division, Business & Corporate Advisory, Accounting & Tax Advisory, and Audit & Assurance Services. ONCG Ltd is whole-owned subsidiary of ONCG Global Holdings Ltd, a multidisciplinary consulting group operating across African Continent.
      </motion.p>

      {/* CTA */}
      <motion.div 
        className="flex flex-col sm:flex-row gap-6 justify-start"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
      >
        <Link href="#foundation" className="inline-flex items-center bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300 group">
          Explore Our Journey
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
        </Link>
        <Link href="/leadership" className="inline-flex items-center border-2 border-white/30 text-white px-10 py-3 rounded-full font-medium hover:bg-white/10 backdrop-blur-sm transition-all duration-300 group">
          Meet the Leadership
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


      {/* Interactive Foundation Section */}
      <section id="foundation" className="py-5 bg-white relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto text-left">
              Built on strong principles that guide every decision and action we take in serving our clients
            </p>
          </motion.div>

          {/* Interactive Tabs */}
          <div className="max-w-6xl mx-auto mb-16">
            <div className="flex flex-wrap justify-center mb-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-6 py-3 mx-2 mb-2 rounded-full font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <tab.icon className="w-5 h-5 mr-2" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8  text-left max-w-5xl mx-auto"
              >
                <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {tabContent[activeTab as keyof typeof tabContent].title}
                </h3>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                {tabContent[activeTab as keyof typeof tabContent].content}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tabContent[activeTab as keyof typeof tabContent].highlights.map((highlight, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl p-4 shadow-md"
                    >
                      <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
                      <div className="text-sm font-medium text-gray-700">{highlight}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Core Values Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Core Values</h3>
            <p className="text-lg text-gray-600">The principles that drive our excellence and guide our relationships</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 text-center"
              >
                <motion.div 
                  className="text-4xl mb-4" 
                  whileHover={{ rotateY: 360, scale: 1.2 }} 
                  transition={{ duration: 0.6 }}
                >
                  {value.icon}
                </motion.div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed text-left max-w-3xl mx-auto">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose ONCG Section */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">Why Choose ONCG?</h2>
              <p className="text-lg text-gray-600 leading-relaxed text-left max-w-3xl mx-auto">
                Our unique combination of deep industry expertise, innovative methodologies, and client-centric 
                approach sets us apart in the consulting landscape.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                "Proven track record with 500+ successful client engagements",
                "Multi-disciplinary team of certified professionals and industry experts",
                "Customized solutions tailored to each client's unique challenges",
                "Comprehensive service portfolio covering audit, advisory, and consultancy",
                "Strong commitment to regulatory compliance and ethical standards",
                "Innovative use of technology and data-driven insights",
                "Long-term partnerships focused on sustainable business growth",
                "Global perspective with local market understanding"
              ].map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-4 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300"
                >
                  <CheckCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="relative py-10 bg-primary">
          {/* Background image with gradient overlay */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6 text-balance">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-white mb-8 text-pretty leading-relaxed">
              Let's discuss how ONCG can help you achieve your strategic objectives and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact-us"
                className="bg-primary text-white px-8 py-3 rounded-full  font-semibold hover:bg-primary transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                Contact Us Today
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