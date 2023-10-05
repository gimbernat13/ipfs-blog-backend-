import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User.entity";  // Import the User entity

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cid: string;

  // Many-to-one relationship with User
  @ManyToOne(() => User, user => user.files)
  user: User;
}
