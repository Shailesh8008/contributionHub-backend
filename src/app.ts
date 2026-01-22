import express from "express";
import cors from "cors";
import apiRouter from "./routers/api";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use("/", apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
