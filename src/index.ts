
import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import * as express from "express";
import userRoutes from './routes/user.routes';
import fileRoutes from './routes/file.routes';
import postRoutes from './routes/post.routes';

dotenv.config();

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


// ============Routes=============
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/files', fileRoutes);
app.listen(8000, () => {
  console.log("Server running on port 8000");
});



