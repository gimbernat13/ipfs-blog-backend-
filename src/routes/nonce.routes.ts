import * as express from "express";
import { authenticateJWT } from "../middleware/authentication"; 
import * as FileController from "../controllers/file.controller";

const router = express.Router();

router.get("/nonce", (req, res) => {
    const nonce = Math.floor(1000 + Math.random() * 90000);
    console.log("✅ Nonce : ", nonce);
    res.json(nonce);
  });

export default router;



