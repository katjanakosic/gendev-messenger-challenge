import asyncHandler from "express-async-handler"
import { Request, Response } from "express"
import { Conversation, StateEnum } from "../models/ConversationModel"

export const createConversation = asyncHandler(async (req: Request, res: Response) => {
  const {
    customer_name,
    service_provider_name,
    customer_id,
    service_provider_id,
  } = req.body

  console.log(req.body)

  const conversation = await Conversation.create({
    customer_name,
    service_provider_name,
    state: StateEnum.QUOTED,
    created_at: Date(),
    updated_at: Date(),
    customer_id,
    service_provider_id,
  })

  console.log(conversation)

  if (conversation) {
    res.status(201).json({
      _id: conversation._id,
      customer_name: conversation.customer_name,
      service_provider_name: conversation.service_provider_name,
      state: conversation.state,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      deleted_at: conversation.deleted_at,
      customer_id: conversation.customer_id,
      service_provider_id: conversation.service_provider_id,
      latest_message: conversation.latest_message,
    })
  } else {
    res.status(400)
    throw new Error("Invalid conversation data")
  }
})

interface User {
  id: string
}

export const getAllConversations = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await Conversation.find({
    $or: [
      { customer_id: (req.user as User).id },
      { service_provider_id: (req.user as User).id },
    ],
  }).populate("customer_id", "-password").populate("service_provider_id", "-password").populate("latest_message")

  if (conversations) {
    res.json(conversations)
  } else {
    res.status(404)
    throw new Error("No conversations found")
  }
})
