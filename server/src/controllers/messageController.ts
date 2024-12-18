import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { Message, MessageTypeEnum } from "../models/MessageModel"
import { User, UserTypeEnum } from "../models/UserModel"
import { Conversation, StateEnum } from "../models/ConversationModel"

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

      let message
      if (
        conversationObject.state === StateEnum.INITIATED &&
        myUserObject.user_type === UserTypeEnum.SERVICE_PROVIDER
      ) {
        message = await Message.create({
          conversation_id: conversation_id,
          message_type: MessageTypeEnum.QUOTE_OFFER,
          text: text,
          sender_type: myUserObject.user_type,
          created_at: new Date(),
          updated_at: new Date(),
          sender_id: myUserId,
        })

        await Conversation.updateOne(
          { _id: conversationObject._id },
          { $set: { state: StateEnum.QUOTED } }
        )

        console.log("Conversation updated")
      } else {
        message = await Message.create({
          conversation_id: conversation_id,
          message_type: message_type,
          text: text,
          sender_type: myUserObject.user_type,
          created_at: new Date(),
          updated_at: new Date(),
          sender_id: myUserId,
        })
      }

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate({
          path: "conversation_id",
          populate: {
            path: "customer_id service_provider_id latest_message",
          },
        })

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

      if (!req.query.page) {
        res.status(400)
        throw new Error("Missing page")
      }
      const page = parseInt(req.query.page as string, 10)
      const pageSize = 20

      if (isNaN(page) || page < 1) {
        res.status(400)
        throw new Error("Invalid page")
      }

      const skip = (page - 1) * pageSize

      const messages = await Message.find({
        conversation_id: conversation_id,
      })
        .populate("sender_id", "-password")
        .sort({ updated_at: -1 })
        .skip(skip)
        .limit(pageSize)

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

export const createAccept = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversation_id } = req.body

    if (!conversation_id) {
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
        message_type: MessageTypeEnum.ACCEPT_QUOTE_MESSAGE,
        text: "Offer accepted",
        sender_type: myUserObject.user_type,
        created_at: new Date(),
        updated_at: new Date(),
        sender_id: myUserId,
      })

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
          state: StateEnum.ACCEPTED,
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate({
          path: "conversation_id",
          populate: {
            path: "customer_id service_provider_id",
          },
        })

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

export const createReject = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversation_id } = req.body

    if (!conversation_id) {
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
        message_type: MessageTypeEnum.REJECT_QUOTE_MESSAGE,
        text: "Offer rejected",
        sender_type: myUserObject.user_type,
        created_at: new Date(),
        updated_at: new Date(),
        sender_id: myUserId,
      })

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
          state: StateEnum.REJECTED,
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate({
          path: "conversation_id",
          populate: {
            path: "customer_id service_provider_id",
          },
        })

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

export const createComplete = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversation_id } = req.body

    if (!conversation_id) {
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
        message_type: MessageTypeEnum.COMPLETE_MESSAGE,
        text: "Conversation completed",
        sender_type: myUserObject.user_type,
        created_at: new Date(),
        updated_at: new Date(),
        sender_id: myUserId,
      })

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
          state: StateEnum.COMPLETED,
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate({
          path: "conversation_id",
          populate: {
            path: "customer_id service_provider_id",
          },
        })

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

export const createRating = asyncHandler(
  async (req: Request, res: Response) => {
    const { conversation_id, rating } = req.body

    if (!conversation_id || !rating) {
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

      await User.findByIdAndUpdate(conversationObject.service_provider_id, {
        $push: { ratings: rating },
      })

      let message = await Message.create({
        conversation_id: conversation_id,
        message_type: MessageTypeEnum.RATE_MESSAGE,
        text: `User rated with ${rating} stars`,
        sender_type: myUserObject.user_type,
        created_at: new Date(),
        updated_at: new Date(),
        sender_id: myUserId,
      })

      if (message) {
        await Conversation.findByIdAndUpdate(conversation_id, {
          latest_message: message._id,
          updated_at: new Date(),
          state: StateEnum.RATED,
        })

        message = await (
          await message.populate("sender_id", "-password")
        ).populate({
          path: "conversation_id",
          populate: {
            path: "customer_id service_provider_id",
          },
        })

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
