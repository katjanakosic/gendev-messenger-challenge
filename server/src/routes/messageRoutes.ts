import express from "express"
import { protect } from "../middleware/authHandler"
import { createMessage, getAllMessages, createAccept, createReject } from "../controllers/messageController"

const router = express.Router()

router.post("/", protect, createMessage)
router.get("/:conversation_id", protect, getAllMessages)
router.post("/accept", protect, createAccept)
router.post("/reject", protect, createReject)

export default router
