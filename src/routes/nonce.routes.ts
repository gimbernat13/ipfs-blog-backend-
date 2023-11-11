import * as express from "express";

const router = express.Router();

router.get("/nonce", (req, res) => {
    const nonce = Math.floor(1000 + Math.random() * 90000);
    console.log("✅ Nonce : ", nonce);
    res.json(nonce);
  });

export default router;



