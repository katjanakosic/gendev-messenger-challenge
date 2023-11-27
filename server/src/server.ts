import express from "express";
import * as dotenv from "dotenv";

const app = express();
dotenv.config();

app.get("/", (req: any, res: any) => {
  res.send("API is running");
});


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});
