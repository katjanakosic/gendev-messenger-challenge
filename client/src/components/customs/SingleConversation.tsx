import React from "react"
import { Box, Text } from "@chakra-ui/react"
import { Image } from "@chakra-ui/image"
import chatting from "../../assets/Chat-amico.svg"
import { ConversationState } from "../../context/ConversationContextProvider"

export const SingleConversation = () => {
  const { user, selectedConversation, setSelectedConversation } =
    ConversationState()
  return (
    <>
      {selectedConversation ? (
        <></>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Image boxSize="300px" src={chatting} alt="Start chatting" />
          <Text fontSize="2xl">Select a conversation to start chatting</Text>
        </Box>
      )}
    </>
  )
}
