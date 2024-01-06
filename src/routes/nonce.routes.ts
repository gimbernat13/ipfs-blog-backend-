import * as express from "express"
import { generateNonce, SiweMessage } from "siwe"
const router = express.Router()

router.get("/nonce", function (_, res) {
  res.setHeader("Content-Type", "text/plain")
  res.send(generateNonce())
})

export default router
