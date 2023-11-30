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

      const message = await Message.create({
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

        res.status(201).json({
          _id: message._id,
          conversation_id: message.conversation_id,
          message_type: message.message_type,
          text: message.text,
          sender_type: message.sender_type,
          created_at: message.created_at,
          updated_at: message.updated_at,
          sender_id: message.sender_id,
        })
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
    console.log("In getAllMessages")
    try {
      console.log("In try")
      const conversationId = req.params.conversation_id
      console.log("Conversation ID:", conversationId)

      const messages = await Message.find({
        conversation_id: req.params.conversation_id,
      })

      console.log(messages)

      if (messages) {
        res.json(messages)
      }
    } catch (error) {
      res.status(404)
      throw new Error("No messages found")
    }
  }
)
