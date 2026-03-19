import express from 'express';
import cors from "cors";
import dotenv from 'dotenv';
import helmet from 'helmet';
import authRouter from './routes/authRoute';
import paymentRouter from './routes/paymentRoute';
import projectRouter from './routes/projectRoutes';
import path from 'path';

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
app.use('/api/projects', projectRouter);
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')))
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Unhandled]', err.message)
  res.status(500).json({ message: err.message ?? 'Internal server error' })
})
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
}); 
 
export default app;