import express from "express"
import { registerUser, authUser, allUsers } from "../controllers/userController"
import { protect } from "../middleware/authHandler"

const router = express.Router()

router.post("/signup", registerUser)
router.post("/login", authUser)
router.get("/", protect, allUsers)

export default router
