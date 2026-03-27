import { FastifyReply, FastifyRequest } from "fastify";
import { PostService } from "./book.service";
import { runSeed } from "../../seeds/seed";
import { CreateBookInput } from "./book.schema";

type BookQuery = {
  page?: number;
  limit?: number;
};

export class BookController {
  constructor(private readonly service: PostService) { }

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

  getBooksByUserId = async (
    request: FastifyRequest<{ Querystring: BookQuery }>,
    reply: FastifyReply,
  ) => {
    const userId = request.user.id;
    const page = request.query.page ?? 1;
    const limit = request.query.limit ?? 10;

    const result = await this.service.getBooksByUserId(userId, page, limit);
    return reply.send(result);
  };

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
}
