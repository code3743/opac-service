import { Request, Response } from "express";
import * as AuthService from "../services/auth.service";
import { AppError } from "../errors/app_error";


export async function login(req: Request, res: Response) {
  const { studentCode, anonymous } = req.body;

  if (!anonymous && !studentCode) {
    throw new AppError("studentCode is required unless anonymous", 400, "validation");
  }

  const tokens = await AuthService.login({ studentCode, anonymous });
  res.status(200).json(tokens);
}


export async function refresh(req: Request, res: Response) {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new AppError("refreshToken is required", 400, "validation");

  const tokens = await AuthService.refresh(refreshToken);
  res.status(200).json(tokens);
}


export async function logout(req: Request, res: Response) {
  if (!req.user) throw new AppError("Not authenticated", 401, "auth");

  await AuthService.logout(req.user.sid);
  res.status(204).send();
}
