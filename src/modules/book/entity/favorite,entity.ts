import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm"
import { User } from "../../user/user.entity"
import { Book } from "./book.entity"

@Entity("favorites")
@Unique(["user", "book"])
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  book!: Book
}
