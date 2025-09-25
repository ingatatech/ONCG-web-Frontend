"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import toast from "react-hot-toast"
import { Search, Edit, Trash2, Plus, User, Eye, Upload, Check, X, Clock,MessageSquareQuote } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import AdminLayout from "./layout"
import { fetchTestimonials } from "@/lib/api"
import RichTextEditor from "../ui/RichTextEditor"
import LoadingSpinner from "../LoadingSpinner"

export interface Testimonial {
  id: string
  leaderName: string
  companyName: string
  role: string
  quote: string
  leaderImage: string // URL to image
  approved: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [viewingTestimonial, setViewingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    leaderName: "",
    role: "",
    companyName: "",
    quote: "",
    leaderImage: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const pageSize = 10

  useEffect(() => {
    setLoading(true)
    fetchTestimonials()
       loadTestimonials()
  }, [])

  async function loadTestimonials() {
    try {
         const res = await fetchTestimonials()
         console.log("testimonials",res.data)
         setTestimonials(res.data)
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch testimonials")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    try {
      setIsSubmitting(true)

      const formDataToSend = new FormData()
      formDataToSend.append("leaderName", formData.leaderName)
      formDataToSend.append("role", formData.role)
      formDataToSend.append("companyName", formData.companyName)
      formDataToSend.append("quote", formData.quote)

      if (formData.leaderImage) {
        formDataToSend.append("leaderImage", formData.leaderImage)
      }

      if (editingTestimonial) {
        await api.patch(`/testimonials/${editingTestimonial.id}`, formDataToSend, {
          headers: { "quote-Type": "multipart/form-data" },
        })
        toast.success("Testimonial updated successfully!")
      } else {
        await api.post("/testimonials", formDataToSend, {
          headers: { "quote-Type": "multipart/form-data" },
        })
        toast.success("Testimonial created successfully!")
      }

      setShowModal(false)
      setEditingTestimonial(null)
      resetForm()
      fetchTestimonials()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save testimonial")
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleEdit(testimonial: Testimonial) {
    setEditingTestimonial(testimonial)
    setFormData({
      leaderName: testimonial.leaderName,
      role: testimonial.role,
      companyName: testimonial.companyName,
      quote: testimonial.quote,
      leaderImage: null,
    })
    setImagePreview(testimonial.leaderImage || null)
    setShowModal(true)
  }

  function handleView(testimonial: Testimonial) {
    setViewingTestimonial(testimonial)
    setShowViewModal(true)
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this testimonial?")) return

    try {
      await api.delete(`/testimonials/${id}`)
      toast.success("Testimonial deleted successfully!")
      fetchTestimonials()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial")
    }
  }

  async function handleApprovalToggle(id: string, currentStatus: boolean) {
    try {
      await api.patch(`/testimonials/${id}/approval`, { approved: !currentStatus })
      toast.success(`Testimonial ${!currentStatus ? "approved" : "unapproved"} successfully!`)
      fetchTestimonials()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update approval status")
    }
  }

  function resetForm() {
    setFormData({
      leaderName: "",
      role: "",
      companyName: "",
      quote: "",
      leaderImage: null,
    })
    setImagePreview(null)
  }

  function openAddModal() {
    setEditingTestimonial(null)
    resetForm()
    setShowModal(true)
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, leaderImage: file })
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const filteredTestimonials = testimonials.filter((testimonial) => {
    const matchesSearch =
      testimonial?.leaderName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial?.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial?.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      testimonial?.quote?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && testimonial.approved) ||
      (statusFilter === "pending" && !testimonial.approved)

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredTestimonials.length / pageSize)
  const paginatedTestimonials = filteredTestimonials.slice((page - 1) * pageSize, page * pageSize)

  const getStatusBadge = (approved: boolean) => {
    return approved ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Check className="w-3 h-3 mr-1" />
        Approved
      </Badge>
    ) : (
      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
        <Clock className="w-3 h-3 mr-1" />
        Pending
      </Badge>
    )
  }


  return (
    <AdminLayout>

       {/* Page Header */}
       <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
     <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
       
       <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
         <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
           <MessageSquareQuote className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
         </div>
         <div>
           <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
             Testimonials Management
           </h1>
           <p className="text-xs sm:text-sm text-slate-600">
             Manage your organization's Testimonials
           </p>
         </div>
       </div>
   
       <Button
         onClick={() => openAddModal()}
         className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
       >
         <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
         Add Testimonials
       </Button>
     </div>
   </div>
      {/* Search and Filters */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search testimonials by leaderName, companyName, role, or quote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 border-gray-200 focus:border-primary focus:ring-primary/20 h-12"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg bg-white border border-gray-200 text-gray-900 focus:border-primary focus:ring-primary/20 min-w-[180px]"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </motion.div>

      {/* Testimonials Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
<LoadingSpinner />
            </div>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Testimonials Found</h3>
            <p className="text-gray-500 mb-6">No testimonials match your search criteria</p>
            <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add First Testimonial
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">#</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Person</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">companyName</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedTestimonials.map((testimonial, index) => (
                    <motion.tr
                      key={testimonial.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-primary/5 transition-colors duration-200"
                    >
                      <td className="px-3 py-4 text-sm text-gray-900">{(page - 1) * pageSize + index + 1}</td>
                      <td className="px-3 py-4 truncate">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {testimonial.leaderImage ? (
                              <img
                                src={testimonial.leaderImage || "/placeholder.svg"}
                                alt={testimonial.leaderName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">{testimonial.leaderName}</h3>
                            <p className="text-xs text-gray-600">{testimonial.role}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-4 truncate">
                        <span className="text-sm text-gray-900">{testimonial.companyName}</span>
                      </td>
                   
                      <td className="px-3 py-4">{getStatusBadge(testimonial.approved)}</td>
                      <td className="px-3 py-4 truncate">
                        <div className="text-sm text-gray-600">
                          {new Date(testimonial.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(testimonial)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(testimonial)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprovalToggle(testimonial.id, testimonial.approved)}
                            className={
                              testimonial.approved
                                ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }
                          >
                            {testimonial.approved ? <Clock className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(testimonial.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, filteredTestimonials.length)} of{" "}
            {filteredTestimonials.length} results
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="border-gray-200"
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="border-gray-200"
            >
              Next
            </Button>
          </div>
        </motion.div>
      )}

      {/* View Testimonial Modal */}
      <AnimatePresence>
        {showViewModal && viewingTestimonial && (
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
              className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">View Testimonial</h2>
                <Button variant="outline" size="sm" onClick={() => setShowViewModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Profile Image and Basic Info */}
                <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    {viewingTestimonial.leaderImage ? (
                      <img
                        src={viewingTestimonial.leaderImage}
                        alt={viewingTestimonial.leaderName}
                        className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {viewingTestimonial.leaderName}
                    </h3>
                    <p className="text-lg text-gray-600 mb-2">
                      {viewingTestimonial.role}
                    </p>
                    <p className="text-base text-gray-500 mb-4">
                      {viewingTestimonial.companyName}
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={viewingTestimonial.approved ? "default" : "secondary"}
                        className={viewingTestimonial.approved 
                          ? "bg-green-100 text-green-800 border-green-200" 
                          : "bg-yellow-100 text-yellow-800 border-yellow-200"
                        }
                      >
                        {viewingTestimonial.approved ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Approved
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Pending
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Quote Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Testimonial Quote</h4>
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6 relative">
                    <div className="absolute top-4 left-4 text-4xl text-gray-200 font-serif">"</div>
                    <blockquote 
                      className="text-gray-700 text-lg leading-relaxed pl-8 pr-4 italic"
                      dangerouslySetInnerHTML={{ __html: viewingTestimonial.quote }}
                    />
                    <div className="absolute bottom-4 right-4 text-4xl text-gray-200 font-serif">"</div>
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">Created At</h5>
                    <p className="text-gray-900">
                      {new Date(viewingTestimonial.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  
              
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowViewModal(false)}
                    className="border-gray-200"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      setShowViewModal(false)
                      handleEdit(viewingTestimonial)
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Testimonial
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
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
              className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="border-gray-200">
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Choose Image
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">leaderName *</label>
                    <Input
                      value={formData.leaderName}
                      onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                      placeholder="Enter full leaderName..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">role *</label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="Enter job role..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">companyName *</label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Enter companyName leaderName..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                
                </div>

                {/* quote */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Testimonial quote *</label>
                  <RichTextEditor
                    value={formData.quote}
                    onChange={(value) => setFormData({ ...formData, quote: value })}
                    placeholder="Enter the testimonial quote..."
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white">
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {editingTestimonial ? "Updating..." : "Creating..."}
                    </div>
                  ) : editingTestimonial ? (
                    "Update Testimonial"
                  ) : (
                    "Create Testimonial"
                  )}
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-gray-200">
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  )
}
