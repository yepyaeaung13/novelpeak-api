import { hash, compare } from 'bcrypt'
import { AuthRepository } from './auth.repository'
import {
  ConflictError,
  UnauthorizedError
} from '../../common/error'

export class AuthService {
  constructor(private readonly repo: AuthRepository) {}

  async register(email: string, password: string) {
    const exists = await this.repo.findByEmail(email)
    if (exists) {
      throw new ConflictError('Email already exists')
    }

    const passwordHash = await hash(password, 10)
    return this.repo.createUser(email, passwordHash)
  }

  async login(email: string, password: string) {
    const user = await this.repo.findByEmail(email)
    if (!user) {
      throw new UnauthorizedError('Invalid credentials')
    }

    const valid = await compare(password, user.passwordHash)
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials')
    }

    return user
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.repo.findById(userId)
    if (!user || !user.refreshTokenHash) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    const valid = await compare(refreshToken, user.refreshTokenHash)
    if (!valid) {
      throw new UnauthorizedError('Invalid refresh token')
    }

    return user
  }

  async storeRefreshToken(userId: number, token: string) {
    const hashToken = await hash(token, 10)
    await this.repo.updateRefreshToken(userId, hashToken)
  }

  async clearRefreshToken(userId: number) {
    await this.repo.updateRefreshToken(userId, null)
  }
}
