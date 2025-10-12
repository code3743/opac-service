import { Request, Response } from "express";
import * as StudentService from "../services/student.service";


export async function getStudentProfile(req: Request, res: Response) {
  const { sid } = req.user!;
  const data = await StudentService.getStudentProfileService(sid);
  res.json(data);
}
