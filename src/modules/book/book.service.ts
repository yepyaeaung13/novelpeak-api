import { NotFoundError } from '../../common/error'
import { BookRepository, ChapterRepository } from './book.repository'
import { CreateBookInput, CreateOrUpdateChapterInput } from './book.schema'
import { Chapter } from './entity/chapter.entity'

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

  async getMyLibrary(userId: number) {
    return this.repo.getLibrary(userId);
  }

  async addToLibrary(userId: number, bookId: number) {
    return this.repo.add(userId, bookId);
  }

  async removeFromLibrary(userId: number, bookId: number) {
    return this.repo.remove(userId, bookId);
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

  async createChapter(bookId: number, chapter: CreateOrUpdateChapterInput) {
    const book = await this.repo.findById(bookId)

    if (!book) {
      throw new NotFoundError('Book not found')
    }

    return this.chapterRepo.create({ ...chapter, book })
  }

  async updateChapter(chapterId: number, data: Partial<Chapter>) {
    const updated = await this.chapterRepo.updateChapter(chapterId, data)
    if (!updated) {
      throw new Error('Chapter not found')
    }
    return updated
  }

  async deleteChapter(chapterId: number) {
    const deleted = await this.chapterRepo.deleteChapter(chapterId)
    if (!deleted) {
      throw new Error('Chapter not found')
    }
    return deleted
  }
}
