import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react"
import { Tooltip } from "@chakra-ui/tooltip"
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu"
import { Search2Icon, BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import React, { useState } from "react"
import { ProfileModal } from "./ProfileModal"
import { useNavigate } from "react-router-dom"
import { useToast } from "@chakra-ui/react"
import axios from "axios"
import { UserDto } from "../../types/UserDto"
import ConversationLoading from "../ConversationLoading"
import { ConversationState } from "../../context/ConversationContextProvider"
import UserListItem from "../userAvatar/UserListItem"

export const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingConversation, setLoadingConversation] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const navigate = useNavigate()
  const toast = useToast()

  const { setSelectedConversation, conversations, setConversations, user } =
    ConversationState()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo")
    navigate("/")
  }

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Search field is empty",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
      return
    }

    try {
      setLoading(true)

      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      }

      const { data } = await axios.get(`/api/user?search=${search}`, config)

      setLoading(false)
      setSearchResults(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const accessConversation = async (userId: string) => {
    console.log(userId)

    try {
      setLoadingConversation(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
      const { data } = await axios.post(`/api/conversation`, { userId }, config)

      if (!conversations.find((c) => c._id === data._id))
        setConversations([data, ...conversations])
      setSelectedConversation(data)
      setLoadingConversation(false)
      onClose()
    } catch (error: any) {
      toast({
        title: "Error fetching the conversation",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  return (
    <div>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip
          label="Search users to conversation"
          hasArrow
          placement="bottom"
        >
          <Button variant="ghost" onClick={onOpen}>
            <Search2Icon />
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search user
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          CHAT24
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              {/* <NotificationBadge
                  count={notification.length}
                  effect={Effect.SCALE}
                /> */}
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            {}
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.pfp}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ConversationLoading />
            ) : (
              searchResults?.map((user: UserDto) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessConversation(user._id)}
                />
              ))
            )}
            {loadingConversation && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
