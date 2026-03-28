import { Repository } from 'typeorm'
import { User } from '../user/user.entity'

export class AuthRepository {
  constructor(private readonly repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }

  createUser(userData: Partial<User>) {
    const user = this.repo.create(userData)
    return this.repo.save(user)
  }

  updateRefreshToken(userId: number, refreshTokenHash: string | null) {
    return this.repo.update(userId, {
      refreshTokenHash
    })
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } })
  }
}
