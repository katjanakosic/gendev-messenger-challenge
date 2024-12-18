import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { Conversation, StateEnum } from "../models/ConversationModel"
import { User, UserTypeEnum } from "../models/UserModel"

export const createConversation = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { otherUserId } = req.body
      const myUserId = (req.user as User).id
      const myUserObject = await User.findById(myUserId)
      const otherUserObject = await User.findById(otherUserId)

      if (!myUserObject || !otherUserObject) {
        res.status(404).send()
        throw new Error("User not found")
      }

      let customer_id = ""
      let service_provider_id = ""
      let customer_name = ""
      let service_provider_name = ""

      if (myUserObject.user_type === UserTypeEnum.CUSTOMER) {
        customer_id = myUserId
        customer_name = myUserObject.name
        service_provider_id = otherUserId
        service_provider_name = otherUserObject.name
      } else {
        service_provider_id = myUserId
        service_provider_name = myUserObject.name
        customer_id = otherUserId
        customer_name = otherUserObject.name
      }

      const existingConversation = await Conversation.findOne({
        $or: [
          {
            $and: [
              { customer_id: customer_id },
              { service_provider_id: service_provider_id },
            ],
          },
          {
            $and: [
              { customer_id: service_provider_id },
              { service_provider_id: customer_id },
            ],
          },
        ],
      })

      if (existingConversation) {
        await (
          await existingConversation.populate("customer_id", "-password")
        ).populate("service_provider_id", "-password")
        res.status(200).json(existingConversation)
        return
      }

      const conversation = await (
        await (
          await Conversation.create({
            customer_name: customer_name,
            service_provider_name: service_provider_name,
            state: StateEnum.INITIATED,
            created_at: Date(),
            updated_at: Date(),
            customer_id: customer_id,
            service_provider_id: service_provider_id,
          })
        ).populate("customer_id", "-password")
      ).populate("service_provider_id", "-password")

      if (conversation) {
        res.status(201).json({
          _id: conversation._id,
          customer_name: conversation.customer_name,
          service_provider_name: conversation.service_provider_name,
          state: conversation.state,
          created_at: conversation.created_at,
          updated_at: conversation.updated_at,
          customer_id: conversation.customer_id,
          service_provider_id: conversation.service_provider_id,
        })
      } else {
        res.status(400).json({ error: "Invalid conversation data" })
      }
    } catch (error) {
      console.log(error)
      res.status(400).send()
    }
  }
)

interface User {
  id: string
}

export const getAllConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const conversations = await Conversation.find({
      $or: [
        { customer_id: (req.user as User).id },
        { service_provider_id: (req.user as User).id },
      ],
    })
      .populate("customer_id", "-password")
      .populate("service_provider_id", "-password")
      .populate("latest_message")
      .sort({ updated_at: -1 })

    if (conversations) {
      res.json(conversations)
    } else {
      res.status(404)
      throw new Error("No conversations found")
    }
  }
)
