import { Injectable } from '@nestjs/common'
import { FirebaseService } from '../firebase/firebase.service'

@Injectable()
export class UsersService {
  constructor(private firebaseService: FirebaseService) {}

  async findAll(): Promise<any[]> {
    const users = await this.firebaseService.findAll('users')
    return users.map(user => ({
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      walletAddress: user.walletAddress,
      status: user.status,
      createdAt: user.createdAt,
      // preferences
      language: user.language || 'fr',
      theme: user.theme || 'light',
    }))
  }

  async findOne(id: string): Promise<any | null> {
    const user = await this.firebaseService.findById('users', id)
    
    if (!user) return null

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      walletAddress: user.walletAddress,
      createdAt: user.createdAt,
      photoUrl: user.photoUrl,
      githubUrl: user.githubUrl,
      linkedin: user.linkedin,
      customPortfolioUrl: user.customPortfolioUrl,
      portfolioIsPublic: user.portfolioIsPublic,
      objective: user.objective,
      // preferences (language: 'fr' | 'en', theme: 'light' | 'dark')
      language: user.language || 'fr',
      theme: user.theme || 'light',
    }
  }

  async updateUser(id: string, updateData: any): Promise<any> {
    await this.firebaseService.update('users', id, updateData)
    return this.findOne(id)
  }

  async updateUserStatus(userId: string, status: string): Promise<any> {
    await this.firebaseService.update('users', userId, { status })
    return { success: true, userId, status }
  }
}
