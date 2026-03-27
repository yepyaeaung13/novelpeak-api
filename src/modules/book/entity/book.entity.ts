import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from "typeorm"
import { Chapter } from "./chapter.entity"
import { Category } from "./category.entity"

export enum BookStatus {
  ONGOING = "ongoing",
  COMPLETED = "completed",
  HIATUS = "hiatus"
}

@Entity("books")
export class Book {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ length: 150 })
  title!: string

  @Column({ length: 150 })
  author!: string

  @Column({ type: "text", nullable: true })
  description!: string

  @Column({ nullable: true })
  coverImage!: string

  @Column({ default: 0 })
  views!: number

  @Column({ default: 0 })
  likes!: number

  @Column({ default: true })
  isPublished!: boolean

  @Column({ type: "enum", enum: BookStatus, default: BookStatus.ONGOING })
  status!: BookStatus

  @OneToMany(() => Chapter, (chapter) => chapter.book)
  chapters!: Chapter[]

  @ManyToMany(() => Category, (category) => category.books)
  categories!: Category[]

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
