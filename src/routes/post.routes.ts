import express from "express";
import { authenticateJWT } from "../middleware/authentication"; 
import * as PostController from "../controllers/post.controller";

const router = express.Router();

// Define the routes for posts
router.get("/posts", PostController.getPosts);
router.post("/posts", authenticateJWT, PostController.createPost);

export default router;
