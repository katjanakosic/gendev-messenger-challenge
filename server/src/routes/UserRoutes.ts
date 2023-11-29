import express from "express"
import { registerUser, authUser } from "../controllers/userController"

const router = express.Router()

router.route("/signup").post(registerUser)
router.post("/login", authUser)

export default router
