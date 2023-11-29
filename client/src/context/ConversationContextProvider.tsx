import React from "react"
import { ConversationContext } from "./ConversationContext"
import { useNavigate } from "react-router-dom"
import { UserDto } from "../types/UserDto"
import { ConversationDto } from "../types/ConversationDto"

export function ConversationContextProvider(props: {
  children: React.ReactNode
}) {
  const { children } = props

  const navigate = useNavigate()

  const [user, setUser] = React.useState<UserDto | undefined>()

  const [selectedConversation, setSelectedConversation] = React.useState<
    ConversationDto | undefined
  >()
  //   const [notification, setNotification] = React.useState([])
  const [conversations, setConversations] = React.useState<ConversationDto[]>(
    []
  )
  const [fetchConversations, setFetchConversations] = React.useState(false)

  React.useEffect(() => {
    const userInfoString = localStorage.getItem("userInfo")

    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString)
      setUser(userInfo)
    } else {
      // Handle the case where userInfoString is null (not authenticated)
      navigate("/")
    }
  }, [navigate])

  const value = React.useMemo(() => {
    return {
      selectedConversation,
      setSelectedConversation,
      //   notification,
      //   setNotification,
      conversations,
      setConversations,
      fetchConversations,
      setFetchConversations,
    }
  }, [
    selectedConversation,
    // notification,
    // setNotification,
    conversations,
    fetchConversations,
  ])

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}
