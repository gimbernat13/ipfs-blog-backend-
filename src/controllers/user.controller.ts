import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { User } from "../entity/User.entity"
import * as dotenv from "dotenv"
import { verifyMessage } from "../utils/verifyWeb3Message"
import { ethers } from "ethers"
dotenv.config()

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = await AppDataSource.getRepository(User)
    const users = await userRepository.find()
    return res.status(200).json(users)
  } catch (error) {
    console.error("❌ Error fetching users: ", error)
    return res.status(500).json({ error: "Error fetching users" })
  }
}

export const web3SignupLogin = async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body
    console.log("Request body:", req.body)

    // Use the verifyMessage function to validate the signature
    const isVerified = await verifyMessage({
      message: message.statement,
      address: message.address,
      signature: signature,
    })

    if (!isVerified) {
      console.log("Signature verification failed")
      return res.status(400).json({
        error: "Signature verification failed",
      })
    }

    const userRepository = await AppDataSource.getRepository(User)
    let user = await userRepository.findOneBy({
      ethAddress: message.address,
    })

    if (!user) {
      console.log("No user was found, creating new user")
      user = new User()
      user.ethAddress = message.address
      user.username = message.address
      await userRepository.save(user)
      console.log("New user created", user)
    } else {
      console.log("Found existing user", user)
    }

    // Generating the JWT token
    const jwtToken = jwt.sign({ id: user.id }, SECRET_JWT_KEY, {
      expiresIn: 86400,
    })
    console.log("Auth token:", jwtToken)

    return res.status(200).json({ auth: true, jwtToken })
  } catch (error) {
    console.error("Error during authentication", error)
    res.status(500).json({ error: "Error During Authentication" })
  }
}
