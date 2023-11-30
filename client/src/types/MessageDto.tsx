import { ConversationDto } from "./ConversationDto"
import { UserDto } from "./UserDto"

export enum MessageTypeEnum {
  QUOTE_OFFER = "quote_offer",
  REJECT_QUOTE_MESSAGE = "reject_quote_offer",
  ACCEPT_QUOTE_MESSAGE = "accept_quote_offer",
  STANDARD_MESSAGE = "standard_message",
  COMPLETE_MESSAGE = "complete_message",
  RATE_MESSAGE = "rate_message",
}

export type MessageDto = {
  _id: string
  conversation_id: ConversationDto
  message_type: string
  text: string
  sender_type: string
  read_at?: Date
  created_at: Date
  updated_at: Date
  hidden_at?: Date
  sender_id: UserDto
}
