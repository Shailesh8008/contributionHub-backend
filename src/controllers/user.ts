import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user";
import jwt from "jsonwebtoken";

const checkUser = (req: Request, res: Response) => {
  res.json({ ok: true, user: req.user as JwtPayload });
};

const githubCallback = async (req: Request, res: Response) => {
  const githubProfile = (req.user as JwtPayload)._json;

  const token = jwt.sign(githubProfile, process.env.JWT_SECRET_KEY!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.ENV === "prod",
    sameSite: process.env.ENV === "prod" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.redirect("http://localhost:5173/");
};

const userController = {
  checkUser,
  githubCallback,
};
export default userController;
