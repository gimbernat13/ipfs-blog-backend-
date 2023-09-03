import { Post } from "./entity/Post";
import { AppDataSource } from "./data-source";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY || "myFallbackSecretKey";

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source");
  })
  .catch((error) => {
    console.log("❌ Could not initialize data source:", error);
    process.exit(1); // Exit process with failure
  });

const app = express();
app.use(express.json());

const users = [
  {
    id: 1,
    username: "admin",
    password: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "", 8),
  },
];

app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD || "", 8);
    if (username !== adminUsername || !bcrypt.compareSync(password, adminPassword)) {
      console.log("request ", username, password)
      console.log("requsssest ",   process.env.ADMIN_PASSWORD , process.env.ADMIN_PASSWORD)

    
      return res.status(401).send("Invalid username or password.");
    }
    const token = jwt.sign({ id: adminUsername }, SECRET_JWT_KEY, {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token });
  } catch (error) {
    console.log("Error in /login:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await AppDataSource.getRepository(Post).find();
    res.json(posts);
  } catch (error) {
    console.log("Error in /posts:", error);
    res.status(500).send("Internal Server Error");
  }
});



app.listen(8000, () => {
  console.log("Server running on port 8000");
});

