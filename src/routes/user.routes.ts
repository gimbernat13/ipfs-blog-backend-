import * as express from "express"
import * as userController from "../controllers/user.controller"

const router = express.Router()

router.post("/web3login", userController.web3SignupLogin)
router.get("/users", userController.getAllUsers)

export default router
