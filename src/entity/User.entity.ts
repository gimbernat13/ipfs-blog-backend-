import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { File } from "./File.entity" // Import the File entity

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  username: string

  @Column({ unique: true })
  ethAddress: string
  // One-to-many relationship with File
  @OneToMany(() => File, (file) => file.user)
  files: File[]
}
