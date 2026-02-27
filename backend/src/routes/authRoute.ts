import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { checkSubscription, signIn, signUp } from "../controllers/authController";

const authRouter = Router();

authRouter.post('/signup', signUp)
authRouter.post('/signin', signIn)
authRouter.get('/subscription', protect, checkSubscription);
authRouter.get('/me', protect, (req, res) => {
  res.json({ ok: true, user: (req as any).user });
});

export default authRouter; 