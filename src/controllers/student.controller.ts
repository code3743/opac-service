import { Request, Response } from "express";
import * as StudentService from "../services/student.service";
import { AppError } from "../errors/app_error";

export async function getStudentProfile(req: Request, res: Response) {
  if (!req.user) {
    throw new AppError("Unauthorized", 401, "auth");
  }

  const { sid } = req.user;
  const data = await StudentService.getStudentProfileService(sid);
  res.json(data);
}
