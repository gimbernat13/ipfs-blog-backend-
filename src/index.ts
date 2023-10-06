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
import userRoutes from './routes/user.routes';

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



// ============Routes=============
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/files', fileRoutes);





app.listen(8000, () => {
  console.log("Server running on port 8000");
});



