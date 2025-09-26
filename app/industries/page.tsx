
"use client"
import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
   ArrowRight, ArrowUpRight,  Building2, Award,
  Users, Target, Calendar, BookOpen,
   Globe2, ChevronDown, ChevronUp, 
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"

import { ProfileModal } from "@/components/profile-modal"
import InsightModal from "@/components/insight-modal"
import Link from "next/link"
import {  fetchIndustryBySlug, } from "@/lib/api"
import LoadingSpinner from "@/components/LoadingSpinner"
import ServicesHoverModal from "@/components/ServicesHoverModal"

// Types for API data
interface IndustryExpert {
 id: string;
  name: string;
  title: string;
  education: string[];
  experience: string;
  specialties: string[];
  professionalMembership: string[];
  image?: string;
  bio?: string;
  linkedinUrl?: string
  email?: string
  phone?: string
}

interface IndustryCaseStudy {
  id: string
  title: string
  description:string
  challenge: string
  solution: string
  result: string
  impact: string
}

interface Insight {
  id: string
  title: string
  content: string
  industry: string
  createdAt: string
  image: string
}

interface IndustryData {
  id: string
  name: string
  slug: string
  industryDescription: string
  isActive: boolean
  experts: IndustryExpert[]
  caseStudies: IndustryCaseStudy[]
  insights: Insight[]
}

type TransformedExpert = {
  name: string;
  title: string;
  education: string[];
  experience: string;
  specialties: string[];
  professionalMembership: string[];
  image?: string;
  bio?: string;
  linkedinUrl?: string
  email?: string
  phone?: string

}
function IndustriesPageContent() {
  const searchParams = useSearchParams()
  const [currentIndustryData, setCurrentIndustryData] = useState<IndustryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExpert, setSelectedExpert] = useState<TransformedExpert | null>(null)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  // Case studies state with enhanced functionality
  const [showAllCaseStudies, setShowAllCaseStudies] = useState(false);
  const [expandedCaseStudies, setExpandedCaseStudies] = useState<Set<string>>(new Set());
  const INITIAL_CASE_STUDIES_COUNT = 4; // Show 4 case studies initially
  const DESCRIPTION_PREVIEW_LENGTH = 150; // Characters to show in preview
  
  useEffect(() => {
    const loadIndustry = async () => {
      setLoading(true)
      setError(null)
      const industrySlug = searchParams.get("name")

      if (!industrySlug) {
        setError("industry name not specified in URL.")
        setLoading(false)
        return
      }

      try {
        const industryResponse = await fetchIndustryBySlug(industrySlug)
        const industry = industryResponse.data || industryResponse

        if (industry) {
          setCurrentIndustryData(industry)
        } else {
          setError("Industry not found.")
        }
      } catch (err) {
        console.error("Error fetching industry:", err)
        setError("Failed to load industry data.")
      } finally {
        setLoading(false)
      }
    }

    loadIndustry()
  }, [searchParams])
  
  useEffect(() => {
    if (error) {
      router.push("/industries")
    }
  }, [error, router])

  // Reset case studies view when industry changes
  useEffect(() => {
    setShowAllCaseStudies(false);
    setExpandedCaseStudies(new Set());
  }, [currentIndustryData]);

  // Helper function to toggle case study expansion
  const toggleCaseStudyExpansion = (caseStudyId: string) => {
    const newExpanded = new Set(expandedCaseStudies);
    if (newExpanded.has(caseStudyId)) {
      newExpanded.delete(caseStudyId);
    } else {
      newExpanded.add(caseStudyId);
    }
    setExpandedCaseStudies(newExpanded);
  };

  // Helper function to truncate text
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };
    
  const handleExpertClick = (expert: IndustryExpert) => {
    const transformedExpert = {
      name: expert.name,
      title: expert.title,
      image: expert.image || "/placeholder.svg",
      bio: expert.bio,
      specialties: expert.specialties,
      education: expert.education,
      experience: expert.experience,
      linkedinUrl: expert.linkedinUrl,
      professionalMembership:expert.professionalMembership,
      email: expert.email,
      phone: expert.phone,
    }

    setSelectedExpert(transformedExpert)
    setIsProfileModalOpen(true)
  }
  
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedInsight(null)
  }

  const handleInsightClick = (insight: Insight) => {
    setSelectedInsight(insight)
    setIsModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!currentIndustryData) {
     return (
         <div className="min-h-screen bg-white flex items-center justify-center">
           <div className="text-center">
             <p className="text-gray-600">Industry not found</p>
             <Link href="/">
               <Button className="mt-4">Back to Home</Button>
             </Link>
           </div>
         </div>
       );
  }

  // Get case studies to display
  const caseStudiesToShow = showAllCaseStudies 
    ? currentIndustryData.caseStudies 
    : currentIndustryData.caseStudies?.slice(0, INITIAL_CASE_STUDIES_COUNT) || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
     <section className="relative py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white overflow-hidden">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-48 translate-x-48 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/20 rounded-full translate-y-32 -translate-x-32" />

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
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Icon + Tagline */}
            <div className="flex items-start justify-start mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left max-w-6xl mx-auto ">
              <Badge
                variant="outline"
                className="text-sm font-medium border-white/40 text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full"
              >
                <Building2 className="w-4 h-4 mr-2 text-yellow-400" />
                {currentIndustryData.name}
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left max-w-6xl mx-auto">
              {currentIndustryData.name}
            </h1>

            {/* Subtitle */}
            <p className="text-xl  text-blue-100 mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 text-left max-w-6xl mx-auto">
            Delivering innovative strategies and sector-focused insights that empower businesses in every industry to drive growth, ensure compliance, and stay competitive in a dynamic global marketplace.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-start animate-in fade-in slide-in-from-bottom-10 duration-700 text-left max-w-6xl mx-auto">
             
              <Link href="/about" className="inline-flex items-start bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-white hover:text-primary transition-all duration-300 group">
        View Case Studies
          <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
        </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-10">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1  items-start">
              {/* Left - Description */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                    Industry Overview
                  </h2>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8 break-words"  dangerouslySetInnerHTML={{
                        __html:currentIndustryData.industryDescription}}/>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    500+ Clients Served
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Industry Leader
                  </div>
                  <div className="flex items-center">
                    <Globe2 className="h-4 w-4 mr-2" />
                    Global Reach
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Case Studies Section */}
      <section className="py-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-6 bg-emerald-100 text-emerald-700 px-6 py-2 text-sm font-semibold">
                <Target className="w-4 h-4 mr-2" />
                Success Stories
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Transformational Results
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Real outcomes from our industry expertise and innovative solutions that drive measurable impact
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
              {caseStudiesToShow?.map((caseStudy, index) => {
                const isExpanded = expandedCaseStudies.has(caseStudy.id);
                const shouldShowToggle = caseStudy.description.length > DESCRIPTION_PREVIEW_LENGTH;
                
                return (
                  <motion.div
                    key={caseStudy.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="group"
                  >
                    <Card className="relative overflow-hidden border-0 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                      {/* Gradient Border Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
                           style={{ padding: '2px' }}>
                        <div className="h-full w-full bg-white rounded-lg" />
                      </div>
                      
                      {/* Main Content */}
                      <div className="relative z-10 p-1 h-full">
                        <CardContent className="pt-0 h-full flex flex-col">
                          {/* Header Section */}
                          <div className="flex items-start justify-between mb-8">
                            <div className="flex items-start space-x-4">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                                  <Award className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                                  {caseStudy.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-3">
                                  <Badge 
                                    variant={caseStudy.impact === 'Transformational' ? 'default' : 'secondary'}
                                    className={`px-3 py-1 text-xs font-semibold ${
                                      caseStudy.impact === 'Transformational' 
                                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                    }`}
                                  >
                                    {caseStudy.impact} Impact
                                  </Badge>
                                  
                                </div>
                              </div>
                            </div>
                          
                          </div>

                          {/* Content Section */}
                          <div className="flex-1 space-y-6">
                            <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-emerald-50 border border-blue-100 rounded-2xl p-6 relative overflow-hidden">
                              {/* Background Pattern */}
                              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full -translate-y-16 translate-x-16" />
                              
                              <div className="relative">
                                <h4 className="font-bold text-blue-900 mb-4 flex items-center text-lg">
                                  <div className="w-2 h-2 rounded-full animate-pulse" />
                                  Solution Overview
                                </h4>
                                <div className=" leading-relaxed">
                                  <div 
                                    dangerouslySetInnerHTML={{
                                      __html: isExpanded 
                                        ? caseStudy.description 
                                        : truncateText(caseStudy.description, DESCRIPTION_PREVIEW_LENGTH)
                                    }}
                                    className="prose prose-sm max-w-none"
                                  />
                                  
                                  {shouldShowToggle && (
                                    <Button
                                      variant="link"
                                      onClick={() => toggleCaseStudyExpansion(caseStudy.id)}
                                      className="mt-3 p-0 h-auto font-semibold text-blue-600 hover:text-blue-700 flex items-center group/toggle"
                                    >
                                      {isExpanded ? (
                                        <>
                                          View Less
                                          <ChevronUp className="w-4 h-4 ml-1 group-hover/toggle:-translate-y-0.5 transition-transform" />
                                        </>
                                      ) : (
                                        <>
                                          View More
                                          <ChevronDown className="w-4 h-4 ml-1 group-hover/toggle:translate-y-0.5 transition-transform" />
                                        </>
                                      )}
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Show More/Less Button for Case Studies List */}
            {currentIndustryData.caseStudies && currentIndustryData.caseStudies.length > INITIAL_CASE_STUDIES_COUNT && (
              <div className="text-center">
                <Button
                  onClick={() => setShowAllCaseStudies(!showAllCaseStudies)}
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 font-semibold border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-300"
                >
                  {showAllCaseStudies ? (
                    <>
                      Show Less Case Studies
                      <ChevronUp className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      View All {currentIndustryData.caseStudies.length} Case Studies
                      <ChevronDown className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Expert Team */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-purple-100 text-purple-700 px-4 py-2">
                <Users className="w-4 h-4 mr-2" />
                Expert Team
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Industry Leaders
              </h2>
              <p className="text-lg text-gray-600 text-left max-w-6xl mx-auto">
                Meet our specialized team with deep {currentIndustryData.name.toLowerCase()} industry expertise
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentIndustryData.experts?.map((expert, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className="p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group border-0 bg-white relative overflow-hidden"
                    onClick={() => handleExpertClick(expert)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <CardContent className="pt-6 text-center relative">
                      <div className="relative">
                        <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-primary/20 shadow-lg">
                          <AvatarImage src={expert.image || "/placeholder.svg"} alt={expert.name} />
                          <AvatarFallback className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-lg font-bold">
                            {expert.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="absolute -top-2 -right-2">
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        {expert.name}
                      </h3>
                      <p className="text-indigo-600 font-medium mb-2">{expert.title}</p>
                      
                      <p className="text-sm text-gray-600 mb-6">{expert.education}</p>

                      <Button
                        variant="outline"
                        size="sm"
                        className="group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all"
                      >
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
</section>
      {/* New Related Insights Section */}
      <section className="py-10 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="mb-4 bg-blue-100 text-blue-700 px-4 py-2">
                <BookOpen className="w-4 h-4 mr-2" />
                Industry Insights
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Related Insights & Research
              </h2>
              <p className="text-lg text-gray-600 ">
                Stay ahead with our latest industry analysis, research reports, and thought leadership
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {currentIndustryData.insights?.map((insight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-0 bg-white h-full">
                    <div className="relative overflow-hidden">
                      <img 
                        src={insight.image} 
                        alt={insight.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                             
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <CardContent className="p-6">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(insight.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      
                      </div>

                      <Badge variant="outline" className="text-xs mb-3">
                        {insight.industry}
                      </Badge>

                      <h3 onClick={() => handleInsightClick(insight)} className="font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-tight">
                        {insight.title}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed"     dangerouslySetInnerHTML={{
                                  __html:insight.content}}/>
                       

                      <div className="flex items-center justify-between">
                        
                        
                        <button 
                        onClick={() => handleInsightClick(insight)}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                          Read More
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

       
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-16 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to Transform Your {currentIndustryData.name} Operations?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Let our industry experts help you navigate challenges and capitalize on opportunities
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ServicesHoverModal/>
             
            </div>
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

      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        selectedLeader={selectedExpert}
      />
            {/* Insight Modal */}
            <InsightModal insight={selectedInsight} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  )
}

export default function IndustriesPage() {
  return (
    <Suspense fallback={  <LoadingSpinner />}>
      <IndustriesPageContent />
    </Suspense>
  )
}
