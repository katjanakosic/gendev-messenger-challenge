import React from "react"
import { MessageDto } from "../../types/MessageDto"
import ScrollableFeed from "react-scrollable-feed"
import { Box } from "@chakra-ui/react"
import { ConversationState } from "../../context/ConversationContextProvider"

export const ScrollableConversation = ({ messages }: { messages: MessageDto[] }) => {
  const { user } = ConversationState()
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message) => {
          const isCurrentUser = message.sender_id._id === user?._id
          const backgroundColor = isCurrentUser ? "#9fc8e5" : "#aa84ab"
          const alignSelf = isCurrentUser ? "flex-end" : "flex-start"

          return (
            <Box
              display="flex"
              key={message._id}
              justifyContent={alignSelf}
              mb={2}
            >
              <Box
                style={{
                  backgroundColor,
                  borderRadius: "20px",
                  padding: "5px 15px",
                  maxWidth: "75%",
                }}
              >
                {message.text}
              </Box>
            </Box>
          )
        })}
    </ScrollableFeed>
  )
}
