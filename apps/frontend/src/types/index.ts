export interface User {
  id: string
  email: string
  role: 'talent' | 'formateur' | 'recruiter'
  // User preferences
  language?: 'fr' | 'en'
  theme?: 'light' | 'dark'
  fullName?: string
  walletAddress?: string
  photoUrl?: string
  githubUrl?: string
  linkedin?: string
  customPortfolioUrl?: string
  portfolioIsPublic?: boolean
  createdAt: Date
}

export interface Badge {
  id: string
  tokenId: string
  name: string
  description: string
  issuer: string
  recipient: string
  skills: string[]
  date: Date
  metadataURI: string
  transactionHash: string
  status: 'active' | 'revoked'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  role: 'talent' | 'formateur' | 'recruiter'
  walletAddress?: string
}

export interface LoginResponse {
  token: string
  user: User
}
