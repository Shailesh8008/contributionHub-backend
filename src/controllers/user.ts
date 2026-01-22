import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

const checkUser = (req: Request, res: Response) =>
  res.json({ ok: true, userId: (req.user as JwtPayload).id });

const userController = {
  checkUser,
};
export default userController;
