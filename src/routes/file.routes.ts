import * as express from "express"
import { authenticateJWT } from "../middleware/authentication"
import * as FileController from "../controllers/file.controller"

const router = express.Router()

// Define the route for file upload
router.get("/files", FileController.getFiles)
router.get("/files/:cid", FileController.getFile)
router.post("/upload", authenticateJWT, FileController.uploadFile)

export default router
