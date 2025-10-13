import { Router } from "express";
import * as StudentController from "../controllers/student.controller";
import { asyncHandler } from "../utils/async_handler";

const router = Router();


router.get("/me", asyncHandler(StudentController.getStudentProfile));
router.get("/me/loans", asyncHandler(StudentController.getStudentLoans));
router.get("/me/history", asyncHandler(StudentController.getStudentHistory));

export default router;
