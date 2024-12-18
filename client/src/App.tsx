import { useState } from "react"
import "./App.css"
import Homepage from "./views/HomepageView"
import { Route, Routes } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import ConversationView from "./views/ConversationView"

function App() {
  return (
    <Box
      style={{
        background: "linear-gradient(#dab3e8, #bf77d9)",
        width: "100%",
        minHeight: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/conversations" element={<ConversationView />} />
      </Routes>
    </Box>
  )
}

export default App
