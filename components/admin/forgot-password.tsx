"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, ArrowRight, Loader, Lock, CheckCircle, ArrowLeft, Building2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import Link from "next/link"
import Image from "next/image"

interface ResetPasswordResponse {
  success: boolean
  message: string
  resetToken?: string
  otp?: string
}

export default function ONCGResetPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "password" | "success">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState<string>("".padEnd(5, ""));
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  })

  const validateEmail = () => {
    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }))
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }))
      return false
    }
    setErrors((prev) => ({ ...prev, email: "" }))
    return true
  }

  const validateOTP = () => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "OTP is required" }))
      return false
    }
    if (otp.length !== 5) {
      setErrors((prev) => ({ ...prev, otp: "OTP must be 5 digits" }))
      return false
    }
    setErrors((prev) => ({ ...prev, otp: "" }))
    return true
  }

  const validatePassword = () => {
    let isValid = true
    const newErrors = { password: "", confirmPassword: "" }

    if (!newPassword) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (newPassword.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      isValid = false
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors((prev) => ({ ...prev, ...newErrors }))
    return isValid
  }

  const handleRequestReset = async () => {
    if (!validateEmail()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/users/request-reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        },
      )

      const data: ResetPasswordResponse = await response.json()

      if (data.success) {
        toast.success("Security code sent to your email!")
        setStep("otp")
      } else {
        toast.error(data.message || "Failed to send security code")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!validateOTP()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/users/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp }),
        },
      )

      const data: ResetPasswordResponse = await response.json()

      if (data.success && data.resetToken) {
        toast.success("Security code verified successfully!")
        setResetToken(data.resetToken)
        setStep("password")
      } else {
        toast.error(data.message || "Invalid security code")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, ""); // allow only numbers
    if (!value) return;

    const newOtp = otp.split("");
    newOtp[index] = value;
    const updatedOtp = newOtp.join("");
    setOtp(updatedOtp);

    // Move focus to next box
    if (e.target.nextElementSibling) {
      (e.target.nextElementSibling as HTMLInputElement).focus();
    }

    // Auto-submit when all 5 digits entered
    if (updatedOtp.length === 5 && !updatedOtp.includes("")) {
      handleVerifyOTP();
    }

    if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleOtpBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && e.currentTarget.previousElementSibling) {
      (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
    }
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) return

    setLoading(true)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api"}/users/reset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            resetToken,
            newPassword,
          }),
        },
      )

      const data: ResetPasswordResponse = await response.json()

      if (data.success) {
        toast.success("Password reset successfully!")
        setStep("success")
      } else {
        toast.error(data.message || "Failed to reset password")
      }
    } catch (error) {
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (step) {
      case "email":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              {/* <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Your Password</h2> */}
              <p className="text-gray-600">
                Enter your ONCG email address and we'll send you a secure verification code.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }))
                  }}
                  placeholder="admin@onconsultinggroup.com"
                  className={`pl-12 h-12 border-2 transition-all duration-300 focus:ring-2 ${
                    errors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <Button
              onClick={handleRequestReset}
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending Security Code...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Send Security Code
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </motion.div>
        )

      case "otp":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
        
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Enter Security Code</h2>
              <p className="text-gray-600">
                We've sent a 5-digit security code to <strong>{email}</strong>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Security Code</label>
              <div className="flex justify-center gap-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Input
                    key={i}
                    type="text"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => handleOtpChange(e, i)}
                    onKeyDown={(e) => handleOtpBackspace(e, i)}
                    className="w-14 h-14 text-center text-xl font-bold border-2 focus:border-primary focus:ring-primary/20 rounded-xl"
                    disabled={loading}
                  />
                ))}
              </div>
              {errors.otp && <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("email")}
                className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Verify Code
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>

            <div className="text-center">
              <button
                onClick={handleRequestReset}
                disabled={loading}
                className="text-primary hover:text-primary/80 text-sm font-medium"
              >
                Didn't receive the code? Resend
              </button>
            </div>
          </motion.div>
        )

      case "password":
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Password</h2>
              <p className="text-gray-600">Set a strong password for your ONCG admin account</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }))
                  }}
                  placeholder="Enter new password"
                  className={`pl-12 h-12 border-2 transition-all duration-300 focus:ring-2 ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                  }}
                  placeholder="Confirm new password"
                  className={`pl-12 h-12 border-2 transition-all duration-300 focus:ring-2 ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                  disabled={loading}
                />
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• At least 6 characters long</li>
                <li>• Include a mix of letters and numbers</li>
                <li>• Avoid using common words or personal information</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("otp")}
                className="flex-1 h-12 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleResetPassword}
                disabled={loading}
                className="flex-1 h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Updating Password...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Update Password
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        )

      case "success":
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Complete!</h2>
              <p className="text-gray-600 mb-2">
                Your ONCG admin password has been successfully updated.
              </p>
              <p className="text-sm text-gray-500">
                You can now access your dashboard with your new password.
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-center space-x-2">
                <Shield className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">Security Update Complete</span>
              </div>
            </div>

            <Link href="/admin/login">
              <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Access Admin Dashboard
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Button>
            </Link>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/30 to-primary/80 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"
          />
        </div>

        {/* Reset Password Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary/90 p-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-2"
              >
                <Image
                  src="/images/oncg-logo1.jpg"
                  alt="ONCG Logo"
                  width={48}
                  height={48}
                  className="w-14 h-14 object-contain"
                />
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-white mb-1"
              >
                ONCG Password Recovery
              </motion.h1>
          
            </div>

            {/* Form Content */}
            <div className="p-3">
              <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

              {/* Back to Login Link */}
              {step !== "success" && (
                <div className="text-center  pt-4 border-t border-gray-200">
                  <Link
                    href="/admin/login"
                    className="text-primary hover:text-primary/80 text-sm font-medium flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Admin Login
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Progress Indicator */}
          {step !== "success" && (
            <div className="mt-4 flex justify-center space-x-2">
              {["email", "otp", "password"].map((stepName, index) => (
                <div
                  key={stepName}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    step === stepName
                      ? "bg-white shadow-lg scale-110"
                      : ["email", "otp", "password"].indexOf(step) > index
                        ? "bg-white/70"
                        : "bg-white/30"
                  }`}
                />
              ))}
            </div>
          )}

        </motion.div>
      </div>
    </>
  )
}