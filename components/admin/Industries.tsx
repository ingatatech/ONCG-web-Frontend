"use client";

import type React from "react";

import { useState, useEffect } from "react";
import AdminLayout from "./layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { Label } from "@/components/ui/label";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  FileText,
  Lightbulb,
  MoreHorizontal,
  Filter,
  X,
  Building2,
  TrendingUp,
  Tags,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axios";
import toast from "react-hot-toast";
import RichTextEditor from "../ui/RichTextEditor";

interface Industry {
  id: string;
  slug: string;
  name: string;
  industryDescription: string;
  isActive: boolean;
  experts: Expert[];
  caseStudies: CaseStudy[];
  insights: Insight[];
  createdAt: string;
  updatedAt: string;
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
}

interface Insight {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
}

interface IndustryFormData {
  name: string;
  slug: string;
  industryDescription: string;
  isActive: boolean;
  expertIds: string[];
  caseStudies: CaseStudyFormData[];
}
interface CaseStudyFormData {
  title: string;
  description: string;
  impact: string;
}
export default function IndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<IndustryFormData>({
    name: "",
    slug: "",
    industryDescription: "",
    isActive: true,
    expertIds: [],
    caseStudies: [],
  });
  const [isCaseStudyModalOpen, setIsCaseStudyModalOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(
    null
  );
  const [caseStudyFormData, setCaseStudyFormData] = useState<CaseStudyFormData>(
    {
      title: "",
      description: "",
      impact: "",
    }
  );
  const [activeTab, setActiveTab] = useState<
    "details" | "experts" | "caseStudies" | "insights"
  >("details");

  const itemsPerPage = 10;

  useEffect(() => {
    fetchIndustries();
    fetchExperts();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchIndustries = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== "all" && { isActive: statusFilter }),
      });

      const response = await axiosInstance.get(`/industries?${params}`);
      setIndustries(response.data.industries);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error("Error fetching industries:", error);
      toast.error("Failed to fetch industries");
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const response = await axiosInstance.get("/experts?limit=100");
      console.log(response.data);
      setExperts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching experts:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      industryDescription: "",
      isActive: true,
      expertIds: [],
      caseStudies: [],
    });
  };

  const addCaseStudy = () => {
    setFormData((prev) => ({
      ...prev,
      caseStudies: [
        ...prev.caseStudies,
        { title: "", description: "", impact: "" },
      ],
    }));
  };

  const updateCaseStudy = (
    index: number,
    field: keyof CaseStudyFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      caseStudies: prev.caseStudies.map((cs, i) =>
        i === index ? { ...cs, [field]: value } : cs
      ),
    }));
  };

  const removeCaseStudy = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      caseStudies: prev.caseStudies.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true)
      const requestBody = {
        ...formData,
        caseStudies: formData.caseStudies.filter(
          (cs) => cs.title.trim() && cs.description.trim()
        ),
      };

      if (selectedIndustry) {
        await axiosInstance.patch(
          `/industries/${selectedIndustry.id}`,
          requestBody
        );
        toast.success("Industry updated successfully");
      } else {
        await axiosInstance.post("/industries", requestBody);
        toast.success("Industry created successfully");
      }

      await fetchIndustries();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
      resetForm();
      setSelectedIndustry(null);
    } catch (error: any) {
      console.error("Error saving industry:", error);
      toast.error(error.response?.data?.message || "Failed to save industry");
    }finally {
      setIsSubmitting(false)
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this industry?")) {
      try {
        await axiosInstance.delete(`/industries/${id}`);
        toast.success("Industry deleted successfully");
        fetchIndustries();
      } catch (error: any) {
        toast.error(
          error.response?.data?.message || "Failed to delete industry"
        );
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await axiosInstance.patch(`/industries/${id}/toggle-status`);
      toast.success("Industry status updated successfully");
      fetchIndustries();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const openEditModal = (industry: Industry) => {
    setSelectedIndustry(industry);
    setFormData({
      name: industry.name,
      slug: industry.slug,
      industryDescription: industry.industryDescription,
      isActive: industry.isActive,
      expertIds: industry.experts?.map((expert) => expert.id) || [],
      caseStudies:
        industry.caseStudies?.map((cs) => ({
          title: cs.title,
          description: cs.description,
          impact: cs.impact,
        })) || [],
    });
    setIsEditModalOpen(true);
  };

  const openViewModal = (industry: Industry) => {
    setSelectedIndustry(industry);
    setIsViewModalOpen(true);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }));
  };

  const filteredIndustries = industries.filter((industry) => {
    const matchesSearch =
      industry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      industry.industryDescription
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "true" && industry.isActive) ||
      (statusFilter === "false" && !industry.isActive);
    return matchesSearch && matchesStatus;
  });

  const handleCaseStudySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIndustry) return;

    try {
      if (selectedCaseStudy) {
        await axiosInstance.patch(
          `/industries/${selectedIndustry.id}/case-studies/${selectedCaseStudy.id}`,
          caseStudyFormData
        );
        toast.success("Past Project updated successfully");
      } else {
        await axiosInstance.post(
          `/industries/${selectedIndustry.id}/case-studies`,
          caseStudyFormData
        );
        toast.success("Past Project created successfully");
      }
      setIsCaseStudyModalOpen(false);
      fetchIndustries();
      resetCaseStudyForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteCaseStudy = async (caseStudyId: string) => {
    if (
      !selectedIndustry ||
      !window.confirm("Are you sure you want to delete this Past Project?")
    )
      return;

    try {
      await axiosInstance.delete(
        `/industries/${selectedIndustry.id}/case-studies/${caseStudyId}`
      );
      toast.success("Past Project deleted successfully");
      fetchIndustries();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to delete Past Project"
      );
    }
  };

  const resetCaseStudyForm = () => {
    setCaseStudyFormData({
      title: "",
      description: "",
      impact: "",
    });
    setSelectedCaseStudy(null);
  };

  const openCaseStudyModal = (caseStudy?: CaseStudy) => {
    if (caseStudy) {
      setSelectedCaseStudy(caseStudy);
      setCaseStudyFormData({
        title: caseStudy.title,
        description: caseStudy.description,
        impact: caseStudy.impact,
      });
    } else {
      setSelectedCaseStudy(null);
      resetCaseStudyForm();
    }
    setIsCaseStudyModalOpen(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
         {/* Page Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
    
    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
        <Tags className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </div>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
          Industries Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-600">
          Manage your organization's Industries
        </p>
      </div>
    </div>

    <Button
      onClick={() => setIsAddModalOpen(true)}
      className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
    >
      <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
      Add Industry
    </Button>
  </div>
</div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search industries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(searchTerm || statusFilter !== "all") && (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Industries Table */}
        <div className="bg-white rounded-lg border shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="font-semibold">Industry</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Experts</TableHead>
                <TableHead className="font-semibold">Past Project</TableHead>
                <TableHead className="font-semibold">Insights</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
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
              ) : filteredIndustries.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    <Building2 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">No industries found</p>
                    <p className="text-sm">
                      Get started by creating your first industry.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIndustries.map((industry) => (
                  <TableRow
                    key={industry.id}
                    className="h-12 align-middle hover:bg-gray-50/50"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {industry.name}
                          </p>
                          
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <p
                          className="text-sm text-gray-600 truncate break-words"
                          title={industry.industryDescription}
                          dangerouslySetInnerHTML={{
                        __html: industry.industryDescription.substring(0,20)}}/>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {industry.experts?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {industry.caseStudies?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Lightbulb className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium">
                          {industry.insights?.length || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={industry.isActive ? "default" : "secondary"}
                        className={`${
                          industry.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                        }`}
                      >
                        {industry.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => openViewModal(industry)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => openEditModal(industry)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Industry
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(industry.id)}
                          >
                            <TrendingUp className="mr-2 h-4 w-4" />
                            {industry.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(industry.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredIndustries.length)}{" "}
              of {filteredIndustries.length} results
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Add Industry Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Industry
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Industry Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter industry name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="industry-slug"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <RichTextEditor
                  value={formData.industryDescription}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      industryDescription: value,
                    }))
                  }
                  placeholder="Enter industry description..."
                />
              </div>

              <div className="space-y-2">
                <Label>Assign Experts</Label>
                <Select
                  value=""
                  onValueChange={(expertId) => {
                    if (!formData.expertIds.includes(expertId)) {
                      setFormData((prev) => ({
                        ...prev,
                        expertIds: [...prev.expertIds, expertId],
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experts to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {experts
                      .filter(
                        (expert) => !formData.expertIds.includes(expert.id)
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
                      const expert = experts.find((e) => e.id === expertId);
                      return expert ? (
                        <Badge
                          key={expertId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {expert.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                expertIds: prev.expertIds.filter(
                                  (id) => id !== expertId
                                ),
                              }))
                            }
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Past Project</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCaseStudy}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Past Project
                  </Button>
                </div>

                {formData.caseStudies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No Past Project added yet</p>
                    <p className="text-sm">
                      Click "Add Past Project" to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.caseStudies.map((caseStudy, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Past Project {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCaseStudy(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              value={caseStudy.title}
                              onChange={(e) =>
                                updateCaseStudy(index, "title", e.target.value)
                              }
                              placeholder="Enter Past Project title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Impact</Label>
                            <Input
                              value={caseStudy.impact}
                              onChange={(e) =>
                                updateCaseStudy(index, "impact", e.target.value)
                              }
                              placeholder="e.g., 50% increase in efficiency"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description *</Label>
                             <RichTextEditor
                             value={caseStudy.description}
                            onChange={(value) =>
                              updateCaseStudy(
                                index,
                                "description",
                                value
                              )
                            }
                              placeholder="Enter past project description..."
                              />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div> */}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit"
                disabled={isSubmitting}
                >Create Industry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Industry Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Edit Industry
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Industry Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Enter industry name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-slug">Slug *</Label>
                  <Input
                    id="edit-slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    placeholder="industry-slug"
                    required
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <RichTextEditor
                  value={formData.industryDescription}
                  onChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      industryDescription: value,
                    }))
                  }
                  placeholder="Enter industry description..."
                />
              </div>

              <div className="space-y-2">
                <Label>Assign Experts</Label>
                <Select
                  value=""
                  onValueChange={(expertId) => {
                    if (!formData.expertIds.includes(expertId)) {
                      setFormData((prev) => ({
                        ...prev,
                        expertIds: [...prev.expertIds, expertId],
                      }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experts to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    {experts
                      .filter(
                        (expert) => !formData.expertIds.includes(expert.id)
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
                      const expert = experts.find((e) => e.id === expertId);
                      return expert ? (
                        <Badge
                          key={expertId}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {expert.name}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                expertIds: prev.expertIds.filter(
                                  (id) => id !== expertId
                                ),
                              }))
                            }
                          />
                        </Badge>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium">Past Projects</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCaseStudy}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Plus className="h-4 w-4" />
                    Add Past Project
                  </Button>
                </div>

                {formData.caseStudies.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No Past Project added yet</p>
                    <p className="text-sm">
                      Click "Add Past Project" to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.caseStudies.map((caseStudy, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">
                            Past Project {index + 1}
                          </h4>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCaseStudy(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Title *</Label>
                            <Input
                              value={caseStudy.title}
                              onChange={(e) =>
                                updateCaseStudy(index, "title", e.target.value)
                              }
                              placeholder="Enter Past Project title"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Impact</Label>
                            <Input
                              value={caseStudy.impact}
                              onChange={(e) =>
                                updateCaseStudy(index, "impact", e.target.value)
                              }
                              placeholder="e.g., 50% increase in efficiency"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label>Description *</Label>
                             <RichTextEditor
                             value={caseStudy.description}
                            onChange={(value) =>
                              updateCaseStudy(
                                index,
                                "description",
                                value
                              )
                            }
                            placeholder="Enter past project description..."
                             />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* <div className="flex items-center space-x-2">
                <Switch
                  id="edit-isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="edit-isActive">Active</Label>
              </div> */}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Industry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Industry Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Industry Details
              </DialogTitle>
            </DialogHeader>
            {selectedIndustry && (
              <div className="space-y-6">
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <button
                      onClick={() => setActiveTab("details")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "details"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Details
                    </button>
                    <button
                      onClick={() => setActiveTab("experts")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "experts"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Experts ({selectedIndustry.experts?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("caseStudies")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "caseStudies"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      
                      Past Project ({selectedIndustry.caseStudies?.length || 0})
                    </button>
                    <button
                      onClick={() => setActiveTab("insights")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "insights"
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Insights ({selectedIndustry.insights?.length || 0})
                    </button>
                  </nav>
                </div>

                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Industry Name
                          </Label>
                          <p className="text-lg font-semibold">
                            {selectedIndustry.name}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Slug
                          </Label>
                          <p className="text-sm text-gray-600">
                            /{selectedIndustry.slug}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Status
                          </Label>
                          <Badge
                            variant={
                              selectedIndustry.isActive
                                ? "default"
                                : "secondary"
                            }
                            className={`${
                              selectedIndustry.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {selectedIndustry.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                   
                    </div>

   <div className="w-full max-w-full">
  <Label className="text-sm font-medium text-gray-500">
    Description
  </Label>
  <div
    className="mt-2 break-words whitespace-pre-line text-gray-700"
    dangerouslySetInnerHTML={{
      __html: selectedIndustry.industryDescription,
    }}
  />
</div>
                  </div>
                )}

                {/* Experts Tab */}
                {activeTab === "experts" && (
                  <div className="space-y-4">
                    {selectedIndustry.experts &&
                    selectedIndustry.experts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {selectedIndustry.experts.map((expert) => (
                          <div
                            key={expert.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{expert.name}</p>
                              <p className="text-sm text-gray-600">
                                {expert.title}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No experts assigned to this industry</p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "caseStudies" && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Past Projects</h3>
                      <Button
                        onClick={() => openCaseStudyModal()}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Plus className="h-4 w-4" />
                        Add Past Project
                      </Button>
                    </div>

                    {selectedIndustry.caseStudies &&
                    selectedIndustry.caseStudies.length > 0 ? (
                      <div className="space-y-3">
                        {selectedIndustry.caseStudies.map((caseStudy) => (
                          <div
                            key={caseStudy.id}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900 break-words whitespace-pre-line">
                                  {caseStudy.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1 break-words whitespace-pre-line"  dangerouslySetInnerHTML={{ __html: caseStudy.description}}/>
                               
                  
                                <p className="text-sm text-green-600 mt-2 font-medium">
                                  Impact: {caseStudy.impact}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openCaseStudyModal(caseStudy)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteCaseStudy(caseStudy.id)
                                  }
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No Past Projects available</p>
                        <Button
                          onClick={() => openCaseStudyModal()}
                          variant="outline"
                          className="mt-4"
                        >
                          Add First Past Project
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Insights Tab */}
                {activeTab === "insights" && (
                  <div className="space-y-4">
                    {selectedIndustry.insights &&
                    selectedIndustry.insights.length > 0 ? (
                      <div className="space-y-3">
                        {selectedIndustry.insights.map((insight) => (
                          <div
                            key={insight.id}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <h4 className="font-medium text-gray-900">
                              {insight.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1 truncate" dangerouslySetInnerHTML={{
                        __html: insight.content}}/>
                            <p className="text-xs text-gray-500 mt-2">
                              Published:{" "}
                              {new Date(
                                insight.publishedAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Lightbulb className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No insights available</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewModalOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setIsViewModalOpen(false);
                      openEditModal(selectedIndustry);
                    }}
                  >
                    Edit Industry
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <Dialog
          open={isCaseStudyModalOpen}
          onOpenChange={(open) => {
            if (!open) {
              setIsCaseStudyModalOpen(false);
              resetCaseStudyForm();
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedCaseStudy ? (
                  <Edit className="h-5 w-5" />
                ) : (
                  <Plus className="h-5 w-5" />
                )}
                {selectedCaseStudy ? "Edit Past Project" : "Add New Past Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCaseStudySubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="cs-title">Title *</Label>
                <Input
                  id="cs-title"
                  value={caseStudyFormData.title}
                  onChange={(e) =>
                    setCaseStudyFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  placeholder="Enter Past Project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cs-description">Description *</Label>
                <RichTextEditor
                  value={caseStudyFormData.description}
                  onChange={(value) =>
                    setCaseStudyFormData((prev) => ({
                      ...prev,
                      description: value,
                    }))
                  }
                  placeholder="Enter Past Project description..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cs-impact">Impact *</Label>
                <Input
                  id="cs-impact"
                  value={caseStudyFormData.impact}
                  onChange={(e) =>
                    setCaseStudyFormData((prev) => ({
                      ...prev,
                      impact: e.target.value,
                    }))
                  }
                  placeholder="e.g., 50% increase in efficiency"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCaseStudyModalOpen(false);
                    resetCaseStudyForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedCaseStudy
                    ? "Update Past Project"
                    : "Create Past roject"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
