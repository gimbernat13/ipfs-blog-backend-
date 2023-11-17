import { Request, Response } from "express"
import * as fs from "fs"
import * as path from "path"
const { Web3Storage, getFilesFromPath } = require("web3.storage")
import { File } from "../entity/File.entity"
import { User } from "../entity/User.entity"
import { AppDataSource } from "../data-source"

export const uploadFile = async (req: Request, res: Response) => {
  console.log("📤 Uploading files...")
  try {
    // Extract additional fields from the request
    const { title, subtitle, preview_url, img_url } = req.body

    const token = process.env.WEB3_STORAGE_TOKEN
    const storage = new Web3Storage({ token })
    const htmlContent = req.body.htmlContent
    const tempFilePath = path.join(__dirname, "temp.html")

    fs.writeFileSync(tempFilePath, htmlContent)

    // Check if the file has been created
    if (fs.existsSync(tempFilePath)) {
      console.log("📁 temp.html was successfully created.")
    } else {
      console.log("❌ temp.html was NOT created.")
      throw new Error("File creation failed.")
    }

    const files = await getFilesFromPath(tempFilePath)
    console.log("🔄 Preparing files for upload...")

    const cid = await storage.put(files)
    console.log("✅ File uploaded successfully with CID:", cid)

    // Handle deletion gracefully
    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath)
      console.log("🗑️ temp.html was successfully deleted.")
    } else {
      console.log("❌ temp.html was not found. Cannot delete.")
    }

    const newFile = new File()
    newFile.cid = cid

    // Assign the new fields to the File entity
    newFile.title = title
    newFile.subtitle = subtitle
    newFile.date_time = new Date().toISOString() // Set current timestamp
    newFile.preview_url = preview_url
    newFile.img_url = img_url

    const userRepo = await AppDataSource.getRepository(User)
    const user = await userRepo.findOne(req.user.id)

    if (user) {
      newFile.user = user
    }

    const fileRepo = await AppDataSource.getRepository(File)
    await fileRepo.save(newFile)

    console.log("📁 File metadata saved to database.")
    console.log("🗂️ New File is : ", newFile)
    res.status(200).json({ cid })
  } catch (error) {
    console.error("❌ Error in /upload:", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
