import "reflect-metadata"
import { DataSource } from "typeorm"
import { Post } from "./entity/Post.entity"
import { Category } from "./entity/Category.entity"
// FIXME: Abstract to env variables  
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "1234",
  database: "gigz",
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity.js'] ,
  subscribers: [],
  migrations: [],
})
