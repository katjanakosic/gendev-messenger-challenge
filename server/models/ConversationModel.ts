import * as mongoose from "mongoose";

const conversationModel = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  customer_name: { type: String, ref: "User" },
  service_provider_name: { type: String, ref: "User" },
  state: { type: String },
  created_at: { type: mongoose.Schema.Types.Date },
  updated_at: { type: mongoose.Schema.Types.Date },
  deleted_at: { type: mongoose.Schema.Types.Date },
});

const Conversation = mongoose.model("Conversation", conversationModel);

module.exports = Conversation;
