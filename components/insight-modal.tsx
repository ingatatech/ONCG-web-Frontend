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

  // Generate the shareable URL
  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/insights/${insight.id}` 
    : `https://yourwebsite.com/insights/${insight.id}`

  const shareTitle = insight.title
  const shareText = `Check out this insight: ${insight.title}`
  
  // Strip HTML from content for sharing
  const plainTextContent = insight.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'

  const handleCopyLink = async () => {
    try {
      console.log('Attempting to copy:', shareUrl)
      
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
        return
      }
      
      // Fallback method
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const successful = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (successful) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } else {
        throw new Error('execCommand failed')
      }
    } catch (err) {
      console.error('Copy failed:', err)
      
      // Final fallback
      const userCopied = window.prompt('Please copy this link:', shareUrl)
      if (userCopied !== null) {
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      }
    }
  }

  const handleWhatsAppShare = () => {
    try {
      const message = `${shareText}\n\n${plainTextContent}\n\n${shareUrl}`
      const encodedMessage = encodeURIComponent(message)
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`
      
      console.log('WhatsApp URL:', whatsappUrl)
      
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
      
      if (newWindow) {
        // Check if window was blocked
        setTimeout(() => {
          if (newWindow.closed) {
            console.log('WhatsApp window was closed or blocked')
          }
        }, 1000)
      } else {
        console.log('Window.open failed, trying location.href')
        window.location.href = whatsappUrl
      }
    } catch (err) {
      console.error('WhatsApp share failed:', err)
    }
  }

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareTitle)
    const body = encodeURIComponent(`${shareText}\n\n${plainTextContent}\n\nRead more: ${shareUrl}`)
    const emailUrl = `mailto:?subject=${subject}&body=${body}`
    
    try {
      window.location.href = emailUrl
    } catch (err) {
      console.error('Failed to open email client:', err)
      // Fallback - copy link instead
      handleCopyLink()
      alert('Email client not available. Link copied to clipboard instead.')
    }
  }

  const handleTelegramShare = () => {
    const text = encodeURIComponent(`${shareText}\n\n${plainTextContent}`)
    const url = encodeURIComponent(shareUrl)
    const telegramUrl = `https://t.me/share/url?url=${url}&text=${text}`
    
    try {
      const newWindow = window.open(telegramUrl, '_blank', 'noopener,noreferrer')
      if (!newWindow) {
        window.location.href = telegramUrl
      }
    } catch (err) {
      console.error('Failed to open Telegram:', err)
      window.location.href = telegramUrl
    }
  }

  const handleTwitterShare = () => {
    const text = encodeURIComponent(`${shareText}`)
    const url = encodeURIComponent(shareUrl)
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`
    
    try {
      const newWindow = window.open(twitterUrl, '_blank', 'noopener,noreferrer,width=550,height=420')
      if (!newWindow) {
        window.location.href = twitterUrl
      }
    } catch (err) {
      console.error('Failed to open Twitter:', err)
      window.location.href = twitterUrl
    }
  }

  const handleDiscordShare = async () => {
    const discordText = `**${shareTitle}**\n\n${plainTextContent}\n\n${shareUrl}`
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(discordText)
        alert('Discord message copied to clipboard! Paste it in your Discord chat.')
      } else {
        // Fallback
        const userInput = prompt('Copy this message for Discord:', discordText)
        if (userInput !== null) {
          alert('Message ready to paste in Discord!')
        }
      }
    } catch (err) {
      console.error('Failed to copy Discord message:', err)
      prompt('Copy this message for Discord:', discordText)
    }
  }

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
        <>
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
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[200px] z-[70]"
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
                            
                            {/* Arrow pointing up */}
                            <div className="absolute bottom-full left-6 transform -translate-x-1/2">
                              <div className="border-8 border-transparent border-b-white"></div>
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-8 border-transparent border-b-gray-200"></div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Click outside to close share menu */}
          {showShareMenu && (
            <div
              className="fixed inset-0 z-[60]"
              onClick={() => setShowShareMenu(false)}
            />
          )}
        </>
      )}
    </AnimatePresence>
  )
}