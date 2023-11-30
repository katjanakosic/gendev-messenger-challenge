import React from "react"
import { Box } from "@chakra-ui/react"
import { SingleConversation } from "./SingleConversation"
import { ConversationState } from "../../context/ConversationContextProvider"


export const ConversationBox = () => {
  const { selectedConversation } = ConversationState()

  return (
    <Box
      display={{ base: selectedConversation ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleConversation/>
    </Box>
  )
}
