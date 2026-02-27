import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/authRoute';
import paymentRouter from './routes/paymentRoute';

const app = express();
dotenv.config() 

app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:3000',
  credentials: true,
}));
app.use(helmet());
app.use(express.json());

app.use('/api/auth',authRouter);
app.use('/api/payment', paymentRouter);
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
}); 

export default app; 