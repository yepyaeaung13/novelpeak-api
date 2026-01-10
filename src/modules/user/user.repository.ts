import { Repository } from 'typeorm'
import { User } from './user.entity'

export class UserRepository {
  constructor(private readonly repo: Repository<User>) { }

  async paginate(page: number, limit: number) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    })

    return { data, total }
  }

  findAll() {
    return this.repo.find()
  }

  findById(id: number) {
    return this.repo.findOneBy({ id })
  }

  create(data: Partial<User>) {
    const user = this.repo.create(data)
    return this.repo.save(user)
  }
}
