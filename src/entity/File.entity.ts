import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";  // Import the User entity

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  cid: string

  @Column()
  title: string

  @Column()
  subtitle: string

  @Column()
  date_time: string

  @Column()
  preview_url: string

  @Column()
  img_url: string

  // Many-to-one relationship with User
  @ManyToOne(() => User, (user) => user.files)
  user: User
}
