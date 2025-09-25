"use client";

import { useState, useEffect } from "react";
import AdminLayout from "./layout";
import { Button } from "@/components/ui/button";
import {
  FileText,
  Package,
  ArrowRight,
  Activity,
  Calendar,
  MessageSquare,
  Building,
  BarChart3,
  RefreshCw,
  Handshake,
  Loader2,
  TrendingUp,
  TrendingDown,
  Globe,
  Target,
  Award,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import api from "@/lib/axios";

interface DashboardStats {
  services: number;
  industries: number;
  insights: number;
  testimonials: number;
  experts: number;
  partners: number;
  subscribers: number;
  contactMessages: number;
}

interface MonthlyStats {
  month: number;
  monthName: string;
  services: number;
  industries: number;
  insights: number;
  leaders: number;
  testimonials: number;
  experts: number;
  partners: number;
  subscribers: number;
  contactMessages: number;
  total: number;
}
interface YearlyStats {
  year: number
  services: number;
  industries: number;
  insights: number;
  leaders: number;
  testimonials: number;
  experts: number;
  partners: number;
  subscribers: number;
  contactMessages: number;
  total: number;
}
interface StatisticsResponse {
  totals: DashboardStats
  monthly: MonthlyStats[]
  yearly: YearlyStats[]
  currentYear: number
}
export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    services: 0,
    industries: 0,
    insights: 0,
    testimonials: 0,
    experts: 0,
    partners: 0,
    subscribers: 0,
    contactMessages: 0,
  });
  const [yearlyData, setYearlyData] = useState<YearlyStats[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [
        servicesRes,
        industriesRes,
        insightsRes,
        testimonialsRes,
        expertsRes,
        partnersRes,
        subscribersRes,
        contactMessagesRes,
      ] = await Promise.all([
        api.get("/services"),
        api.get("/industries"),
        api.get("/insights"),
        api.get("/testimonials"),
        api.get("/experts"),
        api.get("/partners"),
        api.get("/subscribers"),
        api.get("/contact-messages"),
      ]);

            // Fetch statistics data
      const [statisticsRes] = await Promise.all([api.get("/users/statistics")])

      const statisticsData: StatisticsResponse = statisticsRes.data

      // Calculate totals
      const totals: DashboardStats = {
        services:
          servicesRes.data?.data?.length || servicesRes.data?.length || 0,
        industries:
          industriesRes.data?.industries?.length || industriesRes.data?.length || 0,
        insights:
          insightsRes.data?.insights?.length || insightsRes.data?.length || 0,
        testimonials:
          testimonialsRes.data?.data?.length ||
          testimonialsRes.data?.length ||
          0,
        experts: expertsRes.data?.data?.length || expertsRes.data?.length || 0,
        partners:
          partnersRes.data?.data?.length || partnersRes.data?.length || 0,
        subscribers:
          subscribersRes.data?.data?.length || subscribersRes.data?.length || 0,
        contactMessages:
          contactMessagesRes.data?.data?.length ||
          contactMessagesRes.data?.length ||
          0,
      };

      setStats(totals);

      setMonthlyData(statisticsData?.monthly || [])
      setYearlyData(statisticsData?.yearly || [])
      setCurrentYear(statisticsData?.currentYear || new Date().getFullYear())
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setStats({
        services: 0,
        industries: 0,
        insights: 0,
        testimonials: 0,
        experts: 0,
        partners: 0,
        subscribers: 0,
        contactMessages: 0,
      });
      setMonthlyData([]);
       setYearlyData([])
    } finally {
      setLoading(false);
    }
  }


  // Calculate growth percentages
  function calculateGrowth(
    current: number,
    previous: number
  ): { percentage: string; trend: "up" | "down" | "neutral" } {
    if (previous === 0) {
      return {
        percentage: current > 0 ? "+100%" : "0%",
        trend: current > 0 ? "up" : "neutral",
      };
    }

    const growth = ((current - previous) / previous) * 100;
    const percentage =
      growth > 0 ? `+${growth.toFixed(1)}%` : `${growth.toFixed(1)}%`;
    const trend = growth > 0 ? "up" : growth < 0 ? "down" : "neutral";

    return { percentage, trend };
  }

  // Get growth data for stat cards
  function getStatGrowth(key: keyof DashboardStats) {
    if (!monthlyData || monthlyData.length < 2) {
      return { percentage: "0%", trend: "neutral" as const };
    }

    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];

    if (!currentMonth || !previousMonth) {
      return { percentage: "0%", trend: "neutral" as const };
    }

    return calculateGrowth(currentMonth[key] || 0, previousMonth[key] || 0);
  }

  // Prepare chart data based on time range
  const chartData = timeRange === "monthly" ? monthlyData : yearlyData
  const chartDataKey = timeRange === "monthly" ? "monthName" : "year"

  // Prepare pie chart data
  const pieData = [
    { name: "Services", value: stats.services, color: "#3b82f6" },
    { name: "Industries", value: stats.industries, color: "#10b981" },
    { name: "Insights", value: stats.insights, color: "#8b5cf6" },
    { name: "Testimonials", value: stats.testimonials, color: "#ef4444" },
    { name: "Experts", value: stats.experts, color: "#06b6d4" },
    { name: "Partners", value: stats.partners, color: "#84cc16" },
    { name: "Subscribers", value: stats.subscribers, color: "#f97316" },
  ].filter((item) => item.value > 0);
 const statCards = [
    {
      title: "Active Services",
      value: stats?.services || 0,
      growth: getStatGrowth("services"),
      icon: Package,
      gradient: "from-blue-500 via-blue-600 to-indigo-700",
      bgGradient: "from-blue-50/50 via-indigo-50/30 to-purple-50/20",
      glowColor: "shadow-blue-500/20",
      href: "/admin/services",
      description: "Professional services offered",
      accentColor: "text-blue-600",
    },
    {
      title: "Industry Sectors",
      value: stats?.industries || 0,
      growth: getStatGrowth("industries"),
      icon: Building,
      gradient: "from-emerald-500 via-green-600 to-teal-700",
      bgGradient: "from-emerald-50/50 via-green-50/30 to-teal-50/20",
      glowColor: "shadow-emerald-500/20",
      href: "/admin/industries",
      description: "Industry expertise areas",
      accentColor: "text-emerald-600",
    },
    {
      title: "Published Insights",
      value: stats?.insights || 0,
      growth: getStatGrowth("insights"),
      icon: FileText,
      gradient: "from-purple-500 via-violet-600 to-indigo-700",
      bgGradient: "from-purple-50/50 via-violet-50/30 to-indigo-50/20",
      glowColor: "shadow-purple-500/20",
      href: "/admin/insights",
      description: "Knowledge articles shared",
      accentColor: "text-purple-600",
    },

    {
      title: "Client Testimonials",
      value: stats?.testimonials || 0,
      growth: getStatGrowth("testimonials"),
      icon: MessageSquare,
      gradient: "from-pink-500 via-rose-600 to-red-700",
      bgGradient: "from-pink-50/50 via-rose-50/30 to-red-50/20",
      glowColor: "shadow-pink-500/20",
      href: "/admin/testimonials",
      description: "Customer feedback received",
      accentColor: "text-pink-600",
    },
    {
      title: "Expert Profiles",
      value: stats?.experts || 0,
      growth: getStatGrowth("experts"),
      icon: Award,
      gradient: "from-cyan-500 via-teal-600 to-blue-700",
      bgGradient: "from-cyan-50/50 via-teal-50/30 to-blue-50/20",
      glowColor: "shadow-cyan-500/20",
      href: "/admin/experts",
      description: "Expert consultants",
      accentColor: "text-cyan-600",
    },
    {
      title: "Strategic Partners",
      value: stats?.partners || 0,
      growth: getStatGrowth("partners"),
      icon: Handshake,
      gradient: "from-lime-500 via-green-600 to-emerald-700",
      bgGradient: "from-lime-50/50 via-green-50/30 to-emerald-50/20",
      glowColor: "shadow-lime-500/20",
      href: "/admin/partners",
      description: "Business partnerships",
      accentColor: "text-lime-600",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.subscribers || 0,
      growth: getStatGrowth("subscribers"),
      icon: Globe,
      gradient: "from-indigo-500 via-purple-600 to-pink-700",
      bgGradient: "from-indigo-50/50 via-purple-50/30 to-pink-50/20",
      glowColor: "shadow-indigo-500/20",
      href: "/admin/subscribers",
      description: "Active subscribers",
      accentColor: "text-indigo-600",
    },
  ];


  return (
    <AdminLayout>
      {/* Header Actions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="monthly">Monthly View ({currentYear})</option>
            </select>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchDashboardData}
            disabled={loading}
            className="border-gray-200 bg-transparent text-sm px-3 py-1"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-gradient-to-r from-primary via-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome back, Admin! 👋
              </h2>
              <p className="text-blue-100 text-sm mb-3">
                Here's your ONCG platform overview for {currentYear}.
              </p>
              <div className="flex items-center gap-6 text-sm text-blue-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Total Records:{" "}
                  {stats
                    ? Object.values(stats)
                        .reduce((sum, val) => sum + (val || 0), 0)
                        .toLocaleString()
                    : "0"}
                </div>
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Active Services: {stats?.services || 0}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <BarChart3 className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <div
              key={stat.title}
              className="group cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`relative bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl p-6 shadow-lg hover:shadow-2xl ${stat.glowColor} transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden`}>
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent group-hover:from-white/20 transition-all duration-500"></div>
                
                {/* Floating orbs */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-md group-hover:scale-150 transition-transform duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-gradient-to-br from-white/15 to-white/5 rounded-full blur-sm group-hover:scale-125 transition-transform duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-r ${stat.gradient} shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {stat.growth.trend === "up" && (
                        <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <TrendingUp className="h-3 w-3" />
                          {stat.growth.percentage}
                        </div>
                      )}
                      {stat.growth.trend === "down" && (
                        <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
                          <TrendingDown className="h-3 w-3" />
                          {stat.growth.percentage}
                        </div>
                      )}
                      <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-slate-700 text-sm font-semibold group-hover:text-slate-800 transition-colors">
                      {stat.title}
                    </h3>
                  <div className={`text-3xl font-bold ${stat.accentColor} mb-2 group-hover:scale-105 transition-transform duration-300`}>
  {loading ? (
    <div className="flex items-center gap-2">
      <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      ...
    </div>
  ) : (
    stat.value.toLocaleString()
  )}
</div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {stat.description}
                    </p>
                  </div>
                  
                  {/* Progress indicator */}
                  <div className="mt-4 bg-slate-200/50 rounded-full h-1 overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full group-hover:animate-pulse transition-all duration-1000`}
                      style={{ width: `${Math.min((stat.value / Math.max(...statCards.map(s => s.value))) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Detailed Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Monthly Analytics
              </h3>
              <p className="text-sm text-gray-600">Content growth over time</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          {chartData && chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey={chartDataKey}
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="services"
                  fill="#3b82f6"
                  name="Services"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="insights"
                  fill="#8b5cf6"
                  name="Insights"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="testimonials"
                  fill="#f59e0b"
                  name="Testimonials"
                  radius={[2, 2, 0, 0]}
                />
                <Bar
                  dataKey="leaders"
                  fill="#10b981"
                  name="Leaders"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Loading analytics...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Content Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Content Distribution
              </h3>
              <p className="text-sm text-gray-600">
                Overview of all content types
              </p>
            </div>
            <Target className="w-5 h-5 text-gray-400" />
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm">Loading distribution...</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
