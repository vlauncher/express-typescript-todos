import { Router } from "express";
import { register, login, verifyEmail, forgotPassword, resetPassword,changePassword } from "../controllers/usersControllers";
import { protect } from "../middlewares/auth";

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.put('/change-password', protect, changePassword);

export default router