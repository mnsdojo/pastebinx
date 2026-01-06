import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { AuthController } from "../controllers/auth.controller";
import { requireAuth } from "../middlewares/auth.middleware";


const router = Router();


router.post("/register", validate(registerSchema), AuthController.register);
router.post("/login", validate(loginSchema), AuthController.login);
router.get("/me", requireAuth, AuthController.profile);


export default router;
