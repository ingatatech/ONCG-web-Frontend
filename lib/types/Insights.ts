export interface Insight {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  content: string
  image?: string
  viewCount: number
  isActive: boolean
  displayOrder: number
  industry?: {
    id: string
    name: string
  }
  author?: {
    id: string
    name: string
  }
}
