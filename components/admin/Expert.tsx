"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import AdminLayoutStructure from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Search, Edit, Trash2, Plus, User, Mail, X, Eye, Briefcase, Users, Award, GraduationCap, Star, MapPin, Phone, Medal } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import RichTextEditor from "../ui/RichTextEditor"
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DroppableProvided } from "@hello-pangea/dnd";
import LoadingSpinner from "../LoadingSpinner"
enum RoleType {
  EXPERT = "expert",
  LEADER = "leader",
}

interface Expert {
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
  professionalMembership: string[]
  sortOrder: number
  isActive: boolean
  role: RoleType
  createdAt: string
  updatedAt: string
}

interface ExpertFilters {
  role?: RoleType | 'all'
  page: number
  limit: number
  sortBy: string
  sortOrder: 'asc' | 'desc'
  search?: string
}

export default function AdminExperts() {
  const [experts, setExperts] = useState<Expert[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ExpertFilters>({
    role: 'all',
    page: 1,
    limit: 10,
    sortBy: 'sortOrder',
    sortOrder: 'asc',
    search: ''
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null)
  const [viewingExpert, setViewingExpert] = useState<Expert | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    experience: 0,
    projectsLed: 0,
    email: "",
    linkedinUrl: "",
    phone: "",
    education: [""],
    specialties: [""],
    professionalMembership: [""],
    role: RoleType.EXPERT,
    isActive: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  useEffect(() => {
    fetchExperts()
  }, [filters])

  async function fetchExperts() {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters.role && filters.role !== 'all') {
        params.append('role', filters.role)
      }
      if (filters.search) {
        params.append('search', filters.search)
      }
      params.append('page', filters.page.toString())
      params.append('limit', filters.limit.toString())
      params.append('sortBy', filters.sortBy)
      params.append('sortOrder', filters.sortOrder)

      const res = await api.get(`/experts?${params.toString()}`)
      setExperts(res.data.data || [])
      if (res.data.pagination) {
        setPagination(res.data.pagination)
      }
    } catch (err: any) {
      console.error(err.response?.data?.message || "Failed to fetch experts")
      toast.error("Failed to fetch experts")
    } finally {
      setLoading(false)
    }
  }

   async function handleReorder(result: DropResult) {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const newExperts = Array.from(experts);
    const [removed] = newExperts.splice(sourceIndex, 1);
    newExperts.splice(destIndex, 0, removed);
    const expertIds = newExperts.map((expert: Expert) => expert.id);
    try {
      await api.put("/experts/reorder", { expertIds })
      toast.success("Expert order updated successfully!")
      fetchExperts()
    } catch (err: any) {
      toast.error("Failed to update expert order")
      fetchExperts() // Revert on error
    }
  }

  const openModal = (expert?: Expert) => {
    if (expert) {
      setEditingExpert(expert)
      setFormData({
        name: expert.name,
        title: expert.title,
        bio: expert.bio,
        location: expert.location,
        experience: expert.experience,
        projectsLed: expert.projectsLed,
        email: expert.email || "",
        linkedinUrl: expert.linkedinUrl || "",
        phone: expert.phone || "",
        education: Array.isArray(expert.education) && expert.education.length ? expert.education : [""],
        specialties: Array.isArray(expert.specialties) && expert.specialties.length ? expert.specialties : [""],
        professionalMembership: Array.isArray(expert.professionalMembership) && expert.professionalMembership.length ? expert.professionalMembership : [""],
        role: expert.role,
        isActive: expert.isActive,
      })
    } else {
      setEditingExpert(null)
      setFormData({
        name: "",
        title: "",
        bio: "",
        location: "",
        experience: 0,
        projectsLed: 0,
        email: "",
        linkedinUrl: "",
        phone: "",
        education: [""],
        specialties: [""],
        professionalMembership: [""],
        role: RoleType.EXPERT,
        isActive: true,
      })
    }
    setImageFile(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "education" || key === "specialties" || key === "professionalMembership") {
          // Handle arrays by sending as JSON
          formDataToSend.append(key, JSON.stringify(value))
        } else {
          formDataToSend.append(key, String(value))
        }
      })
      
      if (imageFile) {
        formDataToSend.append("image", imageFile)
      }

      if (editingExpert) {
        await api.patch(`/experts/${editingExpert.id}`, formDataToSend)
        toast.success("Expert updated successfully!")
      } else {
        await api.post("/experts", formDataToSend)
        toast.success("Expert created successfully!")
      }

      setIsModalOpen(false)
      setEditingExpert(null)
      fetchExperts()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save expert")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(expert: Expert) {
    openModal(expert)
  }

  function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expert?")) return

    api
      .delete(`/experts/${id}`)
      .then(() => {
        toast.success("Expert deleted successfully!")
        fetchExperts()
      })
      .catch((err: any) => {
        toast.error(err.response?.data?.message || "Failed to delete expert")
      })
  }

  const addArrayItem = (field: keyof typeof formData, value = "") => {
    setFormData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }))
  }

  const removeArrayItem = (field: keyof typeof formData, index: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }))
  }

  const updateArrayItem = (field: keyof typeof formData, index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => (i === index ? value : item)),
    }))
  }

  const handleView = (expert: Expert) => {
    setViewingExpert(expert)
    setShowViewModal(true)
  }

  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }

  const handleRoleFilter = (role: RoleType | 'all') => {
    setFilters(prev => ({ ...prev, role, page: 1 }))
  }



  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }))
  }


  return (
    <AdminLayoutStructure>
      <div className="space-y-6">
        {/* Page Header */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
        <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Experts Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your organization's Experts Team
        </p>
      </div>
    </div>

    <Button
      onClick={() => openModal()}
      className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
    >
      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
      Add Expert
    </Button>
  </div>
</div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total</p>
                <p className="text-2xl font-bold text-slate-900">{pagination.total}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active</p>
                <p className="text-2xl font-bold text-slate-900">
                  {experts.filter(e => e.isActive).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Leaders</p>
                <p className="text-2xl font-bold text-slate-900">
                  {experts.filter(e => e.role === RoleType.LEADER).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Experts</p>
                <p className="text-2xl font-bold text-slate-900">
                  {experts.filter(e => e.role === RoleType.EXPERT).length}
                </p>
              </div>
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4 bg-white p-6 rounded-lg shadow-sm border border-slate-200">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search experts by name, title, bio..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
              />
            </div>
            <select
              value={filters.role || 'all'}
              onChange={(e) => handleRoleFilter(e.target.value as RoleType | 'all')}
              className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[180px]"
            >
              <option value="all">All Roles</option>
              <option value={RoleType.EXPERT}>Experts</option>
              <option value={RoleType.LEADER}>Leaders</option>
            </select>
            <select
              value={`${filters.sortBy}-${filters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-')
                setFilters(prev => ({ ...prev, sortBy, sortOrder: sortOrder as 'asc' | 'desc', page: 1 }))
              }}
              className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[180px]"
            >
              <option value="sortOrder-asc">Sort Order (A-Z)</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="title-asc">Title (A-Z)</option>
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="role-asc">Role (A-Z)</option>
            </select>
          </div>
        </motion.div>

        {/* Experts Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
               <LoadingSpinner />
            </div>
          ) : experts.length === 0 ? (
            <div className="text-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <Users className="h-16 w-16 text-slate-300" />
                <div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Experts Found</h3>
                  <p className="text-slate-500 mb-6">No experts match your search criteria</p>
                  <Button onClick={() => openModal()} className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Expert
                  </Button>
                </div>
              </div>
            </div>
          ) : (
                     					<DragDropContext onDragEnd={handleReorder}>
						<Droppable droppableId="team-table">
							{(provided: DroppableProvided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">#</th>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">Expert</th>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">Role</th>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">Experience</th>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">Projects</th>
                    <th className="px-3 py-1 text-left text-sm font-semibold text-slate-900">Status</th>
                    <th className="px-3 py-1 text-right text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <AnimatePresence>
                    {experts.map((expert, index) => (
                      												<Draggable key={expert.id} draggableId={expert.id} index={index}>
													{(provided: DraggableProvided, snapshot) => (
                      <tr
                        key={expert.id}
                    
                        ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
                        className={`hover:bg-slate-50/50 transition-colors duration-200 ${snapshot.isDragging ? "bg-sky-100" : ""}`}
                      >
                        <td className="px-3 py-1 text-sm text-slate-900">
                          {(pagination.page - 1) * pagination.limit + index + 1}
                        </td>

                        {/* Expert Info with Image */}
                        <td className="px-3 py-1 truncate">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-2 ring-slate-100">
                              {expert.image ? (
                                <img
                                  src={expert.image || "/placeholder.svg"}
                                  alt={expert.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <User className="w-6 h-6 text-slate-400" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-slate-900">{expert.name}</div>
                              <div className="text-xs text-slate-500">{expert.title}</div>
                            
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-3 py-1 truncate">
                          <Badge 
                            className={
                              expert.role === RoleType.LEADER 
                                ? "bg-purple-100 text-purple-800 border-purple-200" 
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }
                          >
                            {expert.role === RoleType.LEADER ? 'Leader & Expert' : 'Expert'}
                          </Badge>
                        </td>

                        {/* Experience */}
                        <td className="px-3 py-1">
                          <span className="text-sm text-slate-900">{expert.experience} years</span>
                        </td>

                        {/* Projects Led */}
                        <td className="px-3 py-1">
                          <span className="text-sm text-slate-900">{expert.projectsLed}</span>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-1">
                          <Badge
                            variant={expert.isActive ? "default" : "secondary"}
                            className={expert.isActive ? "bg-green-100 text-green-800 border-green-300" : ""}
                          >
                            {expert.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        {/* Actions */}
                        <td className="px-3 py-1 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(expert)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50 h-8 w-8 p-0"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(expert)}
                              className="border-primary/20 text-primary hover:bg-primary/5 h-8 w-8 p-0"
                              title="Edit Expert"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(expert.id)}
                              className="border-red-200 text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                              title="Delete Expert"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      )}
												</Draggable>
                    ))}
                    	{provided.placeholder}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            		)}
           		</Droppable>
					</DragDropContext> 
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-slate-200"
          >
            <div className="text-sm text-slate-700">
              Showing {(pagination.page - 1) * pagination.limit + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
              {pagination.total} results
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="border-slate-200 hover:bg-slate-50"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-slate-600">Page {pagination.page} of {pagination.pages}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="border-slate-200 hover:bg-slate-50"
              >
                Next
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      {/* View Expert Modal */}
      <AnimatePresence>
        {showViewModal && viewingExpert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Expert Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-slate-200 hover:bg-slate-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-start space-x-4 p-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border">
                  <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden ring-4 ring-white shadow-lg">
                    {viewingExpert.image ? (
                      <img
                        src={viewingExpert.image || "/placeholder.svg"}
                        alt={viewingExpert.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">{viewingExpert.name}</h3>
                    <p className="text-slate-600 font-medium">{viewingExpert.title}</p>
                    <div className="flex items-center mt-3 space-x-3">
                      <Badge 
                        className={
                          viewingExpert.role === RoleType.LEADER 
                            ? "bg-purple-100 text-purple-800 border-purple-200" 
                            : "bg-blue-100 text-blue-800 border-blue-200"
                        }
                      >
                        {viewingExpert.role === RoleType.LEADER ? 'Leader' : 'Expert'}
                      </Badge>
                      <Badge
                        variant={viewingExpert.isActive ? "default" : "secondary"}
                        className={viewingExpert.isActive ? "bg-green-100 text-green-800 border-green-300" : ""}
                      >
                        {viewingExpert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {viewingExpert.location && (
                      <div className="flex items-center mt-2 text-slate-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {viewingExpert.location}
                      </div>
                    )}
                  </div>
                </div>

                {/* Experience & Projects */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Briefcase className="h-5 w-5 mr-2 text-primary" />
                      Experience
                    </h4>
                    <p className="text-2xl font-bold text-primary">{viewingExpert.experience} years</p>
                  </div>
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary" />
                      Projects Led
                    </h4>
                    <p className="text-2xl font-bold text-primary">{viewingExpert.projectsLed}</p>
                  </div>
                </div>

                {/* Education */}
                {viewingExpert.education && viewingExpert.education.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                      Education
                    </h4>
                    <ul className="space-y-2">
                      {viewingExpert.education.map((edu, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Education */}
                {viewingExpert.professionalMembership && viewingExpert.professionalMembership.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Medal className="h-5 w-5 mr-2 text-primary" />
                      Professional Membership
                    </h4>
                    <ul className="space-y-2">
                      {viewingExpert.professionalMembership.map((profession, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-slate-700">{profession}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Specialties */}
                {viewingExpert.specialties && viewingExpert.specialties.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Award className="h-5 w-5 mr-2 text-primary" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {viewingExpert.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {viewingExpert.bio && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Biography
                    </h4>
                    <div 
                      className="text-slate-700 prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: viewingExpert.bio }}
                    />
                  </div>
                )}

                {/* Contact Information */}
                {(viewingExpert.email || viewingExpert.phone || viewingExpert.linkedinUrl) && (
                  <div className="bg-white rounded-lg border p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                      <Mail className="h-5 w-5 mr-2 text-primary" />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      {viewingExpert.email && (
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <a href={`mailto:${viewingExpert.email}`} className="text-primary hover:underline">
                            {viewingExpert.email}
                          </a>
                        </div>
                      )}
                      {viewingExpert.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <a href={`tel:${viewingExpert.phone}`} className="text-primary hover:underline">
                            {viewingExpert.phone}
                          </a>
                        </div>
                      )}
                      {viewingExpert.linkedinUrl && (
                        <div className="flex items-center space-x-3">
                          <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
                          <a 
                            href={viewingExpert.linkedinUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Expert Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingExpert ? "Edit Expert" : "Add New Expert"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)} className="border-slate-200 hover:bg-slate-50">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Full Name *
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter full name"
                        required
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Title *
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Head of Professional Practices Corporate Advisory Services"
                        required
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., New York, NY"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Role *
                      </label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-primary/20"
                        required
                      >
                        <option value={RoleType.EXPERT}>Expert</option>
                        <option value={RoleType.LEADER}>Leader</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Years of Experience
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Projects Led
                      </label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.projectsLed}
                        onChange={(e) => setFormData({ ...formData, projectsLed: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                      Active Expert
                    </label>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Contact Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="expert@example.com"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+1 (555) 123-4567"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        LinkedIn URL
                      </label>
                      <Input
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        placeholder="https://linkedin.com/in/username"
                        className="border-slate-200 focus:border-primary focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Profile Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Profile Image</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Upload Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        {editingExpert?.image ? (
                          <img
                            src={editingExpert.image}
                            alt="Current"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-slate-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                          className="border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Upload a square image for best results. Max size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Education</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("education")}
                      className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.education.map((edu, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={edu}
                          onChange={(e) => updateArrayItem("education", index, e.target.value)}
                          placeholder="e.g., BS Computer Science, MIT"
                          className="flex-1 border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                        {formData.education.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("education", index)}
                            className="border-red-200 text-red-600 hover:bg-red-50 p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialties */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Specialties</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("specialties")}
                      className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Specialty
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={specialty}
                          onChange={(e) => updateArrayItem("specialties", index, e.target.value)}
                          placeholder="e.g., Evaluation of internal controls, risk management,"
                          className="flex-1 border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                        {formData.specialties.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("specialties", index)}
                            className="border-red-200 text-red-600 hover:bg-red-50 p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

     {/* professionalMembership */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Professional Membership</h3>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addArrayItem("professionalMembership")}
                      className="border-primary/20 text-primary hover:bg-primary/5"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add professional Membership
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.professionalMembership.map((professionalMembership, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={professionalMembership}
                          onChange={(e) => updateArrayItem("professionalMembership", index, e.target.value)}
                          placeholder="e.g., Member of Institute of Certified Public Accountants of Rwanda (iCPAR) and holder of Audit Practice Certificate"
                          className="flex-1 border-slate-200 focus:border-primary focus:ring-primary/20"
                        />
                        {formData.professionalMembership.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeArrayItem("professionalMembership", index)}
                            className="border-red-200 text-red-600 hover:bg-red-50 p-2"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Biography */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Biography</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Professional Bio
                    </label>
                    <RichTextEditor
                      value={formData.bio}
                      onChange={(value) => setFormData({ ...formData, bio: value })}
                      placeholder="Write a brief professional biography..."
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    className="border-slate-200 hover:bg-slate-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-primary/90 text-white px-6"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {editingExpert ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      editingExpert ? "Update Expert" : "Create Expert"
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayoutStructure>
  )
}