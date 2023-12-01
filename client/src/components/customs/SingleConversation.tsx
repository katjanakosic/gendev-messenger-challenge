import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { FaFile } from "react-icons/fa"
import { HiMiniPhoto } from "react-icons/hi2"
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Avatar,
  Input,
  Spinner,
  Text,
  useToast,
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react"
import { Image } from "@chakra-ui/image"
import chatting from "../../assets/Chat-amico.svg"
import {
  ArrowBackIcon,
  AttachmentIcon,
  ChevronRightIcon,
  EmailIcon,
  LinkIcon,
} from "@chakra-ui/icons"
import { UserTypeEnum } from "../../types/UserDto"
import { ScrollableConversation } from "./ScrollableConversation"
import axios from "axios"
import { MessageDto, MessageTypeEnum } from "../../types/MessageDto"
import "./styles.css"
import io, { Socket } from "socket.io-client"
import { ConversationDto, StateEnum } from "../../types/ConversationDto"
import { StarRating } from "./StarRating"
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
  const [rating, setRating] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(false)

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

  const fetchMessages = async (page: number) => {
    if (!selectedConversation) return

    console.log(pageNumber)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      setLoading(true)

      const { data } = await axios.get(
        `api/message/${selectedConversation._id}?page=${page}`,
        config
      )

      setMessages((prevMessages) => {
        const messages = [...data.reverse(), ...prevMessages]
        return Array.from(new Set(messages.map((message) => message._id)))
          .map((_id) => messages.find((message) => message._id === _id))
          .filter((message) => message !== undefined) as MessageDto[]
      })
      console.log(data)
      setHasMore(data.length > 0)
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

  const loadMore = () => {
    if (loading || !hasMore) return
    setPageNumber((prevPage) => {
      fetchMessages(prevPage + 1)
      return prevPage + 1
    })
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
        setFetchAgain(!fetchAgain)
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
    setHasMore(true)
    setMessages([])
    fetchMessages(1)
    // setPageNumber((prevPageNumber) => prevPageNumber + 1)
    selectedConversationCompare = selectedConversation
  }, [selectedConversation])

  // useEffect(() => {
  //   fetchMessages()
  // }, [pageNumber])

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

  const handleComplete = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/message/complete",
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

  const handleRating = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.post(
        "/api/message/rate",
        {
          conversation_id: selectedConversation?._id,
          rating: rating,
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

  const uploadFile = () => {
    // setPicLoading(true)
    // if (!pics || pics.length === 0) {
    //   toast({
    //     title: "Please select an image",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   })
    //   setPicLoading(false)
    //   return
    // }
    // const selectedFile = pics[0]
    // if (
    //   selectedFile.type === "image/jpeg" ||
    //   selectedFile.type === "image/png"
    // ) {
    //   const data = new FormData()
    //   data.append("file", selectedFile)
    //   data.append("upload_preset", "chat-app")
    //   data.append("cloud_name", "dpq6lqjdw")
    //   fetch("https://api.cloudinary.com/v1_1/dpq6lqjdw/image/upload", {
    //     method: "post",
    //     body: data,
    //   })
    //     .then((res) => res.json())
    //     .then((data) => {
    //       setPfp(data.url.toString())
    //       console.log(data.url.toString())
    //       setPicLoading(false)
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       setPicLoading(false)
    //     })
    // } else {
    //   toast({
    //     title: "Please select an image",
    //     status: "warning",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "bottom",
    //   })
    //   setPicLoading(false)
    //   return
    // }
  }

  const uploadPicture = () => {}

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
            <Box display="flex" alignItems="center">
              <Avatar
                borderRadius="full"
                boxSize="40px"
                src={
                  user?.user_type === UserTypeEnum.CUSTOMER
                    ? selectedConversation.service_provider_id.pfp
                    : selectedConversation.customer_id.pfp
                }
                name={
                  user?.user_type === UserTypeEnum.CUSTOMER
                    ? selectedConversation.service_provider_id.name
                    : selectedConversation.customer_id.name
                }
              />
              <Text ml={3}>
                {user?.user_type === UserTypeEnum.CUSTOMER
                  ? selectedConversation.service_provider_name
                  : selectedConversation.customer_name}
              </Text>
            </Box>
            <Box display="flex">
              {user?.user_type === UserTypeEnum.CUSTOMER && (
                <>
                  {selectedConversation.state === StateEnum.ACCEPTED && (
                    <Button mr={2} onClick={handleComplete}>
                      Complete
                    </Button>
                  )}
                  <Menu>
                    {selectedConversation.state === StateEnum.COMPLETED && (
                      <MenuButton as={Button} mr={2}>
                        Rate
                      </MenuButton>
                    )}
                    <MenuList>
                      <Box display="flex" justifyContent="space-evenly">
                        <StarRating
                          rating={rating}
                          setRating={setRating}
                          count={5}
                          size={20}
                        />
                        <IconButton
                          aria-label="Rate user"
                          icon={<ChevronRightIcon />}
                          onClick={handleRating}
                        />
                      </Box>
                    </MenuList>
                  </Menu>

                  <IconButton
                    mr={2}
                    aria-label="Visit Website"
                    icon={<LinkIcon />}
                    isDisabled={
                      selectedConversation.state !== StateEnum.ACCEPTED
                    }
                    onClick={() => {
                      const websiteUrl =
                        selectedConversation.service_provider_id.url

                      if (websiteUrl) {
                        const fullUrl = websiteUrl.startsWith("www")
                          ? `https://${websiteUrl}`
                          : websiteUrl.startsWith("http://") ||
                            websiteUrl.startsWith("https://")
                          ? websiteUrl
                          : `http://${websiteUrl}`

                        window.open(fullUrl)
                      } else {
                        console.error("Website URL is not available")
                      }
                    }}
                  />
                </>
              )}
              <IconButton
                aria-label="Send Email"
                icon={<EmailIcon />}
                isDisabled={selectedConversation.state !== StateEnum.ACCEPTED}
                onClick={() => {
                  window.open(
                    `mailto: ${
                      user?.user_type === UserTypeEnum.CUSTOMER
                        ? selectedConversation.service_provider_id.email
                        : selectedConversation.customer_id.email
                    }`
                  )
                }}
              />
            </Box>
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
                <ScrollableConversation
                  messages={messages}
                  isTyping={isTyping}
                  loadMore={loadMore}
                />
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
              <Box display="flex">
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                  disabled={
                    selectedConversation.state === StateEnum.REJECTED ||
                    selectedConversation.state === StateEnum.COMPLETED ||
                    selectedConversation.state === StateEnum.RATED
                  }
                />
                <Menu>
                  <MenuButton
                    as={IconButton}
                    ml={2}
                    aria-label="Attach files"
                    icon={<AttachmentIcon />}
                    onClick={() => {}}
                    isDisabled={
                      selectedConversation.state !== StateEnum.ACCEPTED
                    }
                  />
                  <MenuList width="auto">
                    <MenuItem
                      onClick={() => {
                        uploadPicture()
                      }}
                    >
                      Upload Picture
                    </MenuItem>
                    <MenuDivider />
                    <MenuItem
                      onClick={() => {
                        uploadFile()
                      }}
                    >
                      Upload File
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
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
