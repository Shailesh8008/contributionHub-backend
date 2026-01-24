import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user";
import issuesModel from "../models/issues";
import bookmarkModel from "../models/bookmarks";
import jwt from "jsonwebtoken";
import axios from "axios";

const checkUser = (req: Request, res: Response) => {
  res.json({ ok: true, user: req.user as JwtPayload });
};

const githubCallback = async (req: Request, res: Response) => {
  const { profile, accessToken } = req.user as JwtPayload;
  const githubProfile = profile._json;
  let email = githubProfile.emails?.[0]?.value || githubProfile?.email;
  if (!email) {
    const { data } = await axios.get("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const primaryEmail = data.find((e: any) => e.primary && e.verified);

    email = primaryEmail?.email;
  }

  // Store or update user in database
  const userData = {
    id: githubProfile.id,
    username: githubProfile.login,
    email,
    name: githubProfile.name,
    location: githubProfile.location,
    avatar_url: githubProfile.avatar_url,
  };

  await userModel.findOneAndUpdate({ id: githubProfile.id }, userData, {
    upsert: true,
    new: true,
  });

  const token = jwt.sign(
    { ...githubProfile, email },
    process.env.JWT_SECRET_KEY!,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.ENV === "prod",
    sameSite: process.env.ENV === "prod" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("http://localhost:5173/");
};

const logout = (req: Request, res: Response) => {
  res.clearCookie("token");
  res.json({ ok: true, message: "Logged out successfully" });
};

const getIssues = async (req: Request, res: Response) => {
  try {
    const issues = await issuesModel.find();
    res.json({ ok: true, issues });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch issues" });
  }
};

const createBookmarks = async (req: Request, res: Response) => {
  try {
    const { issueId } = req.body;
    const userId = (req.user as JwtPayload).id;

    if (!issueId) {
      res.status(400).json({ ok: false, error: "issueId is required" });
      return;
    }

    const issue = await issuesModel.findOne({ id: issueId });

    if (!issue) {
      res.status(404).json({ ok: false, error: "Issue not found" });
      return;
    }

    const bookmark = await bookmarkModel.findOneAndUpdate(
      { userId },
      { $addToSet: { issues: issue } },
      { upsert: true, new: true },
    );

    res.json({ ok: true, bookmark });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to create bookmark" });
  }
};

const deleteBookmarks = async (req: Request, res: Response) => {
  try {
    const { id: issueId } = req.params;
    const userId = (req.user as JwtPayload).id;

    const bookmark = await bookmarkModel.findOneAndUpdate(
      { userId },
      { $pull: { issues: { id: Number(issueId) } } },
      { new: true },
    );

    if (!bookmark) {
      res.status(404).json({ ok: false, error: "Bookmark not found" });
      return;
    }

    res.json({ ok: true, bookmark });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to delete bookmark" });
  }
};

const getBookmarks = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as JwtPayload).id;

    const bookmark = await bookmarkModel.findOne({ userId });

    if (!bookmark) {
      res.json({ ok: true, issues: [] });
      return;
    }

    res.json({ ok: true, issues: bookmark.issues });
  } catch (error) {
    res.status(500).json({ ok: false, error: "Failed to fetch bookmarks" });
  }
};

const userController = {
  checkUser,
  githubCallback,
  logout,
  getIssues,
  createBookmarks,
  deleteBookmarks,
  getBookmarks,
};
export default userController;
