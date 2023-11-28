import express from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";

const app = express();
dotenv.config();
connectDB();

app.get("/", (req: any, res: any) => {
  res.send("API is running");
});

//app.use('/api/user', userRoutes)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
