import express from "express"
import { registerUser, authUser, getServiceProviders } from "../controllers/userController"
import { protect } from "../middleware/authHandler"

const router = express.Router()

router.post("/signup", registerUser)
router.post("/login", authUser)
router.get("/", protect, getServiceProviders)

export default router
