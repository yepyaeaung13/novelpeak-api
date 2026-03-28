import { FastifyReply, FastifyRequest } from "fastify";
import { BookService } from "./book.service";
import { runSeed } from "../../seeds/seed";
import { CreateBookInput, CreateOrUpdateChapterInput } from "./book.schema";

type BookQuery = {
  page?: number;
  limit?: number;
};

export class BookController {
  constructor(private readonly service: BookService) { }

  getBooks = async (
    request: FastifyRequest<{ Querystring: BookQuery }>,
    reply: FastifyReply,
  ) => {
    const page = request.query.page ?? 1;
    const limit = request.query.limit ?? 10;

    const result = await this.service.getBooks(page, limit);
    return reply.send(result);
  };

  getBookById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const result = await this.service.getBookById(Number(id));
    return reply.send(result);
  };

  getChapterById = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };

    const result = await this.service.getChapterById(Number(id));
    return reply.send(result);
  };

  createChapter = async (request: FastifyRequest, reply: FastifyReply) => {
    const { id } = request.params as { id: string };
    const chapter = request.body as CreateOrUpdateChapterInput;
    const result = await this.service.createChapter(Number(id), chapter);
    return reply.code(201).send(result);
  };

  getTrendingBooks = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getTrendingBooks();
    return reply.send(result);
  };

  getDiscoverBooks = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await this.service.getDiscoverBooks();
    return reply.send(result);
  };

  getRecommendedBooks = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const result = await this.service.getRecommendedBooks();
    return reply.send(result);
  };

  getMyLibrary = async (
    request: FastifyRequest<{ Querystring: BookQuery }>,
    reply: FastifyReply
  ) => {
    const userId = request.user.id;
    // const page = request.query.page ?? 1;
    // const limit = request.query.limit ?? 10;

    const result = await this.service.getMyLibrary(userId);
    return reply.send(result);
  };

  addToLibrary = async (
    request: FastifyRequest<{ Body: { bookId: number } }>,
    reply: FastifyReply
  ) => {
    const userId = request.user.id;
    const { bookId } = request.body;

    const result = await this.service.addToLibrary(userId, bookId);
    return reply.send(result);
  };

  removeFromLibrary = async (
    request: FastifyRequest<{ Params: { bookId: number } }>,
    reply: FastifyReply
  ) => {
    const userId = request.user.id;
    const { bookId } = request.params;

    await this.service.removeFromLibrary(userId, bookId);
    return reply.send({ success: true });
  };

  async saveProgress(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const { chapterId, progress } = request.body as {
      chapterId: number;
      progress: number;
    };

    await this.service.saveProgress(userId, chapterId, progress);
    return reply.send({ success: true });
  }

  createBook = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const book = request.body as CreateBookInput;
    const user = await this.service.createBook(book);
    return reply.code(201).send(user);
  };

  seedBooks = async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    await runSeed();
    return reply.code(201).send({ message: "Seed successfully." });
  };

  updateChapter = async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.params as { id: string }).id
    const payload = request.body as CreateOrUpdateChapterInput

    const updatedChapter = await this.service.updateChapter(Number(chapterId), payload)

    return reply.code(200).send(updatedChapter)
  }

  deleteChapter = async (request: FastifyRequest, reply: FastifyReply) => {
    const chapterId = (request.params as { id: string }).id

    const updatedChapter = await this.service.deleteChapter(Number(chapterId))

    return reply.code(200).send(updatedChapter)
  }
}
