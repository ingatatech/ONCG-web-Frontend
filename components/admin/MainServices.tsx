"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import {
  Search,
  Edit,
  Trash2,
  Plus,
  Eye,
  Check,
  X,
  Clock,
  List,

  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./layout";
import {
  fetchServiceCategories,
  createServiceCategory,
  updateServiceCategory,
  deleteServiceCategory,
  fetchServicesByCategory,
} from "@/lib/api";
import RichTextEditor from "../ui/RichTextEditor";
import { DragDropContext, Droppable, DroppableProvided, Draggable, DraggableProvided, DropResult } from "@hello-pangea/dnd";
import api from "@/lib/axios";
import LoadingSpinner from "../LoadingSpinner";

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  title: string;
  slug: string;
  serviceDescription: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showServicesModal, setShowServicesModal] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<ServiceCategory | null>(null);
  const [viewingCategory, setViewingCategory] =
    useState<ServiceCategory | null>(null);
  const [categoryServices, setCategoryServices] = useState<Service[]>([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    sortOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pageSize = 10;

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      setLoading(true);
      const res = await fetchServiceCategories();

      setCategories(res.data);
    } catch (err: any) {
      console.log(err.response?.data?.message || "Failed to fetch categories");
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      setIsSubmitting(true);

      if (editingCategory) {
        await updateServiceCategory(editingCategory.id, formData);
        toast.success("Category updated successfully!");
      } else {
        await createServiceCategory(formData);
        toast.success("Category created successfully!");
      }

      setShowModal(false);
      setEditingCategory(null);
      resetForm();
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleEdit(category: ServiceCategory) {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
    });
    setShowModal(true);
  }

  function handleView(category: ServiceCategory) {
    setViewingCategory(category);
    setShowViewModal(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteServiceCategory(id);
      toast.success("Category deleted successfully!");
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  }

  async function handleStatusToggle(id: string, currentStatus: boolean) {
    try {
      await updateServiceCategory(id, { isActive: !currentStatus });
      toast.success(
        `Category ${!currentStatus ? "activated" : "deactivated"} successfully!`
      );
      loadCategories();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  }

  function resetForm() {
    setFormData({
      name: "",
      slug: "",
      description: "",
      isActive: true,
      sortOrder: 0,
    });
  }

  function openAddModal() {
    setEditingCategory(null);
    resetForm();
    setShowModal(true);
  }

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }

  function handleNameChange(name: string) {
    const slug = generateSlug(name);
    setFormData({ ...formData, name, slug });
  }

  async function handleViewServices(category: ServiceCategory) {
    try {
      setServicesLoading(true);
      setViewingCategory(category);
      const res = await fetchServicesByCategory(category.slug);
      setCategoryServices(res.data || []);
      setShowServicesModal(true);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to fetch services");
    } finally {
      setServicesLoading(false);
    }
  }

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.slug?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category?.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.isActive) ||
      (statusFilter === "inactive" && !category.isActive);

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredCategories.length / pageSize);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
   async function handleReorder(result: DropResult) {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const newCategories = Array.from(categories);
    const [removed] = newCategories.splice(sourceIndex, 1);
    newCategories.splice(destIndex, 0, removed);
    const categoryIds = newCategories.map((expert: ServiceCategory) => expert.id);
    try {
      await api.put("/services/categories/reorder", { categoryIds })
      toast.success("Categories order updated successfully!")
      fetchServiceCategories()
    } catch (err: any) {
      toast.error("Failed to update categories order")
      fetchServiceCategories() // Revert on error
    }
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 border-green-200">
        <Check className="w-3 h-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800 border-gray-200">
        <Clock className="w-3 h-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <AdminLayout>
       {/* Page Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Services Management
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Manage your organization's Services
                </p>
              </div>
            </div>
        
            <Button
              onClick={() => openAddModal()}
              className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-300 px-3 py-2 sm:px-4 sm:py-2 flex items-center justify-center text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 space-y-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search services by name, slug, or description..."
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </motion.div>

      {/* Categories Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      >
        {loading ? (
          <div className="flex items-center justify-center py-20">
              <LoadingSpinner />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📂</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Categories Found
            </h3>
            <p className="text-gray-500 mb-6">
              No categories match your search criteria
            </p>
            <Button
              onClick={openAddModal}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Category
            </Button>
          </div>
        ) : (
                              					<DragDropContext onDragEnd={handleReorder}>
						<Droppable droppableId="team-table">
							{(provided: DroppableProvided) => (
								<div ref={provided.innerRef} {...provided.droppableProps} className="overflow-y-auto">
            <table className="w-full">
              <thead className="bg-primary/5 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                    #
                  </th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                    Name
                  </th>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>

                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900 truncate">
                    Sub-Services
                  </th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                    Created
                  </th>
                  <th className="px-3 py-4 text-left text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence>
                  {paginatedCategories.map((category, index) => (
                   												<Draggable key={category.id} draggableId={category.id} index={index}>
													{(provided: DraggableProvided, snapshot) => (
                      <tr
                        key={category.id}
                    
                        ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
                      className={`hover:bg-primary/5 transition-colors duration-200 ${snapshot.isDragging ? "bg-sky-100" : ""}`}
                    >
                      <td className="px-3 py-4 text-sm text-gray-900">
                        {(page - 1) * pageSize + index + 1}
                      </td>
                      <td className="px-3 py-4 truncate">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {category.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-900">
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-600 truncate max-w-[200px]"     dangerouslySetInnerHTML={{
                              __html:category.description}}/>
                              
                          </div>
                        </div>
                      </td>

                      <td className="px-3 py-4">
                        {getStatusBadge(category.isActive)}
                      </td>

                      <td className="px-3 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewServices(category)}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <List className="w-4 h-4 mr-1" />
                          View Sub-Services
                        </Button>
                      </td>
                      <td className="px-3 py-4 truncate">
                        <div className="text-sm text-gray-600">
                          {new Date(category.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleView(category)}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(category)}
                            className="border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleStatusToggle(category.id, category.isActive)
                            }
                            className={
                              category.isActive
                                ? "border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                                : "border-green-200 text-green-600 hover:bg-green-50"
                            }
                          >
                            {category.isActive ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(category.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
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
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="text-sm text-gray-700">
            Showing {(page - 1) * pageSize + 1} to{" "}
            {Math.min(page * pageSize, filteredCategories.length)} of{" "}
            {filteredCategories.length} results
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

      {/* View Category Modal */}
      <AnimatePresence>
        {showViewModal && viewingCategory && (
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
                <h2 className="text-2xl font-bold text-gray-900">
                  View Category
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowViewModal(false)}
                  className="border-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Category Info */}
                <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-xl">
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center border-4 border-white shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {viewingCategory.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {viewingCategory.name}
                    </h3>

                    <div className="flex items-center gap-4 mb-4">
                      <Badge
                        variant={
                          viewingCategory.isActive ? "default" : "secondary"
                        }
                        className={
                          viewingCategory.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-gray-100 text-gray-800 border-gray-200"
                        }
                      >
                        {viewingCategory.isActive ? (
                          <>
                            <Check className="w-3 h-3 mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Inactive
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Description Section */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Description
                  </h4>
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-6">
                    <p
                      className="text-gray-700 text-base leading-relaxed"
                      dangerouslySetInnerHTML={{
                        __html: viewingCategory.description,
                      }}
                    />
                  </div>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h5 className="text-sm font-medium text-gray-500 mb-1">
                      Created At
                    </h5>
                    <p className="text-gray-900">
                      {new Date(viewingCategory.createdAt).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
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
                      setShowViewModal(false);
                      handleEdit(viewingCategory);
                    }}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Service
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
                  {editingCategory ? "Edit Service" : "Add New Service"}
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  className="border-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Enter service name..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <Input
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      disabled
                      placeholder="Enter URL slug..."
                      className="border-gray-200 focus:border-primary focus:ring-primary/20"
                    />
                  </div>
                </div>


                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <RichTextEditor
                    value={formData.description}
                    onChange={(value) =>
                      setFormData({ ...formData, description: value })
                    }
                    placeholder="Enter service description..."
                  />
                </div>
                  <div className="flex items-center">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Active
                      </span>
                    </label>
                  </div>
              </div>

              <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      {editingCategory ? "Updating..." : "Creating..."}
                    </div>
                  ) : editingCategory ? (
                    "Save"
                  ) : (
                    "Save"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-gray-200"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Services Modal */}
      <AnimatePresence>
        {showServicesModal && viewingCategory && (
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
                <h2 className="text-2xl font-bold text-gray-900">
                  Services in "{viewingCategory.name}"
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowServicesModal(false)}
                  className="border-gray-200"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {servicesLoading ? (
                <div className="flex items-center justify-center py-20">
                    <LoadingSpinner />
                </div>
              ) : categoryServices.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🔧</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Sub-Services Found
                  </h3>
                  <p className="text-gray-500 mb-6">
                    This Service doesn't have any sub-services yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600">
                      Found {categoryServices.length} sub-service
                      {categoryServices.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {categoryServices.map((service, index) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-primary/20 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {service.name}
                              </h3>
                              <Badge
                                variant={
                                  service.isActive ? "default" : "secondary"
                                }
                                className={
                                  service.isActive
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : "bg-gray-100 text-gray-800 border-gray-200"
                                }
                              >
                                {service.isActive ? (
                                  <>
                                    <Check className="w-3 h-3 mr-1" />
                                    Active
                                  </>
                                ) : (
                                  <>
                                    <Clock className="w-3 h-3 mr-1" />
                                    Inactive
                                  </>
                                )}
                              </Badge>
                            </div>

                            <p className="text-gray-700 text-sm leading-relaxed mb-3">
                              {service.title}
                            </p>

                            <div className="text-xs text-gray-500">
                              Created:{" "}
                              {new Date(service.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setShowServicesModal(false)}
                  className="border-gray-200"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
