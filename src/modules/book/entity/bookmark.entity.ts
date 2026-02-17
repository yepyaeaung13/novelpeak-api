import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../user/user.entity"
import { Chapter } from "./chapter.entity"

@Entity("bookmarks")
export class Bookmark {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User

  @ManyToOne(() => Chapter, { onDelete: "CASCADE" })
  chapter!: Chapter

  @Column()
  lastReadPosition!: number
}
