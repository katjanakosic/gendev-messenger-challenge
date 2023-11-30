import React from "react"
import { ConversationDto } from "../types/ConversationDto"
import { MessageDto } from "../types/MessageDto"
import { UserDto } from "../types/UserDto"

type ConversationContextType = {
  selectedConversation: ConversationDto | undefined
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationDto | undefined>
  >
  notifications: MessageDto[] 
  setNotifications: React.Dispatch<React.SetStateAction<MessageDto[]>>
  conversations: ConversationDto[]
  setConversations: React.Dispatch<React.SetStateAction<ConversationDto[]>>
  fetchAgain: boolean
  setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>
  user: UserDto | undefined
  setUser: React.Dispatch<React.SetStateAction<UserDto | undefined>>
}

export const ConversationContext = React.createContext<ConversationContextType>(
  {
    selectedConversation: undefined,
    setSelectedConversation: () => {},
    notifications: [],
    setNotifications: () => {},
    conversations: [],
    setConversations: () => {},
    fetchAgain: false,
    setFetchAgain: () => {},
    user: undefined,
    setUser: () => {}
  }
)
