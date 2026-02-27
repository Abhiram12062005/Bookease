import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as String;
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN ?? '7d';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in .env');
}

export interface JwtPayload {
  userId: string;
  email: string;
}

export function signToken(payload: JwtPayload):string{
    return jwt.sign(payload, JWT_SECRET, {expiresIn: JWT_EXPIRES} as jwt.SignOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}