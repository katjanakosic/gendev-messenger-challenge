import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { Message } from "../models/MessageModel"
import { User } from "../models/UserModel"
import { Conversation } from "../models/ConversationModel"

interface User {
  id: string
}

export const createMessage = asyncHandler(
  async (req: Request, res: Response) => {
    const { text, conversation_id, message_type } = req.body

    if (!text || !conversation_id) {
      res.status(400)
      throw new Error("Invalid message")
    }

    try {
      const myUserId = (req.user as User).id
      const myUserObject = await User.findById(myUserId)

      if (!myUserObject) {
        res.status(404).send()
        throw new Error("User not found")
      }

      const conversationObject = await Conversation.findById(conversation_id)

      if (!conversationObject) {
        res.status(404).send()
        throw new Error("Conversation not found")
      }

      let message = await Message.create({
        conversation_id: conversation_id,
        message_type: message_type,
        text: text,
        sender_type: myUserObject.user_type,
        created_at: new Date(),
        updated_at: new Date(),
        sender_id: myUserId,
      })

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate("conversation_id")

        res.status(201).json(message)
      } else {
        res.status(400).json({ error: "Invalid message data" })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send()
    }
  }
)

export const getAllMessages = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const conversation_id = req.params.conversation_id

      if (!conversation_id) {
        res.status(400)
        throw new Error("Invalid conversation id")
      }

      const messages = await Message.find({
        conversation_id: conversation_id,
      }).populate("sender_id", "-password")

      if (messages) {
        res.status(201).json(messages)
      } else {
        res.status(400).json({ error: "Invalid message data" })
      }
    } catch (error) {
      res.status(404)
      throw new Error("No messages found")
    }
  }
)
