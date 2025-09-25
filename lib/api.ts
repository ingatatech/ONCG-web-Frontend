import api from "./axios";

export async function login(email: string, password: string) {
  const res = await api.post("/users/login", { email, password });
  // Save token and user to localStorage
  if (typeof window !== "undefined") {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  return res.data.user;
}

export async function sendContactMessage(data: {
  name: string;
  subject: string;
  email: string;
  company: string;
  serviceInterest: string;
  phone?: string;
  message: string;
}) {
  return api.post("/contact-messages", data);
}

export async function fetchContactMessages() {
  return api.get("/contact-messages");
}

export async function updateContactMessageResponded(
  id: string,
  responded: boolean
) {
  return api.patch(`/contact-messages/${id}/responded`, { responded });
}

// Fetch current user profile
export async function fetchCurrentUser() {
  const res = await api.get("/users/profile");
  return res.data;
}

// Update user profile (name)
export async function updateProfile(data: { name: string }) {
  const res = await api.patch("/users/profile", data);
  return res.data;
}

// Change user password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  const res = await api.patch("/users/change-password", data);
  return res.data;
}

// Testimonial API functions
export const fetchTestimonials = async () => {
  return await api.get("/testimonials");
};

export const createTestimonial = async (formData: FormData) => {
  return await api.post("/testimonials", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateTestimonial = async (id: string, formData: FormData) => {
  return await api.patch(`/testimonials/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteTestimonial = async (id: string) => {
  return await api.delete(`/testimonials/${id}`);
};

export const fetchTestimonialById = async (id: string) => {
  return await api.get(`/testimonials/${id}`);
};

export const updateTestimonialApprovalStatus = async (
  id: string,
  approved: boolean
) => {
  return await api.patch(`/testimonials/${id}/approval`, approved, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// Expert API functions
export const getExperts = async (queryParams?: string) => {
  const url = queryParams ? `/experts?${queryParams}` : "/experts";
  const response = await api.get(url);
  return response.data;
};

export const createExpert = async (formData: FormData) => {
  const response = await api.post("/experts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateExpert = async (id: string, formData: FormData) => {
  const response = await api.patch(`/experts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteExpert = async (id: string) => {
  const response = await api.delete(`/experts/${id}`);
  return response.data;
};

export const getExpertById = async (id: string) => {
  const response = await api.get(`/experts/${id}`);
  return response.data;
};

export const getExpertsBySpecialization = async (specialization: string) => {
  const response = await api.get(`/experts/specialization/${specialization}`);
  return response.data;
};

export const reorderExperts = async (expertIds: string[]) => {
  const response = await api.put("/experts/reorder", { expertIds });
  return response.data;
};

export const getExpertStats = async () => {
  const response = await api.get("/experts/stats");
  return response.data;
};


// Services API functions
export const fetchServices = async (queryParams?: string) => {
  const url = queryParams ? `/services?${queryParams}` : "/services";
  const response = await api.get(url);
  return response.data;
};

export const fetchServiceById = async (id: string) => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

export const fetchServiceBySlug = async (slug: string) => {
  const response = await api.get(`/services/slug/${slug}`);
  return response.data;
};

export const fetchServiceCategories = async () => {
  const response = await api.get("/services/categories/all");
  return response.data;
};

export const fetchServiceExperts = async (serviceId: string) => {
  const response = await api.get(`/services/${serviceId}/experts`);
  return response.data;
};

export const fetchServiceCaseStudies = async (serviceId: string) => {
  const response = await api.get(`/services/${serviceId}/case-studies`);
  return response.data;
};


// Industries API functions
export const fetchIndustries = async (queryParams?: string) => {
  const url = queryParams ? `/industries?${queryParams}` : "/industries";
  const response = await api.get(url);
  return response.data;
};

export const fetchIndustryById = async (id: string) => {
  const response = await api.get(`/industries/${id}`);
  return response.data;
};

export const fetchIndustryBySlug = async (slug: string) => {
  const response = await api.get(`/industries/slug/${slug}`);
  return response.data;
};

export const fetchIndustryExperts = async (industryId: string) => {
  const response = await api.get(`/industries/${industryId}/experts`);
  return response.data;
};

export const fetchIndustryCaseStudies = async (industryId: string) => {
  const response = await api.get(`/industries/${industryId}/case-studies`);
  return response.data;
};

export const fetchIndustryInsights = async (industryId: string) => {
  const response = await api.get(`/industries/${industryId}/insights`);
  return response.data;
};

// Insights API functions
export const fetchInsights = async (queryParams?: string) => {
  const url = queryParams ? `/insights?${queryParams}` : "/insights";
  const response = await api.get(url);
  return response.data;
};

export const fetchInsightById = async (id: string) => {
  const response = await api.get(`/insights/${id}`);
  return response.data;
};

export const fetchPopularInsights = async () => {
  const response = await api.get(`/insights/popular/all`);
  return response.data;
};

export const fetchRecentInsights = async () => {
  const response = await api.get(`/insights/recent/all`);
  return response.data;
};

// Subscriptions API
export const subscribeNewsletter = async (email: string) => {
  const response = await api.post(`/subscribers/subscribe`, { email });
  return response.data;
};

// Leaders API functions
export const fetchLeaders = async (queryParams?: string) => {
  const url = queryParams ? `/experts/leaders?${queryParams}` : "/leaders";
  const response = await api.get(url);
  return response.data;
};

export const fetchLeaderById = async (id: string) => {
  const response = await api.get(`/experts/leaders/${id}`);
  return response.data;
};



// Departments API functions
export const fetchDepartments = async () => {
  const response = await api.get("/leaders/departments");
  return response.data;
};

export const createServiceCategory = async (data: {
  name: string;
  slug: string;
  description: string;
  isActive?: boolean;
  sortOrder?: number;
}) => {
  const response = await api.post("/services/categories", data);
  return response.data;
};

export const updateServiceCategory = async (
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
    isActive?: boolean;
    sortOrder?: number;
  }
) => {
  const response = await api.patch(`/services/categories/${id}`, data);
  return response.data;
};

export const deleteServiceCategory = async (id: string) => {
  const response = await api.delete(`/services/categories/${id}`);
  return response.data;
};

export const fetchServicesByCategory = async (categorySlug: string) => {
  const response = await api.get(
    `/services?category=${categorySlug}&limit=100`
  );
  return response.data;
};
