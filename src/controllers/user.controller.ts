import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import * as bcrypt from "bcryptjs"
import * as jwt from "jsonwebtoken"
import { User } from "../entity/User.entity"
import * as dotenv from "dotenv"
import { verifyMessage } from "../utils/verifyWeb3Message"

dotenv.config()

const SECRET_JWT_KEY = process.env.SECRET_JWT_KEY

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const userRepository = await AppDataSource.getRepository(User)
    const existingUser = await userRepository.findOneBy({ username: username })
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" })
    }
    const passwordHash = bcrypt.hashSync(password, 8)
    const newUser = new User()
    newUser.username = username
    newUser.password = passwordHash
    await userRepository.save(newUser)
    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const web3SignupLogin = async (req: Request, res: Response) => {
  try {
    const { message, address: ethAddress, signature } = req.body
    console.log("❤️ Request body", req.body)
    console.log("eth adres", ethAddress)
    const userRepository = await AppDataSource.getRepository(User)
    let user = await userRepository.findOneBy({ ethAddress })

    if (!user) {
      console.log("🚨 No user was found, creating new user")
      user = new User()
      user.ethAddress = ethAddress
      user.password = "dummy" // FIXME: Handle password creation properly
      user.username = ethAddress
      await userRepository.save(user)
      console.log("🌟 New user created", user)
    } else {
      console.log("✅ Found existing user ", user)
    }

    console.log("🚧 Request is :  ", message, ethAddress, signature)

    const isVerified = await verifyMessage({
      message,
      address: ethAddress,
      signature,
    })

    if (!isVerified) {
      console.log("❌ Verification failed")
      return res.status(401).json({
        error: "Verification failed: Unable to Verify Signature",
      })
    }

    const jwtToken = jwt.sign({ id: user.id }, SECRET_JWT_KEY, {
      expiresIn: 86400,
    })
    console.log("✅ Auth token is:  ", jwtToken)
    return res.status(200).json({ auth: true, jwtToken })
  } catch (error) {
    console.error("❌ Error ", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const userRepository = await AppDataSource.getRepository(User)
    const existingUser = await userRepository.findOneBy({ username: username })
    if (!existingUser || !bcrypt.compareSync(password, existingUser.password)) {
      return res.status(401).json({ error: "Invalid username or password" })
    }
    const token = jwt.sign({ id: existingUser.id }, SECRET_JWT_KEY, {
      expiresIn: 86400,
    })
    res.status(200).json({ auth: true, token })
  } catch (error) {
    console.log("❌ Error ", error)
    res.status(500).json({ error: "Internal Server Error" })
  }
}
