import express from "express"
import { protect } from "../middleware/authHandler"
import { createMessage, getAllMessages } from "../controllers/messageController"

const router = express.Router()

router.post("/", protect, createMessage)
router.get("/:conversation_id", protect, getAllMessages)

export default router