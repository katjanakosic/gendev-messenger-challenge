import { useState } from "react"
import "./App.css"
import Homepage from "./views/HomepageView"
import ConversationView from "./views/ConversationView"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <div style={{background: "linear-gradient(#dab3e8, #bf77d9)", width: "100%", height: "114vh"}}>
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/conversations" element={<ConversationView />} />
    </Routes>
    </div>
  )
}

export default App
