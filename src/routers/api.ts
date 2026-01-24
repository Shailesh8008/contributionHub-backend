import express from "express";
import { auth } from "../middleware/auth";
const apiRouter = express.Router();
import userController from "../controllers/user";
import passport from "passport";

apiRouter.get("/health", (req, res) => res.json({ response: "ok" }));

apiRouter.get("/api/auth/user", auth, userController.checkUser);
apiRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] }),
);
apiRouter.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false }),
  userController.githubCallback,
);

apiRouter.delete("/api/logout", auth, userController.logout);
apiRouter.get("/api/issues", userController.getIssues);
apiRouter.get("/api/bookmarks", auth, userController.getBookmarks);
apiRouter.delete("/api/bookmarks/:id", auth, userController.deleteBookmarks);
apiRouter.post("/api/bookmarks/", auth, userController.createBookmarks);

export default apiRouter;
