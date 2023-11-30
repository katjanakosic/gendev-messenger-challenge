import express, { Request, Response } from "express"
import * as dotenv from "dotenv"
import connectDB from "./config/db"
import userRoutes from "./routes/userRoutes"
import { errorHandler, notFound } from "./middleware/errorHandler"
import conversationRoutes from "./routes/conversationRoutes"
import messageRoutes from "./routes/messageRoutes"

dotenv.config()
connectDB()

const app = express()

app.use(express.json()) //to accept json data

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
