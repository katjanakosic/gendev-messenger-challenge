import React from "react"
import { Box, useToast, Text, Stack } from "@chakra-ui/react"
import axios from "axios"
import ConversationLoading from "../ConversationLoading"
import { UserTypeEnum } from "../../types/UserDto"
import { ConversationState } from "../../context/ConversationContextProvider"

export const ConversationList = () => {
  const [loggedUser, setLoggedUser] = React.useState("")
  const {
    selectedConversation,
    setSelectedConversation,
    user,
    conversations,
    setConversations,
  } = ConversationState()
  const toast = useToast()

  const fetchConversations = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.get("/api/conversation", config)
      setConversations(data)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Conversations",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  React.useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo") || "{}"))
    fetchConversations()
  }, [])

  return (
    <Box
      display={{ base: selectedConversation ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Text fontSize="2xl">My Conversations</Text>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {conversations ? (
          <Stack overflowY="scroll">
            {conversations.map((conversation) => (
              <Box
                onClick={() => setSelectedConversation(conversation)}
                cursor="pointer"
                bg={
                  selectedConversation === conversation ? "#38B2AC" : "#E8E8E8"
                }
                color={
                  selectedConversation === conversation ? "white" : "black"
                }
                px={3}
                py={2}
                borderRadius="lg"
                key={conversation._id}
              >
                <Text>
                  {user?.user_type === UserTypeEnum.CUSTOMER
                    ? conversation.service_provider_name
                    : conversation.customer_name}
                </Text>
                {}
              </Box>
            ))}
          </Stack>
        ) : (
          <ConversationLoading />
        )}
      </Box>
    </Box>
  )
}
