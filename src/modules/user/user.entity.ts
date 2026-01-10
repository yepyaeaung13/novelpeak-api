import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm'

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

  @Column({ type: "varchar", nullable: true })
  refreshTokenHash?: string | null

  @CreateDateColumn()
  createdAt!: Date
}
