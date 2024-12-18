import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import "./index.css"
import { BrowserRouter } from "react-router-dom"
import { ChakraProvider } from "@chakra-ui/react"
import { ConversationContextProvider } from "./context/ConversationContextProvider.tsx"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ChakraProvider>
      <ConversationContextProvider>
        <App />
      </ConversationContextProvider>
    </ChakraProvider>
  </BrowserRouter>
)
