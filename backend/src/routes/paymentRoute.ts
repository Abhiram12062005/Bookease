import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { checkSubscription, createOrder, verifyPayment } from '../controllers/paymentController';

const paymentRouter = Router();

paymentRouter.post('/create-order', protect, createOrder);
paymentRouter.post('/verify', protect, verifyPayment);
paymentRouter.get('/subscription', protect, checkSubscription);

export default paymentRouter;