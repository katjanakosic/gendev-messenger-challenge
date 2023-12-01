import * as mongoose from "mongoose"
import { UserTypeEnum } from "./UserModel"

export enum MessageTypeEnum {
  QUOTE_OFFER = "quote_offer",
  REJECT_QUOTE_MESSAGE = "reject_quote_offer",
  ACCEPT_QUOTE_MESSAGE = "accept_quote_offer",
  STANDARD_MESSAGE = "standard_message",
  COMPLETE_MESSAGE = "complete_message",
  RATE_MESSAGE = "rate_message",
  PICTURE = "picture",
  DOCUMENT = "document"
}

export interface MessageDocument extends mongoose.Document {
  conversation_id: mongoose.ObjectId
  message_type: string
  text: string
  sender_type: string
  read_at?: Date
  created_at: Date
  updated_at: Date
  hidden_at?: Date
  sender_id: mongoose.ObjectId
}

const messageModel = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Conversation",
  },
  message_type: {
    type: mongoose.Schema.Types.String,
    enum: Object.values(MessageTypeEnum),
    required: true,
  },
  text: { type: mongoose.Schema.Types.String, required: true },
  sender_type: {
    type: mongoose.Schema.Types.String,
    enum: Object.values(UserTypeEnum),
    required: true,
  },
  read_at: { type: mongoose.Schema.Types.Date, required: false },
  created_at: { type: mongoose.Schema.Types.Date, required: true },
  updated_at: { type: mongoose.Schema.Types.Date, required: true },
  hidden_at: { type: mongoose.Schema.Types.Date, required: false },
  sender_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
})

export const Message = mongoose.model("Message", messageModel)
