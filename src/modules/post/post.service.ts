import { NotFoundError } from '../../common/error'
import { PostRepository } from './post.repository'

export class PostService {
  constructor(private readonly repo: PostRepository) {}

  async getPosts(page: number, limit: number) {
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

  async createPost(name: string, email: string) {
    // return this.repo.create({ name, email })
  }

  async getPostById(id: number) {
    const user = await this.repo.findById(id)

    if (!user) {
      throw new NotFoundError('User not found')
    }

    return user
  }
}
