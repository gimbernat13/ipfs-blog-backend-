
import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import * as express from "express";
import userRoutes from './routes/user.routes';
import fileRoutes from './routes/file.routes';
import postRoutes from './routes/post.routes';
import nonceRoutes from './routes/nonce.routes';
import { ethers } from "ethers";

// Generate a random wallet for testing (Do not use in production!)
const wallet = ethers.Wallet.createRandom();

// Mock values
const mockMessage = 'Hello, this is a test message!';
const mockAddress = wallet.address; // Use the generated address
const mockPrivateKey = wallet.privateKey; //



const verifyMessage = async ({ message, address, signature }: VerifyMessageParams) => {

  console.log("putas ", ethers.utils);

  try {
    let signerAddr = ethers.utils.verifyMessage(message, signature);
    console.log("-------Verify Message Function-------")
    console.log("🚧 Signers Address:", signerAddr)
    console.log("🚧 Request Address:", address)
    if (signerAddr !== address) {
      return false;
    }
    console.log("✅ Eths Signature verified:", address)
    return true;
  } catch (err) {
    console.log("🚨", err);
    return false;
  }
}
verifyMessage({ message: mockMessage, address: mockAddress, signature: mockPrivateKey })


dotenv.config();

AppDataSource.initialize()
  .then(() => {
    console.log("✅ Initialized data source");
  })
  .catch((error) => {
    console.error("❌ Could not initialize data source:", error);
    process.exit(1);
  });

const app = express();
app.use(express.json());

interface VerifyMessageParams {
  message: string;
  address: string;
  signature: string;
}


// ============Routes=============
app.use(userRoutes);
app.use(postRoutes);
app.use(fileRoutes);
app.use(nonceRoutes);

app.listen(8000, () => {
  console.log("Server running on port 8000");
});



