import React from "react"
import { ConversationContext } from "./ConversationContext"
import { useNavigate } from "react-router-dom"
import { UserDto } from "../types/UserDto"
import { ConversationDto } from "../types/ConversationDto"
import { MessageDto } from "../types/MessageDto"

export function ConversationContextProvider(props: {
  children: React.ReactNode
}) {
  const { children } = props

  const navigate = useNavigate()

  const [user, setUser] = React.useState<UserDto | undefined>()

  const [selectedConversation, setSelectedConversation] = React.useState<
    ConversationDto | undefined
  >()
  const [notifications, setNotifications] = React.useState<MessageDto[]>([])
  const [conversations, setConversations] = React.useState<ConversationDto[]>(
    []
  )
  const [fetchAgain, setFetchAgain] = React.useState(false)

  React.useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo")

    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString)
      setUser(userInfo)
    } else {
      navigate("/")
    }
  }, [navigate])

  const value = React.useMemo(() => {
    return {
      selectedConversation,
      setSelectedConversation,
      notifications,
      setNotifications,
      conversations,
      setConversations,
      fetchAgain,
      setFetchAgain,
      user,
      setUser,
    }
  }, [
    selectedConversation,
    notifications,
    setNotifications,
    conversations,
    fetchAgain,
    user,
  ])

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}

export const ConversationState = () => {
  return React.useContext(ConversationContext)
}
