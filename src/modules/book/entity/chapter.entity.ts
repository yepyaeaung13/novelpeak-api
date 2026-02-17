import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm"
import { Book } from "./book.entity"

@Entity("chapters")
export class Chapter {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  title!: string

  @Column({ type: "text" })
  content!: string

  @Column()
  chapterNumber!: number

  @ManyToOne(() => Book, (book) => book.chapters, {
    onDelete: "CASCADE",
  })
  book!: Book

  @CreateDateColumn()
  createdAt!: Date
}
