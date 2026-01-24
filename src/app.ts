import express from "express";
import cors from "cors";
import apiRouter from "./routers/api";
import connectDB from "./config/db";
import cookieParser from "cookie-parser";
import passport from "passport";
import dotenv from "dotenv";
// import { fetchGithubIssues } from "./jobs/githubIssuesFetch";
import { startGithubIssuesCron } from "./jobs/githubIssuesFetch";
dotenv.config();
import "./config/passport";

const app = express();
connectDB();
// fetchGithubIssues();
startGithubIssuesCron();

app.use(
  cors({ origin: "https://gitcontributionhub.vercel.app", credentials: true }),
);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/", apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
