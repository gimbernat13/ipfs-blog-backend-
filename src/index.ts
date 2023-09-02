import { Post } from "./entity/Post"
import { Category } from "./entity/Category"
import { AppDataSource } from "./data-source"
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { Request, Response } from "express"



dotenv.config();


const SECRET_JWT_KEY = "mySecretKey";


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source")
    // here you can start to work with your database
  })
  .catch((error) => console.log(error))

// create and setup express app
const app = express();
app.use(express.json());



const users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8),
  },
];


// register routes
app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || '', 8);

  if (username !== adminUsername || !bcrypt.compareSync(password, adminPassword)) {
    return res.status(401).send("Invalid username or password.");
  }

  const token = jwt.sign({ id: adminUsername }, process.env.SECRET_JWT_KEY, {
    expiresIn: 86400,
  });

  res.status(200).send({ auth: true, token });
});




app.get("/posts", async function (req: Request, res: Response) {
  const posts = await AppDataSource.getRepository(Post).find()
  res.json(posts)
})




// start express server
console.log("Server running on port ", 8000)
app.listen(8000)