import { NotFoundError } from '../../common/error'
import { BookRepository, ChapterRepository } from './book.repository'
import { CreateBookInput, CreateChapterInput } from './book.schema'

export class BookService {
  constructor(
    private readonly repo: BookRepository,
    private readonly chapterRepo: ChapterRepository,
  ) { }

  async getBooks(page: number, limit: number) {
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

  async getDiscoverBooks() {
    return this.repo.getDiscoverBooks()
  }

  async getTrendingBooks() {
    return this.repo.getTrendingBooks()
  }

  async getRecommendedBooks() {
    return this.repo.getRecommendedBooks()
  }

  async getBooksByUserId(userId: number, page: number, limit: number) {
    return this.repo.paginateByUserId(userId, page, limit)
  }

  async createBook(book: CreateBookInput) {
    return this.repo.create(book)
  }

  async getBookById(id: number) {
    const user = await this.repo.findById(id)

    if (!user) {
      throw new NotFoundError('Book not found')
    }

    return user
  }

   async getChapterById(id: number) {
    const user = await this.chapterRepo.findWithNavigation(id)

    if (!user) {
      throw new NotFoundError('Book not found')
    }

    return user
  }

  async createChapter(bookId: number, chapter: CreateChapterInput) {
    const book = await this.repo.findById(bookId)

    if (!book) {
      throw new NotFoundError('Book not found')
    }

    return this.chapterRepo.create({ ...chapter, book })
  }
}
