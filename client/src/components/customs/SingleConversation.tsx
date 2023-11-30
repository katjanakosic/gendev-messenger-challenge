import React from "react"
import { Box, IconButton, Text } from "@chakra-ui/react"
import { Image } from "@chakra-ui/image"
import chatting from "../../assets/Chat-amico.svg"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { UserTypeEnum } from "../../types/UserDto"
import { ProfileModal } from "./ProfileModal"
import { ConversationState } from "../../context/ConversationContextProvider"

export const SingleConversation = () => {
  const { user, selectedConversation, setSelectedConversation } =
    ConversationState()
  return (
    <>
      {selectedConversation ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            width="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              aria-label="Return to conversations"
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedConversation(undefined)}
            />

            <Text>
              {user?.user_type === UserTypeEnum.CUSTOMER
                ? selectedConversation.service_provider_name
                : selectedConversation.customer_name}
            </Text>
            <ProfileModal
              user={
                user?.user_type === UserTypeEnum.CUSTOMER
                  ? selectedConversation.service_provider_id
                  : selectedConversation.customer_id
              }
            />
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* Messages */}
          </Box>
        </>
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
