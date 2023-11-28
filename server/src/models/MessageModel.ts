import * as mongoose from "mongoose";

export enum MessageTypeEnum {
  QUOTE_OFFER,
  REJECT_QUOTE_MESSAGE,
  ACCEPT_QUOTE_MESSAGE,
  STANDARD_MESSAGE,
}

const messageModel = new mongoose.Schema({
  conversation_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Conversation",
  },
  message_type: { type: mongoose.Schema.Types.String, required: true },
  text: { type: mongoose.Schema.Types.String },
  sender_type: {
    type: mongoose.Schema.Types.String,
    enum: Object.values(MessageTypeEnum),
    required: true,
  },
  read_at: { type: mongoose.Schema.Types.Date, required: true },
  created_at: { type: mongoose.Schema.Types.Date, required: true },
  updated_at: { type: mongoose.Schema.Types.Date, required: true },
  hidden_at: { type: mongoose.Schema.Types.Date, required: false },
});

const Message = mongoose.model("Message", messageModel);

export default Message;
