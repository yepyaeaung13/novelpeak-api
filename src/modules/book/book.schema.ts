import { Static, Type } from '@sinclair/typebox'

export const BookSchema = Type.Object({
  id: Type.Number(),
  title: Type.String(),
  content: Type.String(),
  createdAt: Type.String({ format: 'date-time' }),
  updatedAt: Type.String({ format: 'date-time' })
})
export type BookType = Static<typeof BookSchema>;

export const CreateBookBodySchema = Type.Object({
  title: Type.String({ minLength: 2 }),
  author: Type.String({ minLength: 2 }),
  description: Type.String({ minLength: 2 }),
  coverImage: Type.String({ format: 'uri', nullable: true }),
  // categories: Type.Array(Type.String({ minLength: 2 })),
  // status: Type.Enum(BookStatus)
})
export type CreateBookInput = Static<typeof CreateBookBodySchema>;

export const CreateOrUpdateChapterBodySchema = Type.Object({
  title: Type.String({ minLength: 1 }),
  content: Type.String({ minLength: 1 }),
  chapterNumber: Type.Number({ minimum: 1 })
})
export type CreateOrUpdateChapterInput = Static<typeof CreateOrUpdateChapterBodySchema>;

export const SaveProgressBodySchema = Type.Object({
  chapterId: Type.Number({ minimum: 1 }),
  progress: Type.Number({ minimum: 0 })
})
export type SaveProgressInput = Static<typeof SaveProgressBodySchema>;
