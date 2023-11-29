import express from "express"
import { protect } from "../middleware/authHandler"
import { createConversation, getAllConversations } from "src/controllers/conversationController"

const router = express.Router()

router.post("/",protect, createConversation)
router.get("/",protect, getAllConversations)


export default router