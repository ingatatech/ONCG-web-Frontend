"use client"
import Image from "next/image"
import { X, Calendar, Tag, Copy, Mail, Twitter, MessageCircle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import toast from "react-hot-toast"

interface Insight {
  id: string
  title: string
  content: string
  industry: any
  createdAt: string
  image: string
}

interface InsightModalProps {
  insight: Insight | null
  isOpen: boolean
  onClose: () => void
}

export default function InsightModal({ insight, isOpen, onClose }: InsightModalProps) {
  const [showShareMenu, setShowShareMenu] = useState(false)

  if (!insight) return null

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/insights/${insight.id}`
      : ""

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4 text-green-600" />,
      link: `https://wa.me/?text=${encodeURIComponent(insight.title + " " + shareUrl)}`,
    },
  
    {
      label: "Email",
      icon: <Mail className="h-4 w-4 text-red-500" />,
      link: `mailto:?subject=${encodeURIComponent(insight.title)}&body=${encodeURIComponent(shareUrl)}`,
    },
    {
      label: "X (Twitter)",
      icon: <Twitter className="h-4 w-4 text-sky-500" />,
      link: `https://twitter.com/intent/tweet?text=${encodeURIComponent(insight.title)}&url=${encodeURIComponent(
        shareUrl
      )}`,
    },
  ]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareUrl)
    toast("Link copied to clipboard ✅")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-64 md:h-80">
                <Image src={insight.image || "/placeholder.svg"} alt={insight.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-700" />
                </button>
                {/* Category Badge */}
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {(insight?.industry?.name ?? insight?.industry ?? "").toString()}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8">
                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(insight.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">{insight.title}</h1>

                {/* Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: insight.content }} />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200 relative">
                  {/* Share Button */}
                  <button
                    onClick={() => setShowShareMenu((prev) => !prev)}
                    className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Tag className="h-4 w-4" />
                    <span>Share Insight</span>
                  </button>

               {/* Share Menu (opens upwards) */}
{showShareMenu && (
  <div className="absolute bottom-full left-0 mb-2 bg-white border rounded-lg shadow-lg w-56 p-2 z-50">
    {shareOptions.map((option, idx) => (
      <a
        key={idx}
        href={option.link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
      >
        {option.icon}
        <span>{option.label}</span>
      </a>
    ))}
    <button
      onClick={handleCopy}
      className="flex items-center w-full space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 text-sm text-gray-700"
    >
      <Copy className="h-4 w-4 text-gray-500" />
      <span>Copy Link</span>
    </button>
  </div>
)}

                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
