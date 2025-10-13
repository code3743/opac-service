import { Request, Response } from "express";
import * as StudentService from "../services/student.service";


export async function getStudentProfile(req: Request, res: Response) {
  const { sid } = req.user!;
  const data = await StudentService.getStudentProfileService(sid);
  res.json(data);
}

export async function getStudentLoans(req: Request, res: Response) {
  const { sid } = req.user!;
  const data = await StudentService.getStudentLoansService(sid);
  res.json(data);
}

export async function getStudentHistory(req: Request, res: Response) {
  const { sid } = req.user!;
  const data = await StudentService.getStudentHistoryService(sid);
  res.json(data);
}
