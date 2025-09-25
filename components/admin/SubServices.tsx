"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "./layout";
import { Search, Eye, Edit, Trash2, Users, Plus, Package } from "lucide-react";
import axios from "@/lib/axios";
import { toast } from "react-hot-toast";
import RichTextEditor from "../ui/RichTextEditor";

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  email: string;
}

interface CaseStudy {
  id: string;
  title: string;
  description: string;
  impact: string;
  isActive: boolean;
  displayOrder: number;
}

interface Service {
  id: string;
  slug: string;
  name: string;
  serviceDescription: string;
  isActive: boolean;
  sortOrder: number;
  category: ServiceCategory;
  experts: Expert[];
  caseStudies: CaseStudy[];
  createdAt: string;
  updatedAt: string;
}

interface ServiceFormData {
  name: string;
  slug: string;
  serviceDescription: string;
  categoryId: string;
  expertIds: string[];
  isActive: boolean;
  caseStudies: Array<{
    title: string;
    description: string;
    impact: string;
    isActive: boolean;
  }>;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [editingCaseStudyIndex, setEditingCaseStudyIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    slug: "",
    serviceDescription: "",
    categoryId: "",
    expertIds: [],
    isActive: true,
    caseStudies: [],
  });

  const [newCaseStudy, setNewCaseStudy] = useState({
    title: "",
    description: "",
    impact: "Medium",
    isActive: true,
  });
const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchServices();
    fetchCategories();
    fetchExperts();
  }, [currentPage, searchTerm, categoryFilter, statusFilter]);

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [searchTerm, categoryFilter, statusFilter]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
      });

      // Only add search param if searchTerm is not empty
      if (searchTerm && searchTerm.trim() !== "") {
        params.append("search", searchTerm.trim());
      }

      // Only add category param if it's not "all"
      if (categoryFilter && categoryFilter !== "all") {
        params.append("category", categoryFilter);
      }

      // Only add status param if it's not "all"
      if (statusFilter && statusFilter !== "all") {
        params.append("isActive", statusFilter);
      }

      const response = await axios.get(`/services?${params}`);
      setServices(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch services");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/services/categories/all");
      setCategories(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axios.get("/experts");
      setExperts(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch experts");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
       setIsSubmitting(true)
      if (selectedService) {
        await axios.patch(`/services/${selectedService.id}`, formData);
        toast.success("Service updated successfully");
        setIsEditModalOpen(false);
      } else {
        await axios.post("/services", formData);
        toast.success("Service created successfully");
        setIsAddModalOpen(false);
      }
      fetchServices();
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save Sub-service");
    }finally {
      setIsSubmitting(false)
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this sub-service?")) {
      try {
        await axios.delete(`/services/${id}`);
        toast.success("Service deleted successfully");
        fetchServices();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete service"
        );
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await axios.patch(`/services/${id}/toggle-status`);
      toast.success("Service status updated");
      fetchServices();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  function openAddModal() {
    resetForm();
    setIsAddModalOpen(true);
  }

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      serviceDescription: "",
      categoryId: "",
      expertIds: [],
      isActive: true,
      caseStudies: [],
    });
    setSelectedService(null);
    setNewCaseStudy({
      title: "",
      description: "",
      impact: "Medium",
      isActive: true,
    });
    setEditingCaseStudyIndex(null);
  };

  const openEditModal = (service: Service) => {
    setSelectedService(service);
    setFormData({
      name: service.name,
      slug: service.slug,
      serviceDescription: service.serviceDescription,
      categoryId: service.category.id,
      expertIds: service.experts.map((e) => e.id),
      isActive: service.isActive,
      caseStudies: service.caseStudies.map((cs) => ({
        title: cs.title,
        description: cs.description,
        impact: cs.impact,
        isActive: cs.isActive,
      })),
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (service: Service) => {
    setSelectedService(service);
    setIsViewModalOpen(true);
  };

  const addCaseStudy = () => {
    if (!newCaseStudy.title.trim()) return;

    if (editingCaseStudyIndex !== null) {
      setFormData((prev) => {
        const updated = [...prev.caseStudies];
        updated[editingCaseStudyIndex] = newCaseStudy;
        return { ...prev, caseStudies: updated };
      });
      setEditingCaseStudyIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        caseStudies: [...prev.caseStudies, newCaseStudy],
      }));
    }

    setNewCaseStudy({ title: "", description: "", impact: "Medium", isActive: true });
  };

  const removeCaseStudy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      caseStudies: prev.caseStudies.filter((_, i) => i !== index),
    }));
    if (editingCaseStudyIndex === index) setEditingCaseStudyIndex(null);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Clear filters function
  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Sub-services Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Manage your organization's Sub-Services
                </p>
              </div>
            </div>

            <Button
              onClick={() => openAddModal()}
              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Sub-Service
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter and search sub-services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sub-services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
              {(searchTerm || categoryFilter !== "all" || statusFilter !== "all") && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">#</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead className="truncate">Main Services</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Experts</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="h-12">
                        <TableCell colSpan={7}>
                          <div className="flex items-center space-x-4">
                            <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : services.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        No services found
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service, index) => (
                      <TableRow key={service.id} className="h-12 align-middle">
                        <TableCell className="w-16 text-center">
                          <span className="text-sm font-medium text-slate-500">
                            {(currentPage - 1) * 10 + index + 1}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <div
                              className="font-semibold truncate max-w-[200px]"
                              title={service.name}
                            >
                              {service.name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="truncate max-w-[120px]"
                            title={service.category.name}
                          >
                            {service.category.name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div
                            className="truncate max-w-[300px]"
                            dangerouslySetInnerHTML={{
                              __html:
                                service.serviceDescription.substring(0, 100) +
                                "...",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{service.experts.length}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={service.isActive}
                              onCheckedChange={() =>
                                handleToggleStatus(service.id)
                              }
                            />
                            <span className="text-sm">
                              {service.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewModal(service)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditModal(service)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(service.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        {/* Add/Edit Modal */}
        <Dialog
          open={isAddModalOpen || isEditModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddModalOpen(false);
              setIsEditModalOpen(false);
              resetForm();
            }
          }}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle>
                {selectedService ? "Edit Sub-Service" : "Add New Sub-Service"}
              </DialogTitle>
              <DialogDescription>
                {selectedService
                  ? "Update sub-service information"
                  : "Create a new sub-service"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="past-projects">Past Projects</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Sub-Service Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setFormData((prev) => ({
                            ...prev,
                            name,
                            slug: generateSlug(name),
                          }));
                        }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            slug: e.target.value,
                          }))
                        }
                        disabled
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="serviceDescription">
                      Sub-Service Description
                    </Label>
                    <RichTextEditor
                      value={formData.serviceDescription}
                      onChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          serviceDescription: value,
                        }))
                      }
                      placeholder="Enter sub-service description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Main Service</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            categoryId: value,
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expertIds">Experts</Label>
                      <Select
                        value=""
                        onValueChange={(value) => {
                          if (!formData.expertIds.includes(value)) {
                            setFormData((prev) => ({
                              ...prev,
                              expertIds: [...prev.expertIds, value],
                            }));
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Add experts" />
                        </SelectTrigger>
                        <SelectContent>
                          {experts
                            .filter(
                              (expert) =>
                                !formData.expertIds.includes(expert.id)
                            )
                            .map((expert) => (
                              <SelectItem key={expert.id} value={expert.id}>
                                {expert.name} - {expert.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {formData.expertIds.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {formData.expertIds.map((expertId) => {
                            const expert = experts.find(
                              (e) => e.id === expertId
                            );
                            return expert ? (
                              <Badge
                                key={expertId}
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                {expert.name}
                                <button
                                  type="button"
                                  onClick={() =>
                                    setFormData((prev) => ({
                                      ...prev,
                                      expertIds: prev.expertIds.filter(
                                        (id) => id !== expertId
                                      ),
                                    }))
                                  }
                                  className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full"
                                >
                                  ×
                                </button>
                              </Badge>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="past-projects" className="space-y-4">
                  {/* Case Studies */}
                  <div className="space-y-2">
                    <Label>Case Studies</Label>
                    <div className="space-y-2">
                      <Input
                        placeholder="Title"
                        value={newCaseStudy.title}
                        onChange={(e) => setNewCaseStudy({ ...newCaseStudy, title: e.target.value })}
                      />
                      <RichTextEditor
                        value={newCaseStudy.description}
                        onChange={(value) => setNewCaseStudy({ ...newCaseStudy, description: value })}
                      />
                      <Select
                        value={newCaseStudy.impact}
                        onValueChange={(value) => setNewCaseStudy({ ...newCaseStudy, impact: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Impact" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Low">Low</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="flex space-x-2">
                        <Button type="button" onClick={addCaseStudy}>
                          {editingCaseStudyIndex !== null ? "Update" : "Add Case Study"}
                        </Button>
                        {editingCaseStudyIndex !== null && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setNewCaseStudy({ title: "", description: "", impact: "Medium", isActive: true });
                              setEditingCaseStudyIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Display Case Studies */}
                    {formData.caseStudies.length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {formData.caseStudies.map((cs, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded cursor-pointer"
                            onClick={() => {
                              setNewCaseStudy(cs);
                              setEditingCaseStudyIndex(index);
                            }}
                          >
                            <div className="flex-1">
                              <div className="font-medium truncate">{cs.title}</div>
                              <div
                                className="text-sm text-muted-foreground"
                                dangerouslySetInnerHTML={{ __html: cs.description }}
                              />
                              <Badge variant="outline" className="mt-1">
                                {cs.impact} Impact
                              </Badge>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCaseStudy(index);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button type="submit"
                disabled={isSubmitting}
                >   
                  {selectedService ? "Save" : "Save"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Redesigned View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-slate-50 to-white border-0 shadow-2xl">
            <DialogHeader className="border-b bg-white/80 backdrop-blur-sm top-0 z-10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold text-slate-900">
                    Sub-Service Details
                  </DialogTitle>
                  <p className="text-sm text-slate-600 mt-1">
                    Complete service information and metrics
                  </p>
                </div>
              </div>
            </DialogHeader>
            
            {selectedService && (
              <div className="overflow-y-auto flex-1 p-1">
                <div className="space-y-8 p-5">
                  {/* Header Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2 block">
                            Service Name
                          </Label>
                          <h3 className="text-xl font-bold text-slate-900">{selectedService.name}</h3>
                        </div>
                        <div>
                          <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2 block">
                            Service Slug
                          </Label>
                          <code className="text-sm bg-slate-100 px-3 py-1 rounded-md font-mono text-slate-800">
                            {selectedService.slug}
                          </code>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-2 block">
                            Category
                          </Label>
                          <Badge variant="outline" className="text-sm px-3 py-1 bg-blue-50 text-blue-700 border-blue-200">
                            {selectedService.category.name}
                          </Badge>
                        </div>
                        <div className="flex flex-col space-y-2 text-xs text-slate-500">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            Created: {new Date(selectedService.createdAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            Updated: {new Date(selectedService.updatedAt).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description Card */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500 mb-4 block">
                      Service Description
                    </Label>
                    <div
                      className="prose prose-slate prose-sm max-w-none leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: selectedService.serviceDescription,
                      }}
                    />
                  </div>

                  {/* Experts Section */}
                  {selectedService.experts.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                          Expert Team ({selectedService.experts.length})
                        </Label>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedService.experts.map((expert) => (
                          <div key={expert.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                              {expert.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            
                            <div>
                              <div className="font-medium text-slate-900 text-sm">{expert.name}</div>
                              <div className="text-xs text-slate-600">{expert.title}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Case Studies Section */}
                  {selectedService.caseStudies.length > 0 && (
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                      <div className="flex items-center justify-between mb-4">
                        <Label className="text-xs uppercase tracking-wide font-semibold text-slate-500">
                          Past Projects ({selectedService.caseStudies.length})
                        </Label>
                      </div>
                      <div className="grid gap-4">
                        {selectedService.caseStudies.map((caseStudy, index) => (
                          <div key={caseStudy.id} className="group relative">
                            <div className="p-5 border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-slate-50">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-md flex items-center justify-center text-white text-xs font-bold">
                                    {index + 1}
                                  </div>
                                  <h4 className="font-semibold text-slate-900 text-lg">{caseStudy.title}</h4>
                                </div>
                                <Badge 
                                  variant="outline" 
                                  className={`
                                    ${caseStudy.impact.toLowerCase() === 'high' ? 'bg-red-50 text-red-700 border-red-200' : ''}
                                    ${caseStudy.impact.toLowerCase() === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                                    ${caseStudy.impact.toLowerCase() === 'low' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    font-medium
                                  `}
                                >
                                  {caseStudy.impact} Impact
                                </Badge>
                              </div>
                              <div 
                                className="text-sm text-slate-600 leading-relaxed prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{
                                  __html: caseStudy.description
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}