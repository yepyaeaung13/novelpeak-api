import { Repository } from "typeorm";
import { Book } from "./entity/book.entity";
import { Chapter } from "./entity/chapter.entity";

export class BookRepository {
  constructor(private readonly repo: Repository<Book>) {}

  async paginate(page: number, limit: number) {
    const [data, total] = await this.repo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });

    return { data, total };
  }

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ["chapters"],
    });
  }

  create(data: Partial<Book>) {
    const book = this.repo.create(data);
    return this.repo.save(book);
  }

  getDiscoverBooks() {
    return this.repo.find({
      order: { createdAt: "DESC" },
    });
  }

  getTrendingBooks() {
    return this.repo.find({
      order: { createdAt: "DESC" },
    });
  }

  getRecommendedBooks() {
    return this.repo.find({
      order: { createdAt: "DESC" },
    });
  }

  paginateByUserId(userId: number, page: number, limit: number) {
    return this.repo.findAndCount({
      // where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: "DESC" },
    });
  }
}

export class ChapterRepository {
  constructor(private readonly repo: Repository<Chapter>) {}

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ["book"] });
  }

  create(data: Partial<Chapter>) {
    const chapter = this.repo.create(data);
    return this.repo.save(chapter);
  }

  async findWithNavigation(id: number) {
    const chapter = await this.repo.findOne({
      where: { id },
      relations: ["book"],
    });

    if (!chapter) return null;

    const prev = await this.repo.findOne({
      where: {
        book: { id: chapter.book.id },
        chapterNumber: chapter.chapterNumber - 1,
      },
    });

    const next = await this.repo.findOne({
      where: {
        book: { id: chapter.book.id },
        chapterNumber: chapter.chapterNumber + 1,
      },
    });

    return {
      ...chapter,
      prevChapterId: prev?.id ?? null,
      nextChapterId: next?.id ?? null,
    };
  }

  async updateChapter(id: number, data: Partial<Chapter>) {
    const chapter = await this.repo.find({ where: { id } })
    if (!chapter) return null
    Object.assign(chapter, data)
    return this.repo.save(chapter)
  }

  async deleteChapter(id: number) {
    const chapter = await this.repo.find({ where: { id } })
    if (!chapter) return null
    return this.repo.remove(chapter)
  }
}
