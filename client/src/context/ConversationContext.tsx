import React from "react"
import { UserDto } from "../types/UserDto"
import { ConversationDto } from "../types/ConversationDto"

type ConversationContextType = {
  selectedConversation: ConversationDto | undefined
  setSelectedConversation: React.Dispatch<
    React.SetStateAction<ConversationDto | undefined>
  >
  // notification:
  // setNotification:
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
    // notification:
    // setNotification:
    conversations: [],
    setConversations: () => {},
    fetchAgain: false,
    setFetchAgain: () => {},
    user: undefined,
    setUser: () => {}
  }
)
