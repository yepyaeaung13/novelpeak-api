import { Repository } from "typeorm";
import { Book } from "./entity/book.entity";
import { Chapter } from "./entity/chapter.entity";
import { ReadingProgress } from "./entity/reading.entity";
import { Favorite } from "./entity/favorite,entity";

export class BookRepository {
  constructor(
    private readonly repo: Repository<Book>,
    private readonly favRepo: Repository<Favorite>,
    private readonly progressRepo: Repository<ReadingProgress>
  ) { }

  async paginate(page: number, limit: number) {
    const [data, total] = await this.repo
      .createQueryBuilder("parent")
      .loadRelationCountAndMap("parent.chapterCount", "parent.chapters")
      .orderBy("parent.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

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

  async getLibrary(userId: number) {
    const favorites = await this.favRepo.find({
      where: { user: { id: userId } },
      relations: ["book"],
    });

    const result = [];

    for (const fav of favorites) {
      const progress = await this.progressRepo.findOne({
        where: {
          user: { id: userId },
          chapter: { book: { id: fav.book.id } },
        },
        relations: ["chapter"],
        order: {
          chapter: {
            chapterNumber: "DESC", // latest chapter
          },
        },
      });

      result.push({
        novelId: fav.book.id,
        title: fav.book.title,
        cover: fav.book.coverImage,
        author: fav.book.author,

        lastReadChapter: progress?.chapter
          ? {
            id: progress.chapter.id,
            chapterNumber: progress.chapter.chapterNumber,
          }
          : null,
      });
    }

    return result;
  }

  async add(userId: number, bookId: number) {
    return this.favRepo.upsert(
      {
        user: { id: userId },
        book: { id: bookId },
      },
      ["user", "book"] // requires @Unique(["user","book"])
    );
  }

  async remove(userId: number, bookId: number) {
    return this.favRepo.delete({
      user: { id: userId },
      book: { id: bookId },
    });
  }
}

export class ChapterRepository {
  constructor(private readonly repo: Repository<Chapter>) { }

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
    const chapter = await this.repo.findOne({ where: { id } })
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
