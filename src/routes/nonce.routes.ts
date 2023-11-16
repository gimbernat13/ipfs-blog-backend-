import * as express from "express"

const router = express.Router()

router.get("/nonce", (req, res) => {
  // Generate a numeric nonce with more than 8 digits
  const nonce = Math.floor(100000000 + Math.random() * 900000000)
  console.log("✅ Nonce: ", nonce)
  res.json(nonce) // Send the nonce as a numeric value
})

export default router
