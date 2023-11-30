import * as mongoose from "mongoose"

export enum StateEnum {
  INITIATED = "initiated",
  QUOTED = "quoted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  COMPLETED = "completed",
}

export interface ConversationDocument extends mongoose.Document {
  customer_name: string
  service_provider_name: string
  state: string
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  customer_id: mongoose.ObjectId
  service_provider_id: mongoose.ObjectId
  latest_message?: mongoose.ObjectId
}

const conversationModel = new mongoose.Schema({
  customer_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  service_provider_name: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
  state: {
    type: mongoose.Schema.Types.String,
    enum: Object.values(StateEnum),
    required: true,
  },
  created_at: { type: mongoose.Schema.Types.Date, required: true },
  updated_at: { type: mongoose.Schema.Types.Date, required: true },
  deleted_at: { type: mongoose.Schema.Types.Date, required: false },
  customer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  service_provider_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latest_message: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message",
    required: false,
  },
})

export const Conversation = mongoose.model("Conversation", conversationModel)
