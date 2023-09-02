import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import { AppDataSource } from "./data-source"
import * as express from "express";
import { Request, Response } from "express"


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source")
    // here you can start to work with your database
  })
  .catch((error) => console.log(error))

// create and setup express app
const app = express();
app.use(express.json());

// register routes
app.get("/posts", async function (req: Request, res: Response) {
  const posts = await AppDataSource.getRepository(Post).find()
  res.json(posts)
})

app.get("/posts/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Post).findOneBy({
    id: parseInt(req.params.id),
  })
  return res.send(results)
})
app.post("/posts", async function (req: Request, res: Response) {
  const post = await AppDataSource.getRepository(Post).create(req.body)
  const results = await AppDataSource.getRepository(Post).save(post)
  return res.send(results)
})



app.delete("/posts/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Post).delete(req.params.id)
  return res.send(results)
})




// start express server
console.log("Server running on port ", 8000)
app.listen(8000)