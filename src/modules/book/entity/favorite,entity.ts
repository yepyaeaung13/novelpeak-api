import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../../user/user.entity"
import { Book } from "./book.entity"

@Entity("favorites")
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  user!: User

  @ManyToOne(() => Book, { onDelete: "CASCADE" })
  book!: Book
}
