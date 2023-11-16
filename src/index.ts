import { AppDataSource } from "./data-source"
import * as dotenv from "dotenv"
import * as express from "express"
import userRoutes from "./routes/user.routes"
import fileRoutes from "./routes/file.routes"
import postRoutes from "./routes/post.routes"
import nonceRoutes from "./routes/nonce.routes"
import { ethers } from "ethers"
import { verifyMessage } from "./utils/verifyWeb3Message"

const cors = require("cors")

dotenv.config()

const wallet = ethers.Wallet.createRandom()

const mockMessage = "Hello, this is a test message!"
const mockAddress = wallet.address // Use the generated address
const mockPrivateKey = wallet.privateKey

var mockSignature: any = null
wallet
  .signMessage(mockMessage)
  .then((signature) => {
    console.log("Signature:", signature)
    mockSignature = signature
    verifyMessage({
      message: mockMessage,
      address: mockAddress,
      signature: mockSignature,
    })
  })
  .catch((error) => {
    console.error("Error signing message:", error)
  })

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source")
  })
  .catch((error) => {
    console.error("❌ Could not initialize data source:", error)
    process.exit(1)
  })

const app = express()
app.use(cors())
app.use(express.json())

// ============Routes=============
app.use(userRoutes)
app.use(postRoutes)
app.use(fileRoutes)
app.use(nonceRoutes)

app.listen(8000, () => {
  console.log("Server running on port 8000")
})
