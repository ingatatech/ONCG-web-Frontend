"use client"

import { useState } from "react"
import { X, User, Briefcase, GraduationCap, Trophy, Star, Clock, Linkedin, Mail, Phone, Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  selectedLeader: any
}

export function ProfileModal({ isOpen, onClose, selectedLeader }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState("bio")

  if (!isOpen || !selectedLeader) return null

  const linkedin = selectedLeader.linkedinUrl || ""
  const email = selectedLeader.email || ""
  const phone = selectedLeader.phone || ""

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-screen sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 lg:p-8 flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 pt-8 sm:pt-0">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-4 border-white/20 flex-shrink-0">
              <AvatarImage src={selectedLeader.image || "/placeholder.svg"} alt={selectedLeader.name} />
              <AvatarFallback className="text-xl sm:text-2xl bg-white/20">
                {selectedLeader.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">{selectedLeader.name}</h2>
              <p className="text-sm text-blue-100 mb-2">{selectedLeader.title}</p>
              <div className="flex items-center justify-center sm:justify-start space-x-2 text-blue-200 mb-3">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{selectedLeader.experience} Years of Experience</span>
              </div>
              
              {/* Contact Info */}
              {(linkedin || email || phone) && (
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {linkedin && (
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs sm:text-sm transition-colors"
                    >
                      <Linkedin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                      <span className="hidden sm:inline">LinkedIn</span>
                      <span className="sm:hidden">LI</span>
                    </a>
                  )}
                  {email && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs sm:text-sm transition-colors max-w-[120px] sm:max-w-none"
                    >
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                      <span className="truncate">{email}</span>
                    </a>
                  )}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center px-2 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs sm:text-sm transition-colors"
                    >
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> 
                      <span>{phone}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation - Responsive */}
        <div className="px-2 sm:px-4 lg:px-8 py-2 sm:py-3 border-b border-gray-200 flex-shrink-0 overflow-x-auto">
          <div className="flex space-x-2 sm:space-x-6 min-w-max">
            {[
              { id: "bio", label: "Bio", fullLabel: "Biography", icon: User },
              { id: "experience", label: "Exp", fullLabel: "Experience", icon: Briefcase },
              { id: "education", label: "Edu", fullLabel: "Education", icon: GraduationCap },
              { id: "professionalMembership", label: "Member", fullLabel: "Membership", icon: Medal },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-3 border-b-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="sm:hidden">{tab.label}</span>
                  <span className="hidden sm:inline">{tab.fullLabel}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {activeTab === "bio" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-4 sm:mb-6">
                  <blockquote className="text-sm sm:text-lg italic text-gray-700 border-l-4 border-blue-600 pl-3 sm:pl-4 mb-4">
                    "Excellence is not a skill, it's an attitude that drives everything we do."
                  </blockquote>
                </div>

                <div 
                  className="text-gray-700 leading-relaxed text-sm sm:text-base" 
                  dangerouslySetInnerHTML={{ __html: selectedLeader.bio }}
                />
              </div>
            )}

            {activeTab === "experience" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center text-sm sm:text-base">
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-600" />
                    Key Specialization
                  </h4>
                  {selectedLeader.specialties && (
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700 text-sm sm:text-base">{selectedLeader.specialties}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-600" />
                  Educational Background
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {selectedLeader.education.map((edu: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-indigo-50 rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{edu}</p>
                        <p className="text-xs sm:text-sm text-gray-600">Academic Excellence</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "professionalMembership" && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center text-sm sm:text-base">
                  <Medal className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-indigo-600" />
                  Professional Membership
                </h4>
                {selectedLeader.professionalMembership &&(
                <div className="space-y-3 sm:space-y-4">
                  {selectedLeader.professionalMembership.map((professional: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-indigo-50 rounded-xl">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Medal className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm sm:text-base break-words">{professional}</p>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}