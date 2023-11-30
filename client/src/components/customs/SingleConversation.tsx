import React, { ChangeEvent, useEffect, useState } from "react"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  effect,
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
import io, { Socket } from "socket.io-client"
import { ConversationDto, StateEnum } from "../../types/ConversationDto"
import { ConversationState } from "../../context/ConversationContextProvider"

const ENDPOINT = "http://localhost:3001"
let socket: Socket
let selectedConversationCompare: ConversationDto | undefined

export const SingleConversation = () => {
  const [messages, setMessages] = useState<MessageDto[]>([])
  const [loading, setLoading] = useState(false)
  const [newMessage, setNewMessage] = useState("")
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const toast = useToast()

  const {
    user,
    selectedConversation,
    setSelectedConversation,
    notifications,
    setNotifications,
    fetchAgain,
    setFetchAgain,
  } = ConversationState()

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

      setMessages(data)
      setLoading(false)
      socket.emit("join conversation", selectedConversation._id)
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

  const sendMessage = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", {
        room: selectedConversation?._id,
        user_id: user?._id,
      })
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
        socket.emit("new message", data)
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
    if (!socketConnected) return
    if (!typing) {
      setTyping(true)
      socket.emit("typing", {
        room: selectedConversation?._id,
        user_id: user?._id,
      })
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 3000
    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          room: selectedConversation?._id,
          user_id: user?._id,
        })
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    fetchMessages()
    selectedConversationCompare = selectedConversation
  }, [selectedConversation])

  useEffect(() => {
    socket = io(ENDPOINT)
    socket.emit("setup", user)
    socket.on("connected", () => setSocketConnected(true))
    socket.on("typing", ({ room, user_id }) => {
      if (user_id !== user?._id && selectedConversationCompare?._id === room) {
        setIsTyping(true)
      }
    })
    socket.on("stop typing", ({ room, user_id }) => {
      if (user_id !== user?._id && selectedConversationCompare?._id === room) {
        setIsTyping(false)
      }
    })
  }, [selectedConversationCompare, user])

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedConversationCompare ||
        selectedConversationCompare._id !==
          newMessageReceived.conversation_id._id
      ) {
        if (!notifications.includes(newMessageReceived)) {
          setNotifications([newMessageReceived, ...notifications])
          setFetchAgain(!fetchAgain)
        }
      } else {
        setMessages([...messages, newMessageReceived])
        setSelectedConversation(newMessageReceived.conversation_id)
      }
    })
  })

  const handleAccept = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/message/accept",
        {
          conversation_id: selectedConversation?._id,
        },
        config
      )

      setMessages([...messages, data])
      socket.emit("new message", data)
      setSelectedConversation(data.conversation_id)
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

  const handleReject = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/message/reject",
        {
          conversation_id: selectedConversation?._id,
        },
        config
      )

      setMessages([...messages, data])
      socket.emit("new message", data)
      setSelectedConversation(data.conversation_id)
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

  return (
    <>
      {selectedConversation ? (
        <>
          <Box
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
          </Box>
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
                <ScrollableConversation messages={messages} isTyping={isTyping} />
              </Box>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt="3">
              {user?.user_type === UserTypeEnum.CUSTOMER &&
                selectedConversation.state === StateEnum.QUOTED && (
                  <Box
                    width="100%"
                    display="flex"
                    justifyContent="space-evenly"
                    pb={2}
                  >
                    <Button
                      background="green"
                      color="white"
                      _hover={{ opacity: "50%" }}
                      onClick={handleAccept}
                    >
                      Accept offer
                    </Button>
                    <Button
                      background="red"
                      color="white"
                      _hover={{ opacity: "50%" }}
                      onClick={handleReject}
                    >
                      Reject offer
                    </Button>
                  </Box>
                )}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                disabled={
                  selectedConversation.state === StateEnum.REJECTED ||
                  selectedConversation.state === StateEnum.COMPLETED
                }
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
