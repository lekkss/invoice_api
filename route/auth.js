import express from "express";
import { login, register } from "../controller/auth.js";
import validateRequest from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
const router = express.Router();

router.post("/register", validateRequest(registerSchema), register);
router.post("/login", validateRequest(loginSchema), login);

export default router;
