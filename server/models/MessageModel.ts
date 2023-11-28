import * as mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  id: { type: mongoose.Types.ObjectId },
  conversation_id: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
  message_type: { type: String },
  text: { type: String },
  sender_type: { type: String },
  read_at: { type: mongoose.Schema.Types.Date },
  created_at: { type: mongoose.Schema.Types.Date },
  updated_at: { type: mongoose.Schema.Types.Date },
  hidden_at: { type: mongoose.Schema.Types.Date }
});

const Message = mongoose.model("Message", messageModel);

module.exports = Message;
