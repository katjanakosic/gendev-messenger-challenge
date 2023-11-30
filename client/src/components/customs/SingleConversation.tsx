import React, { ChangeEvent, useEffect, useState } from "react"
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { Image } from "@chakra-ui/image"
import chatting from "../../assets/Chat-amico.svg"
import { ArrowBackIcon } from "@chakra-ui/icons"
import { UserTypeEnum } from "../../types/UserDto"
import { ProfileModal } from "./ProfileModal"
import { ScrollableConversation } from "./ScrollableConversation"
import axios from "axios"
import { MessageDto, MessageTypeEnum } from "../../types/MessageDto"
import "./styles.css"
import { ConversationState } from "../../context/ConversationContextProvider"

export const SingleConversation = () => {
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const toast = useToast()

  const { user, selectedConversation, setSelectedConversation } =
    ConversationState()

  const fetchMessages = async () => {
    if (!selectedConversation) return
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      setLoading(true)

      const { data } = await axios.get(
        `api/message/${selectedConversation._id}`,
        config
      )
      console.log(messages)

      setMessages(data)
      setLoading(false)
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to fetch the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      })
    }
  }

  //The useEffect hook allows you to perform side effects in your components
  //wird ausgeführt, wenn sich die selectedConversation ändert
  useEffect(() => {
    fetchMessages()
  }, [selectedConversation])

  const sendMessage = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
        }

        const { data } = await axios.post(
          "/api/message",
          {
            text: newMessage,
            conversation_id: selectedConversation?._id,
            message_type: MessageTypeEnum.STANDARD_MESSAGE,
          },
          config
        )

        setNewMessage("")
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        })
      }
    }
  }

  const typingHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMessage(event.target.value)
  }

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
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <Box className="messages">
                <ScrollableConversation messages={messages} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt="3">
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
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
