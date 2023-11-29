import { Box, effect } from "@chakra-ui/react"
import axios from "axios"
import React, { useEffect } from "react"
import { SideDrawer } from "../components/customs/SideDrawer"
import { ConversationList } from "../components/customs/ConversationList"
import { ConversationBox } from "../components/customs/ConversationBox"
import { ConversationState } from "../context/ConversationContextProvider"

const ConversationView = () => {
  const { user } = ConversationState()

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display="flex"
        justifyContent="space-between"
        width="100%"
        height="91.5vh"
        p="10px"
      >
        {user && <ConversationList />}
        {user && <ConversationBox />}
      </Box>
    </div>
  )
}

export default ConversationView
