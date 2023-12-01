import express, { Request, Response } from "express"
import * as dotenv from "dotenv"
import connectDB from "./config/db"
import userRoutes from "./routes/userRoutes"
import conversationRoutes from "./routes/conversationRoutes"
import messageRoutes from "./routes/messageRoutes"
import { errorHandler, notFound } from "./middleware/errorHandler"
import { Socket } from "socket.io"

dotenv.config()
connectDB()

const app = express()

app.use(express.json()) 

app.get("/", (req: Request, res: Response) => {
  res.send("API is running")
})

app.use("/api/user", userRoutes)
app.use("/api/conversation", conversationRoutes)
app.use("/api/message", messageRoutes)

app.use(notFound)
app.use(errorHandler)

app.delete("/api/user/:id", (req: Request, res: Response) => {
  res.send("Deleted")
})

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
  },
})

io.on("connection", (socket: Socket) => {
  socket.on("setup", (user_data) => {
    socket.join(user_data._id)
    socket.emit("connected")
  })

  socket.on("join conversation", (room) => {
    socket.join(room)
    console.log("User joined room " + room)
  })

  socket.on("typing", ({room, user_id}) => {
    if (user_id !== socket.id) {
      io.in(room).emit("typing", { room, user_id })
    }
  })

  socket.on("stop typing", ({room, user_id}) => {
    if (user_id !== socket.id) {
      io.in(room).emit("stop typing", { room, user_id })
    }
  })

  socket.on("new message", (newMessageReceived) => {
    const conversation = newMessageReceived.conversation_id

    if (!conversation.service_provider_id || !conversation.customer_id)
      return console.log("Users not defined")

    if (newMessageReceived.sender_id._id === conversation.service_provider_id._id) {
      socket
        .in(conversation.customer_id._id)
        .emit("message received", newMessageReceived)
    } else {
      socket
        .in(conversation.service_provider_id._id)
        .emit("message received", newMessageReceived)
    }
  })

  socket.off("setup", (user_data) => {
    socket.leave(user_data._id)
  })
})
