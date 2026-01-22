import express from "express";
import { auth } from "../middleware/auth";
const apiRouter = express.Router();
import userController from "../controllers/user";

apiRouter.get("/health", (req, res) => res.json({ response: "ok" }));

apiRouter.get("/api/auth/user", auth, userController.checkUser);

export default apiRouter;
