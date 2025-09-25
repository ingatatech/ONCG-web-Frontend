export interface Leaders {
  id: string
  name: string
  title: string
  department: string
  bio: string
  image: string
  location: string
  experience: number
  projectsLed: number
  linkedinUrl: string
  twitterUrl: string
  email: string
  phone: string
  achievements: string[]
  specialties: string[]
  isActive: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
}

export interface LeaderFormData {
  name: string
  title: string
  department: string
  bio: string
  location: string
  experience: number
  projectsLed: number
  email: string
  phone: string
  linkedinUrl: string
  twitterUrl: string
  specialties: string[]
  isActive: boolean
}
