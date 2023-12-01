import React from "react"
import { MessageDto, MessageTypeEnum } from "../../types/MessageDto"
import ScrollableFeed from "react-scrollable-feed"
import { Box, Button, Image } from "@chakra-ui/react"
import { ConversationState } from "../../context/ConversationContextProvider"

export const ScrollableConversation = ({
  messages,
  isTyping,
  loadMore,
}: {
  messages: MessageDto[]
  isTyping: boolean
  loadMore: () => void
}) => {
  const { user } = ConversationState()
  return (
    <ScrollableFeed>
      <Box width="100%" display="flex" justifyContent="center">
        <Button onClick={loadMore}>Load more...</Button>
      </Box>
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
                {message.message_type === MessageTypeEnum.PICTURE ? (
                  <Image src={message.text} alt={message.text} />
                ) : (
                  message.text
                )}
              </Box>
            </Box>
          )
        })}
      {isTyping && (
        <Box
          style={{
            backgroundColor: "#e0e0e0",
            borderRadius: "20px",
            padding: "5px 15px",
            width: "100px",
          }}
        >
          Typing...
        </Box>
      )}
    </ScrollableFeed>
  )
}
