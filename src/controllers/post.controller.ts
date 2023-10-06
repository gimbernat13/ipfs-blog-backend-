import { Request, Response } from "express";
import { Post } from "../entity/Post.entity";
import { AppDataSource } from "../data-source";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await AppDataSource.getRepository(Post).find();
        console.log("📋 Fetching all posts...");
        res.status(200).json(posts);
    } catch (error) {
        console.error("❌ Error in /posts:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const createPost = async (req: Request, res: Response) => {
    const newPost = new Post();
    newPost.title = req.body.title;
    newPost.text = req.body.text;
    console.log("🔖 Creating a new post...", newPost);
    try {
        const post = await AppDataSource.getRepository(Post).create(req.body);
        const results = await AppDataSource.getRepository(Post).save(post);
        console.log("✅ Post created successfully!");
        return res.send(results);
    } catch (error) {
        console.error("❌ Error in /posts POST:", error);
        return res.status(500).send("Internal Server Error");
    }
}
