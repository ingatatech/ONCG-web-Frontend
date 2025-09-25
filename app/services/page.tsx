"use client";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  Users,
  Briefcase,
  BarChart3,
  Sparkles,
  ArrowUpRight,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { ProfileModal } from "@/components/profile-modal";
import ServicesHoverModal from "@/components/ServicesHoverModal";
import { fetchServices, fetchServiceCategories } from "@/lib/api";
import LoadingSpinner from "@/components/LoadingSpinner";

// Types for API data
interface ServiceExpert {
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

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  industry: string;
  impact: string;
}

interface ServiceData {
  id: string;
  name: string;
  slug: string;
  serviceDescription: string;
  experts: ServiceExpert[];
  caseStudies: CaseStudy[];
  category: {
    id: string;
    name: string;
    slug: string;
    description: string;
  };
}

interface ServicesData {
  [key: string]: {
    category: string;
    description: string;
    services: {
      [key: string]: ServiceData;
    };
  };
}

type CategoryKey = string;
type AnyServiceKey = string;

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
};

function ServicesPageContent() {
  const searchParams = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("");
  const [selectedService, setSelectedService] = useState<AnyServiceKey>("");

  const [selectedExpert, setSelectedExpert] =
    useState<TransformedExpert | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Case studies state
  const [showAllCaseStudies, setShowAllCaseStudies] = useState(false);
  const [expandedCaseStudies, setExpandedCaseStudies] = useState<Set<string>>(new Set());
  const INITIAL_CASE_STUDIES_COUNT = 4; // Show 4 case studies initially
  const DESCRIPTION_PREVIEW_LENGTH = 150; // Characters to show in preview

  // API data states
  const [servicesData, setServicesData] = useState<ServicesData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services data
  useEffect(() => {
    const loadServicesData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoriesResponse, servicesResponse] = await Promise.all([
          fetchServiceCategories(),
          fetchServices("isActive=true&limit=100"),
        ]);

        const categories = categoriesResponse.data || categoriesResponse;
        const services = servicesResponse.data || servicesResponse;

        // Group services by category
        const groupedData: ServicesData = {};

        categories.forEach((category: any) => {
          const categoryServices = services.filter(
            (service: any) => service.category?.id === category.id
          );

          if (categoryServices.length > 0) {
            groupedData[category.slug] = {
              category: category.name,
              description: category.description,
              services: {},
            };

            categoryServices.forEach((service: any) => {
              groupedData[category.slug].services[service.slug] = {
                ...service,
                experts: service.experts || [],
                caseStudies: service.caseStudies || [],
              };
            });
          }
        });

        setServicesData(groupedData);

        // Set initial category and service from URL params
        const categoryParam = searchParams.get("category");
        const serviceParam = searchParams.get("service");

        if (categoryParam && groupedData[categoryParam]) {
          setSelectedCategory(categoryParam);
          if (
            serviceParam &&
            groupedData[categoryParam].services[serviceParam]
          ) {
            setSelectedService(serviceParam);
          } else {
            const firstService = Object.keys(
              groupedData[categoryParam].services
            )[0];
            setSelectedService(firstService);
          }
        } else {
          const firstCategory = Object.keys(groupedData)[0];
          if (firstCategory) {
            setSelectedCategory(firstCategory);
            const firstService = Object.keys(
              groupedData[firstCategory].services
            )[0];
            setSelectedService(firstService);
          }
        }
      } catch (err) {
        console.error("Error loading services:", err);
        setError("Failed to load services data");
      } finally {
        setLoading(false);
      }
    };

    loadServicesData();
  }, [searchParams]);

  // Reset case studies view when service changes
  useEffect(() => {
    setShowAllCaseStudies(false);
    setExpandedCaseStudies(new Set());
  }, [selectedService]);

  const currentCategoryData = servicesData[selectedCategory];
  const currentServiceData = currentCategoryData?.services[selectedService];

  const handleExpertClick = (expert: ServiceExpert) => {
    // Transform the expert data to match the modal's expected format
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
    };

    setSelectedExpert(transformedExpert);
    setIsProfileModalOpen(true);
  };

  // Get displayed case studies based on show more/less state
  const getDisplayedCaseStudies = () => {
    if (!currentServiceData?.caseStudies) return [];
    
    if (showAllCaseStudies) {
      return currentServiceData.caseStudies;
    }
    
    return currentServiceData.caseStudies.slice(0, INITIAL_CASE_STUDIES_COUNT);
  };

  const hasMoreCaseStudies = () => {
    return currentServiceData?.caseStudies && 
           currentServiceData.caseStudies.length > INITIAL_CASE_STUDIES_COUNT;
  };

  // Helper functions for individual case study expansion
  const toggleCaseStudyExpansion = (studyId: string) => {
    const newExpanded = new Set(expandedCaseStudies);
    if (newExpanded.has(studyId)) {
      newExpanded.delete(studyId);
    } else {
      newExpanded.add(studyId);
    }
    setExpandedCaseStudies(newExpanded);
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const stripHtmlTags = (html: string) => {
    return html.replace(/<[^>]*>/g, '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
      <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!currentServiceData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Service not found</p>
          <Link href="/services">
            <Button className="mt-4">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section
        className={`relative py-10 bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-800 text-white overflow-hidden`}
      >
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
            <div className="flex items-start justify-start mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto">
              <Badge
                variant="outline"
                className="text-sm font-medium border-white/40 text-white/90 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full"
              >
                <Sparkles className="w-4 h-4 mr-2 text-yellow-400" />
                {currentCategoryData?.category || "Services"}
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-4xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-6 duration-700 text-left max-w-6xl mx-auto">
              {currentServiceData.name}
            </h1>

            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700 text-left">
              Delivering expert guidance and tailored strategies across
              advisory, auditing, and consultancy services to help organizations
              strengthen governance, improve efficiency, manage risks
              effectively, ensure compliance with global standards, and achieve
              sustainable growth in an ever-changing business environment.
            </p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-start max-w-6xl mx-auto"
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
          </div>
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

      {/* Main Content Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="overview" className="max-w-6xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-12">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="experts" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Our Experts
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Experience
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              {/* Service Overview */}
              <div className="max-w-6xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className={`h-5 w-5 text-primary`} />
                      Service Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className="text-gray-700 leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: currentServiceData.serviceDescription,
                      }}
                    />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="experts" className="space-y-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Meet Our Expert Team
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Our seasoned professionals bring decades of experience and
                  industry expertise to every engagement.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {currentServiceData.experts.map((expert, index) => (
                  <Card
                    key={expert.id || index}
                    className="text-center cursor-pointer hover:shadow-lg transition-shadow duration-200"
                    onClick={() => handleExpertClick(expert)}
                  >
                    <CardContent className="pt-6">
                      <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-primary">
                        <AvatarImage
                          src={expert.image || "/placeholder.svg"}
                          alt={expert.name}
                        />
                        <AvatarFallback>
                          {expert.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {expert.name}
                      </h3>
                      <p className={`text-primary font-medium mb-2`}>
                        {expert.title}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        {expert.education}
                      </p>
                      <div className="space-y-2 text-sm">
                       
                      
                        <button className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm  space-x-1 group">
                          <span>View Profile</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Proven Track Record
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Real results from real clients across diverse industries and
                  complex challenges.
                </p>
              </div>

              {/* Case Studies */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Past Projects
                  </h3>
                  {currentServiceData.caseStudies.length > 0 && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {currentServiceData.caseStudies.length} Projects
                    </Badge>
                  )}
                </div>
                
                <AnimatePresence mode="sync">
                  <motion.div 
                    className="grid md:grid-cols-2 gap-8"
                    layout
                  >
                    {getDisplayedCaseStudies().map((study, index) => (
                      <motion.div
                        key={study.id || index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.1 
                        }}
                        layout
                      >
                        <Card className="h-full hover:shadow-lg transition-all duration-300 group">
                          <CardHeader>
                            <div className="flex items-start justify-between mb-2">
                              <CardTitle className="text-lg group-hover:text-primary transition-colors duration-200 line-clamp-2">
                                {study.title}
                              </CardTitle>
                              <Badge 
                                variant="secondary" 
                                className="bg-primary/10 text-primary border-primary/20 shrink-0 ml-2"
                              >
                                {study.impact}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="text-gray-600 text-sm leading-relaxed">
                                {(() => {
                                  const studyKey = study.id || `study-${index}`;
                                  const isExpanded = expandedCaseStudies.has(studyKey);
                                  const plainDescription = stripHtmlTags(study.description);
                                  const needsTruncation = plainDescription.length > DESCRIPTION_PREVIEW_LENGTH;
                                  
                                  const displayDescription = isExpanded || !needsTruncation 
                                    ? study.description 
                                    : truncateDescription(plainDescription, DESCRIPTION_PREVIEW_LENGTH);

                                  return (
                                    <>
                                      <div
                                        dangerouslySetInnerHTML={{
                                          __html: isExpanded ? study.description : displayDescription,
                                        }}
                                      />
                                      {needsTruncation && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleCaseStudyExpansion(studyKey);
                                          }}
                                          className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-xs mt-2 transition-colors duration-200"
                                        >
                                          {isExpanded ? (
                                            <>
                                              <span>Show Less</span>
                                              <ChevronUp className="h-3 w-3" />
                                            </>
                                          ) : (
                                            <>
                                              <span>Show More</span>
                                              <ChevronDown className="h-3 w-3" />
                                            </>
                                          )}
                                        </button>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                              {study.industry && (
                                <div className="pt-2 border-t border-gray-100">
                                  <span className="text-xs text-gray-500 font-medium">
                                    Industry: 
                                  </span>
                                  <span className="text-xs text-gray-700 ml-1">
                                    {study.industry}
                                  </span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Show More/Less Button */}
                {hasMoreCaseStudies() && (
                  <div className="flex justify-center mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllCaseStudies(!showAllCaseStudies)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      {showAllCaseStudies ? (
                        <>
                          <ChevronUp className="h-4 w-4" />
                          Show Less Projects
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4" />
                          Show More Projects ({currentServiceData.caseStudies.length - INITIAL_CASE_STUDIES_COUNT} more)
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {currentServiceData.caseStudies.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <Briefcase className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">No case studies available yet.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className=" relative py-10 bg-primary text-white">
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-gradient-to-b from-primary/90 via-primary/60 to-white/95"
            style={{ mixBlendMode: "multiply" }}
          />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold  mb-6">Ready to Get Started?</h2>
          <p className="text-lg  mb-8 max-w-2xl mx-auto">
            Let our experts help you achieve your goals with our proven{" "}
            {currentServiceData.name.toLowerCase()} solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link
              href="/leadership"
              className={`bg-primary hover:bg-primary/90 rounded-full inline-flex items-center border-2 border-white/30 text-white px-10 py-3 font-medium  backdrop-blur-sm transition-all duration-300 group`}
            >
              Meet our Experts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
           
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

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        selectedLeader={selectedExpert}
      />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ServicesPageContent />
    </Suspense>
  );
}