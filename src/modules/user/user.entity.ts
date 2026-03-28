import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

export enum UserType {
  READER = 'reader',
  AUTHOR = 'author',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ type: 'varchar', length: 100 })
  name!: string

  @Column({ type: "varchar", unique: true })
  email!: string

  @Column({ type: 'varchar' })
  passwordHash!: string

  @Column({ type: "enum", enum: UserType, default: UserType.READER })
  userType!: UserType

  @Column({ type: "varchar", nullable: true })
  refreshTokenHash?: string | null

  @CreateDateColumn()
  createdAt!: Date
}
