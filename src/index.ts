import { Post } from "./entity/Post.entity";
import { File } from "./entity/File.entity";
import { User } from "./entity/User.entity";


import { AppDataSource } from "./data-source";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as express from "express";
import * as fs from "fs";
import * as path from "path";

const { Web3Storage, getFilesFromPath } = require('web3.storage');


dotenv.config();

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY;
const WEB3_STORAGE_TOKEN = process.env.WEB3_STORAGE_TOKEN;


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source");
  })
  .catch((error) => {
    console.error("❌ Could not initialize data source:", error);
    process.exit(1);
  });

const app = express();
app.use(express.json());


const authenticateJWT = (req: Request, res: Response, next: express.NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log("✅ Received Token:", token);

  const decodedPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
  console.log("🤖 Expiration JWT", decodedPayload.exp); // This will show the expiration time in UNIX timestamp
  console.log(" 🤖 Current date ", Date.now() / 1000); // This will show the current time in UNIX timestamp
  console.log(" 🤖 Expiration is greater ", decodedPayload.exp > Date.now() / 1000); // This will show the current time in UNIX timestamp

  if (token == null) return res.sendStatus(401);  // if there isn't any token

  jwt.verify(token, SECRET_JWT_KEY as string, (err: any, user: any) => {
    if (err) {
      console.log("❌ jwt error", err)
      console.log("❌JWT Error Name:", err.name);
      console.log("❌JWT Error Message:", err.message);
      return res.sendStatus(403);
    }
    req.user = user;
    next();  // pass the execution off to whatever request the client intended
  });
};

app.post("/signup", async (req: Request, res: Response) => {
  console.log("user repository")
  try {
    const { username, password } = req.body;
    const userRepository = await AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username: username });
    if (existingUser) {
      console.log("existing user is  ", existingUser)
      return res.status(400).json({ error: "Username already exists" });
    }
    const passwordHash = bcrypt.hashSync(password, 8);
    const newUser = new User();
    newUser.username = username;
    newUser.password = passwordHash;
    await userRepository.save(newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in /signup:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const userRepository = await AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOneBy({ username: username });

    if (!existingUser) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    // Generate the JWT token using the user's ID

    const token = jwt.sign({ id: existingUser.id }, SECRET_JWT_KEY, { expiresIn: 86400 });
    console.log("✅ Generated Token:", token);

    res.status(200).json({ auth: true, token });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/posts", async (req: Request, res: Response) => {
  try {
    const posts = await AppDataSource.getRepository(Post).find();
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error in /posts:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/posts", authenticateJWT, async function (req: Request, res: Response) {
  const newPost = new Post()
  newPost.title = req.body.title
  newPost.text = req.body.text
  console.log("🔖 NewPost is... ", newPost);

  try {
    const post = await AppDataSource.getRepository(Post).create(req.body);
    const results = await AppDataSource.getRepository(Post).save(post);
    return res.send(results);
  } catch (error) {
    console.log("Error in /posts POST:", error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post("/upload1", authenticateJWT, async function (req: Request, res: Response) {
  const newPost = new Post()
  newPost.title = req.body.title
  newPost.text = req.body.text
  console.log("🔖 NewPost is... ", newPost);

  try {
    const post = await AppDataSource.getRepository(Post).create(req.body);
    const results = await AppDataSource.getRepository(Post).save(post);

    const token = WEB3_STORAGE_TOKEN; // Get this securely
    const storage = new Web3Storage({ token });
    const htmlContent = req.body.htmlContent;
    const tempFilePath = path.join(__dirname, "temp.html");
    fs.writeFileSync(tempFilePath, htmlContent);
    const files = await getFilesFromPath(tempFilePath);
    console.log(`🟡 Uploading HTML file to IPFS`);
    const cid = await storage.put(files);
    console.log('🟢 Content added with CID:', cid);
    fs.unlinkSync(tempFilePath);

    // Save the CID and user ID to the database
    const newFile = new File();
    newFile.cid = cid;
    console.log("🟢 CID Stored in DB :", cid)
    const userRepo = await AppDataSource.getRepository(User);


    
    const user = await userRepo.findOne(req.user.id); // Assuming 'id' exists on req.user
    if (user) {
      newFile.user = user;
    }

    const fileRepo = await AppDataSource.getRepository(File);
    await fileRepo.save(newFile);

    res.status(200).json({ cid });


    return res.send(results);
  } catch (error) {
    console.log("Error in /posts POST:", error);
    return res.status(500).send("Internal Server Error");
  }
});




app.post("/upload", authenticateJWT, async (req: Request, res: Response) => {
  console.log("uploading files ", req)
  try {
    const token = WEB3_STORAGE_TOKEN; // Get this securely
    const storage = new Web3Storage({ token });
    const htmlContent = req.body.htmlContent;
    const tempFilePath = path.join(__dirname, "temp.html");
    fs.writeFileSync(tempFilePath, htmlContent);
    const files = await getFilesFromPath(tempFilePath);
    console.log(`🟡 Uploading HTML file to IPFS`);
    const cid = await storage.put(files);
    console.log('🟢 Content added with CID:', cid);
    fs.unlinkSync(tempFilePath);

    // Save the CID and user ID to the database
    const newFile = new File();
    newFile.cid = cid;
    console.log("🟢 CID Stored in DB :", cid)
    const userRepo = await AppDataSource.getRepository(User);


    
    const user = await userRepo.findOne(req.user.id); // Assuming 'id' exists on req.user
    if (user) {
      newFile.user = user;
    }

    const fileRepo = await AppDataSource.getRepository(File);
    await fileRepo.save(newFile);

    res.status(200).json({ cid });
  } catch (error) {
    console.error("Error in /upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8000, () => {
  console.log("Server running on port 8000");
});



