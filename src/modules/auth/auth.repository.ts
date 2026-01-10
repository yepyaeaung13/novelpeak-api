import { Repository } from 'typeorm'
import { User } from '../user/user.entity'

export class AuthRepository {
  constructor(private readonly repo: Repository<User>) {}

  findByEmail(email: string) {
    return this.repo.findOne({ where: { email } })
  }

  createUser(email: string, passwordHash: string) {
    const user = this.repo.create({ email, passwordHash })
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
