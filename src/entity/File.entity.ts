import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { User } from "./User.entity" // Import the User entity

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cid: string

  @Column({ nullable: true })
  title: string

  @Column({ nullable: true })
  subtitle: string
  @Column({ nullable: true })
  html_content: string

  @Column({ nullable: true })
  date_time: string

  @Column({ nullable: true })
  preview_url: string

  @Column({ nullable: true })
  img_url: string

  // Many-to-one relationship with User
  @ManyToOne(() => User, (user) => user.files)
  user: User
}
