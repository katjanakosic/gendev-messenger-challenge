import express, {Request, Response} from "express";
import * as dotenv from "dotenv";
import connectDB from "./config/db";
import userRoutes from "./routes/UserRoutes";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); //to accept json data

app.get("/", (req: Request, res: Response) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
