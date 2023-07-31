import type { WithId } from 'mongodb'

export type Project = WithId<{
  blockchain: string
  name: string
  logoUrl: string
  description: string
  website?: string
  twitter?: string
  discord?: string
  bannerImage: string
  categories: string[]
  previewImages: string[]
  projectStage: string
  status: string
  reportedAsSpam: boolean
  createdAt: Date
  updatedAt: Date
  isFeatured?: boolean
  userId: string
}>
