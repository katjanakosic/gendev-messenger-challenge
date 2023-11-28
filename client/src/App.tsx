import "./App.css"
import ConversationView from "./views/ConversationView"
import { Route, Routes } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import HomepageView from "./views/HomepageView"

function App() {
  return (
    <Box
      style={{
        background: "linear-gradient(#dab3e8, #bf77d9)",
        width: "100%",
        height: "100vh",
      }}
    >
      <Routes>
        <Route path="/" element={<HomepageView />} />
        <Route path="/conversations" element={<ConversationView />} />
      </Routes>
    </Box>
  )
}

export default App
