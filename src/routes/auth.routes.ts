import { Router } from "express";
import * as AuthController from "../controllers/auth.controller";
import { asyncHandler } from "../utils/async_handler";

const router = Router();

router.post("/login", asyncHandler(AuthController.login));
router.post("/refresh", asyncHandler(AuthController.refresh));
router.get("/logout", asyncHandler(AuthController.logout));

export default router;
