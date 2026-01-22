import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.json({ ok: false, message: "Access Denied: No token provided" });
  }

  try {
    const verify = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    req.user = verify;
  } catch (error) {
    return res.json({ ok: false, message: "Token is invalid or expired" });
  }

  next();
};
