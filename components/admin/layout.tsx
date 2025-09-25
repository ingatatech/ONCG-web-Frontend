import React, { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  User,
  Package,
  Handshake,
  Settings,
  LogOut,
  Tags,
  Newspaper,
  Inbox,
  MessageSquareQuote,
  UserCheck,
  Briefcase,
} from "lucide-react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import ProfileModal from "./ProfileModal";
import {useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/lib/api";
interface ExpandedSectionsState {
  overall: boolean;
  services: boolean;
  content: boolean;
  users: boolean;
}

export default function AdminLayoutStructure({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] =
    useState<ExpandedSectionsState>({
      overall: true,
      services: false,
      content: false,
      users: false,
    });
  const [currentUser, setCurrentUser] = useState<{ name: string } | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const toggleSection = (section: keyof ExpandedSectionsState) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const sidebarSections = [
    {
      id: "overall",
      title: "Overall",
      icon: LayoutDashboard,
      children: [{ title: "Dashboard", href: "/admin", icon: LayoutDashboard }],
    },
    {
      id: "services",
      title: "Services & Industries",
      icon: Briefcase,
      children: [
        {
          title: "Main Service",
          href: "/admin/main-services",
          icon: Briefcase,
        },
        { title: "Sub-Services", href: "/admin/services", icon: Package },
        { title: "Industries", href: "/admin/industries", icon: Tags },
      ],
    },
    {
      id: "content",
      title: "Content Management",
      icon: Newspaper,
      children: [
        { title: "Insights", href: "/admin/insights", icon: Newspaper },
        {
          title: "Testimonials",
          href: "/admin/testimonials",
          icon: MessageSquareQuote,
        },
        {
          title: "Contact Messages",
          href: "/admin/contact-messages",
          icon: Inbox,
        },
      ],
    },
    {
      id: "users",
      title: "Experts & Leaders",
      icon: Users,
      children: [
        { title: "Experts", href: "/admin/experts", icon: Users },
        { title: "Partners", href: "/admin/partners", icon: Handshake },
        { title: "Subscribers", href: "/admin/subscribers", icon: UserCheck },
      ],
    },
  ];
 const router = useRouter();
 useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
      } else {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setCurrentUser(JSON.parse(storedUser));
          } catch {
            // If stored user is invalid, fetch from API
            fetchCurrentUser()
              .then((user) => setCurrentUser(user))
              .catch(() => {
                // If fetch fails, redirect to login
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                router.push("/admin/login");
              });
          }
        } else {
          // Fetch user data if not in localStorage
          fetchCurrentUser()
            .then((user) => setCurrentUser(user))
            .catch(() => {
              localStorage.removeItem("token");
              router.push("/admin/login");
            });
        }
      }
    }
  }, [router]);

  function handleLogout() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/admin/login");
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl border-r border-slate-200 flex flex-col transform transition-all duration-500 ease-in-out overflow-hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          overflow-y-auto h-screen
        `}
      >
        {/* Header Section */}
        <div className="relative bg-white ">
          <div className="p-3">
            {/* Top Row - Logo and Close Button */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                  <Image
                    src="/images/oncg-logo1.jpg"
                    alt="ONCG - ON Consulting Group Ltd"
                    width={200}
                    height={40}
                    className="h-8 w-auto"
                  />
              </div>

              {/* Close Button for Mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

        
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {sidebarSections.map((section) => (
            <div key={section.id}>
              <button
                onClick={() =>
                  toggleSection(section.id as keyof ExpandedSectionsState)
                }
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors
                  ${
                    expandedSections[section.id as keyof ExpandedSectionsState]
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className="h-4 w-4" />
                  <span>{section.title}</span>
                </div>
                {expandedSections[section.id as keyof ExpandedSectionsState] ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Submenu */}
              {expandedSections[section.id as keyof ExpandedSectionsState] && (
                <div className="ml-6 mt-1 space-y-1">
                  {section.children.map((item, index) => (
                    <a
                      key={index}
                      href={item.href}
                      className="group flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-300 font-medium text-sm text-slate-600 hover:text-primary hover:bg-primary/5"
                    >
                      <item.icon className="h-4 w-4 text-slate-500 group-hover:text-primary" />
                      <span>{item.title}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-slate-100 shadow-sm">
          <div className="flex items-center justify-between pl-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-600 hover:text-primary p-1 rounded-lg hover:bg-slate-100 transition-all duration-300"
              >
                <Menu className="h-5 w-5" />
              </button>

             
            </div>

            {/* <div className="flex items-center ">
              <div className="flex items-center space-x-2 text-sm text-slate-700">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-600" />
                </div>
                <span>Mr Eric NIYOKWIZERWA</span>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
            </div> */}

                  {/* User Profile Section */}
            <div className="relative group">
              {/* User Info Card */}
              <div className="flex items-center space-x-3 p-3 transition-all duration-300 cursor-pointer">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-white">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>

                {/* User Details */}
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {currentUser?.name || "Admin User"}
                  </span>
                </div>

                {/* Dropdown Arrow */}
                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 group-hover:rotate-180" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-xl border border-gray-200/80 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0 z-50 backdrop-blur-sm">
                <div className="p-3 space-y-1">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover/item:bg-blue-100 transition-colors">
                      <Settings className="h-4 w-4 text-gray-600 group-hover/item:text-blue-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Settings</span>
                      <p className="text-xs text-gray-500">
                        Manage your account
                      </p>
                    </div>
                  </button>

                  <div className="h-px bg-gray-200 mx-2 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/item"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 group-hover/item:bg-red-100 transition-colors">
                      <LogOut className="h-4 w-4 text-red-500 group-hover/item:text-red-600 transition-colors" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium">Sign out</span>
                      <p className="text-xs text-red-400">End your session</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 lg:p-6">
            {children || (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-slate-900 mb-2">
                  Your content goes here
                </h2>
                <p className="text-slate-600">
                  This is just the layout structure with sidebar and navbar.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
          <AnimatePresence>
        {showProfileModal && (
          <ProfileModal onClose={() => setShowProfileModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}