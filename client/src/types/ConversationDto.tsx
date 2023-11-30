import { MessageDto } from "./MessageDto"
import { UserDto } from "./UserDto"

export enum StateEnum {
  QUOTED = "quoted",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
}

export type ConversationDto = {
  _id: string
  customer_name: string
  service_provider_name: string
  state: StateEnum
  created_at: Date
  updated_at: Date
  deleted_at?: Date
  customer_id: UserDto
  service_provider_id: UserDto
  latest_message?: MessageDto
}
