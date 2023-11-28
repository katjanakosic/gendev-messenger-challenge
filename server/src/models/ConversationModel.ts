import * as mongoose from "mongoose";

export enum StateEnum {
  QUOTED = "quoted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
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
  customer_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  service_provider_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Conversation = mongoose.model("Conversation", conversationModel);

export default Conversation;
