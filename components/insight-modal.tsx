"use client"
import Image from "next/image"
import { X, Calendar, Share2, Copy, Mail, MessageCircle, Send } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

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
  const [copySuccess, setCopySuccess] = useState(false)

  if (!insight) return null

  // Generate the shareable URL (you'll need to adapt this to your actual URL structure)
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/insights/${insight.id}` 
    : `https://yourwebsite.com/insights/${insight.id}`

  const shareTitle = insight.title
  const shareText = `Check out this insight: ${insight.title}`
  
  // Strip HTML from content for sharing
  const plainTextContent = insight.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'

  // Debug function to log sharing attempts
  const debugShare = (platform: string, url: string) => {
    console.log(`Attempting to share on ${platform}:`, url)
  }

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = shareUrl
        textArea.style.position = 'absolute'
        textArea.style.left = '-9999px'
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    } catch (err) {
      console.error('Failed to copy link:', err)
      // Final fallback - show the URL to user
      prompt('Copy this link:', shareUrl)
    }
  }

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(`${shareText}\n\n${plainTextContent}\n\n${shareUrl}`)
    const whatsappUrl = `https://wa.me/?text=${text}`
    debugShare('WhatsApp', whatsappUrl)
    
    // Try to open WhatsApp, with fallback
    try {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Failed to open WhatsApp:', err)
      window.location.href = whatsappUrl
    }
  }

  const handleWhatsAppStatusShare = () => {
    const text = encodeURIComponent(`${shareText}\n${shareUrl}`)
    // First try the app protocol, then fallback to web
    const appUrl = `whatsapp://send?text=${text}`
    const webUrl = `https://wa.me/?text=${text}`
    
    debugShare('WhatsApp Status', appUrl)
    
    // Try app first
    const iframe = document.createElement('iframe')
    iframe.style.display = 'none'
    iframe.src = appUrl
    document.body.appendChild(iframe)
    
    // Fallback to web after short delay
    setTimeout(() => {
      document.body.removeChild(iframe)
      window.open(webUrl, '_blank', 'noopener,noreferrer')
    }, 1000)
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareText}\n\n${plainTextContent}\n\nRead more: ${shareUrl}`)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    
    debugShare('Email', emailUrl)
    
    try {
      window.location.href = emailUrl
    } catch (err) {
      console.error('Failed to open email client:', err)
      // Fallback - copy email content
      // const emailContent = `Subject: ${shareTitle}\n\n${shareText}\n\n${plainTextContent}\n\nRead more: ${shareUrl}`
      handleCopyLink()
      alert('Email client not available. Link copied to clipboard instead.')
    }
  }

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`${shareText}\n\n${plainTextContent}`)
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${text}`
    
    debugShare('Telegram', telegramUrl)
    
    try {
      window.open(telegramUrl, '_blank', 'noopener,noreferrer')
    } catch (err) {
      console.error('Failed to open Telegram:', err)
      window.location.href = telegramUrl
    }
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareText}`)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`
    
    debugShare('Twitter/X', twitterUrl)
    
    try {
      window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420')
    } catch (err) {
      console.error('Failed to open Twitter:', err)
      window.location.href = twitterUrl
    }
  }

  const handleDiscordShare = () => {
    // Discord doesn't have a direct web share URL, so we'll copy a formatted message
    const discordText = `**${shareTitle}**\n\n${plainTextContent}\n\n${shareUrl}`
    
    debugShare('Discord', 'Copy to clipboard')
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(discordText).then(() => {
        alert('Discord message copied to clipboard! Paste it in your Discord chat.')
      }).catch(() => {
        prompt('Copy this message for Discord:', discordText)
      })
    } else {
      // Fallback
      prompt('Copy this message for Discord:', discordText)
    }
  }

  // Native Web Share API fallback
  // const handleNativeShare = async () => {
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: shareTitle,
  //         text: shareText,
  //         url: shareUrl,
  //       })
  //     } catch (err) {
  //       console.error('Native share failed:', err)
  //     }
  //   }
  // }

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: Copy,
      action: handleCopyLink,
      color: 'text-gray-600 hover:text-gray-800',
      bgColor: 'hover:bg-gray-100'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      action: handleWhatsAppShare,
      color: 'text-green-600 hover:text-green-800',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'WhatsApp Status',
      icon: MessageCircle,
      action: handleWhatsAppStatusShare,
      color: 'text-green-500 hover:text-green-700',
      bgColor: 'hover:bg-green-50'
    },
    {
      name: 'Email',
      icon: Mail,
      action: handleEmailShare,
      color: 'text-blue-600 hover:text-blue-800',
      bgColor: 'hover:bg-blue-50'
    },
    {
      name: 'Telegram',
      icon: Send,
      action: handleTelegramShare,
      color: 'text-sky-600 hover:text-sky-800',
      bgColor: 'hover:bg-sky-50'
    },
    {
      name: 'X (Twitter)',
      icon: Share2,
      action: handleTwitterShare,
      color: 'text-black hover:text-gray-800',
      bgColor: 'hover:bg-gray-100'
    },
    {
      name: 'Discord',
      icon: MessageCircle,
      action: handleDiscordShare,
      color: 'text-indigo-600 hover:text-indigo-800',
      bgColor: 'hover:bg-indigo-50'
    }
  ]

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
                  <p className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: insight.content}} />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-200">
                  <div className="relative">
                    <button 
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>Share Insight</span>
                    </button>

                    {/* Share Menu */}
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute bottom-full mb-2 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[200px] z-60"
                        >
                          <div className="grid gap-1">
                            {shareOptions.map((option) => (
                              <button
                                key={option.name}
                                onClick={() => {
                                  option.action()
                                  setShowShareMenu(false)
                                }}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${option.color} ${option.bgColor}`}
                              >
                                <option.icon className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                  {option.name === 'Copy Link' && copySuccess ? 'Copied!' : option.name}
                                </span>
                              </button>
                            ))}
                          </div>
                          
                          {/* Arrow */}
                          <div className="absolute top-full left-6 transform -translate-x-1/2">
                            <div className="border-8 border-transparent border-t-white"></div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 border-8 border-transparent border-t-gray-200"></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Click outside to close share menu */}
          {showShareMenu && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowShareMenu(false)}
            />
          )}
        </div>
      )}
    </AnimatePresence>
  )
}