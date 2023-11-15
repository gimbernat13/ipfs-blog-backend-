import * as express from "express";
import * as userController from '../controllers/user.controller';

const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.post("/verifysig", userController.verifySignature)


export default router;