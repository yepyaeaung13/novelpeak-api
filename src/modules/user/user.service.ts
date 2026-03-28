import { NotFoundError } from '../../common/error'
import { UserRepository } from './user.repository'
import { CreateUserInput } from './user.schema'

export class UserService {
  constructor(private readonly repo: UserRepository) {}

  async getUsers(page: number, limit: number) {
    const { data, total } = await this.repo.paginate(page, limit)

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  }

  async createUser(payload: CreateUserInput) {
    return this.repo.create(payload)
  }

  async getUserById(id: number) {
    const user = await this.repo.findById(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }
}
