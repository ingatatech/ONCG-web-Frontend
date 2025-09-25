"use client"

import type React from "react"

import { useState, useEffect } from "react"
import  AdminLayout  from "./layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Edit, Trash2, Plus, Newspaper } from "lucide-react"
import type{ Insight } from "@/lib/types/Insights"
import toast from "react-hot-toast"
import api from "@/lib/axios"
import RichTextEditor from "../ui/RichTextEditor"
import LoadingSpinner from "../LoadingSpinner"

interface InsightFormData {
  title: string
  content: string
  industryId: string
  authorId: string
  isActive: boolean
  image?: File
}

interface Industry {
  id: string
  name: string
}


export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [industries, setIndustries] = useState<Industry[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [industryFilter, setIndustryFilter] = useState("All Industries")
  const [statusFilter, setStatusFilter] = useState("All Status")
const [isSubmitting, setIsSubmitting] = useState(false)
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null)

  // Form data
  const [formData, setFormData] = useState<InsightFormData>({
    title: "",
    content: "",
    industryId: "",
    authorId: "",
    isActive: true,
  })



  useEffect(() => {
    fetchInsights()
    fetchIndustries()
  }, [])

  const fetchInsights = async () => {
    try {
      const { data } = await api.get("/insights")
      setInsights(data.insights || data)
    } catch (error) {
      console.error("Error fetching insights:", error)
      toast.error("Failed to fetch insights")
    } finally {
      setLoading(false)
    }
  }

  const fetchIndustries = async () => {
    try {
      const { data } = await api.get("/industries")
      setIndustries(data.industries || data)
    } catch (error) {
      console.error("Error fetching industries:", error)
    }
  }



  const openModal = (insight?: Insight) => {
    if (insight) {
      setEditingInsight(insight)
      setFormData({
        title: insight.title,
        content: insight.content,
        industryId: insight.industry?.id || "",
        authorId: insight.author?.id || "",
        isActive: insight.isActive,
      })
    } else {
      setEditingInsight(null)
      setFormData({
        title: "",
        content: "",
        industryId: "",
        authorId: "",
        isActive: true,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingInsight(null)
    setFormData({
      title: "",
      content: "",
      industryId: "",
      authorId: "",
      isActive: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)
      const submitData = new FormData()
      submitData.append("title", formData.title)
      submitData.append("content", formData.content)
      submitData.append("industryId", formData.industryId)
      submitData.append("authorId", formData.authorId)
      submitData.append("isActive", formData.isActive.toString())

      if (formData.image) {
        submitData.append("image", formData.image)
      }

      if (editingInsight) {
        await api.patch(`/insights/${editingInsight.id}`, submitData)
        toast.success("Insight updated successfully")
      } else {
        await api.post("/insights", submitData)
        toast.success("Insight created successfully")
      }

      fetchInsights()
      closeModal()
    } catch (error: any) {
      console.error("Error saving insight:", error)
      toast.error(error.response?.data?.message || "Failed to save insight")
    }
    finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this insight?")) return

    try {
      await api.delete(`/insights/${id}`)
      toast.success("Insight deleted successfully")
      fetchInsights()
    } catch (error) {
      toast.error("Failed to delete insight")
    }
  }

  const toggleStatus = async (insight: Insight) => {
    try {
      await api.patch(`/insights/${insight.id}/toggle-status`)
      toast.success(`Insight ${insight.isActive ? "deactivated" : "activated"} successfully`)
      fetchInsights()
    } catch (error) {
      toast.error("Failed to update insight status")
    }
  }

  const filteredInsights = insights.filter((insight) => {
    const matchesSearch =
      insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insight.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesIndustry = industryFilter === "All Industries" || insight.industry?.id === industryFilter
    const matchesStatus =
      statusFilter === "All Status" ||
      (statusFilter === "active" && insight.isActive) ||
      (statusFilter === "inactive" && !insight.isActive)

    return matchesSearch  && matchesIndustry && matchesStatus
  })

  return (
    <AdminLayout>
      <div className="space-y-6">

         {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
            <Newspaper className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Insight Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Manage your organization's Insight
            </p>
          </div>
        </div>
    
        <Button
          onClick={() => openModal()}
          className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add Insight
        </Button>
      </div>
    </div>
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
             
              <Select value={industryFilter} onValueChange={setIndustryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Industries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Industries">All Industries</SelectItem>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Insights Table */}
        <Card>
          <CardHeader>
            <CardTitle>Insights ({filteredInsights.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
  <LoadingSpinner />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInsights.map((insight) => (
                    <TableRow key={insight.id}>
                      <TableCell className="font-medium">
                        <div className="max-w-xs truncate">{insight.title}</div>
                      </TableCell>
                    
                      <TableCell>{insight.industry?.name || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={insight.isActive ? "default" : "secondary"}>
                          {insight.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(insight.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedInsight(insight)
                              setIsViewModalOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => openModal(insight)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => toggleStatus(insight)}>
                            <Switch checked={insight.isActive} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(insight.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>{editingInsight ? "Edit Insight" : "Add New Insight"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
            
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                {/* <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={8}
                  required
                /> */}
                 <RichTextEditor
                   value={formData.content}
                    onChange={(value) =>  setFormData({ ...formData, content: value })}
                    placeholder="Enter service description..."
                    />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industryId}
                    onValueChange={(value) => setFormData({ ...formData, industryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Industries">No Industry</SelectItem>
                      {industries.map((industry) => (
                        <SelectItem key={industry.id} value={industry.id}>
                          {industry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] })}
                />
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div> */}

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>{editingInsight ? "Update Insight" : "Create Insight"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>View Insight</DialogTitle>
            </DialogHeader>
            {selectedInsight && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">{selectedInsight.title}</h3>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <span>Created: {new Date(selectedInsight.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {selectedInsight.image && (
                  <div>
                    <img
                      src={selectedInsight.image || "/placeholder.svg"}
                      alt={selectedInsight.title}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">Content</h4>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedInsight.content}</p>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Industry</h4>
                    <p>{selectedInsight.industry?.name || "N/A"}</p>
                  </div>
              
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false)
                      openModal(selectedInsight)
                    }}
                  >
                    Edit Insight
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
