import { Request, Response } from "express";
import * as fs from "fs";
import * as path from "path";
import { Web3Storage } from "web3.storage";
import { File } from "../entity/File.entity";
import { User } from "../entity/User.entity";
import { AppDataSource } from "../data-source";

export const uploadFile = async (req: Request, res: Response) => {
    console.log("📤 Uploading files...");
    try {
        const token = process.env.WEB3_STORAGE_TOKEN;
        const storage = new Web3Storage({ token });
        const htmlContent = req.body.htmlContent;
        const tempFilePath = path.join(__dirname, "temp.html");
        fs.writeFileSync(tempFilePath, htmlContent);
        const files = await getFilesFromPath(tempFilePath);
        console.log("🔄 Preparing files for upload...");
        const cid = await storage.put(files);
        console.log("✅ File uploaded successfully with CID:", cid);
        fs.unlinkSync(tempFilePath);
        const newFile = new File();
        newFile.cid = cid;
        const userRepo = await AppDataSource.getRepository(User);
        const user = await userRepo.findOne(req.user.id);
        if (user) {
            newFile.user = user;
        }
        const fileRepo = await AppDataSource.getRepository(File);
        await fileRepo.save(newFile);
        console.log("📁 File metadata saved to database.");
        res.status(200).json({ cid });
    } catch (error) {
        console.error("❌ Error in /upload:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
