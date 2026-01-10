import { Repository } from 'typeorm'
import { Post } from './post.entity'

export class PostRepository {
  constructor(private readonly repo: Repository<Post>) { }

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

  create(data: Partial<Post>) {
    const post = this.repo.create(data)
    return this.repo.save(post)
  }
}
