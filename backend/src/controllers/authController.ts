import { Request, Response } from "express";
import bcrypt from 'bcrypt';
import User from "../models/userModel";
import { signToken } from "../utils/jwt";
import { AuthRequest } from "../middleware/authMiddleware";

export async function signUp(req:Request, res:Response): Promise<void>{
    try {
        const{
            name,
            phoneCountryCode,
            phoneNumber,
            email,
            password,
            confirmPassword,
            organisationName,
            location,
        } = req.body;

        if (!name || !phoneNumber || !email || !password || !confirmPassword || !organisationName || !location) {
            res.status(400).json({ ok: false, error: 'All fields are required' });
            return;
        }

        if (password !== confirmPassword) {
            res.status(400).json({ ok: false, error: 'Passwords do not match' });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ ok: false, error: 'Password must be at least 6 characters' });
            return;
        }

        const existingUser = await User.findOne({email: email.toLowerCase()});
        if (existingUser) {
            res.status(409).json({ ok: false, error: 'An account with this email already exists' });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name,
            phoneCountryCode: phoneCountryCode ?? '+91',
            phoneNumber: phoneNumber.toString(), // BigInteger arrives as string over JSON
            email: email.toLowerCase(),
            password: hashedPassword,
            organisationName,
            location,
        });

        const token = signToken({ userId: user._id.toString(), email: user.email });

        res.status(201).json({
            ok: true,
            token,
            user: {
                id:    user._id.toString(),
                name:  user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('[signUp]', error);
        res.status(500).json({ ok: false, error: 'Internal server error' });
    }
}

export async function signIn(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ ok: false, error: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      res.status(401).json({ ok: false, error: 'Invalid email or password' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ ok: false, error: 'Invalid email or password' });
      return;
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });


    res.status(200).json({
      ok: true,
      token,
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[signIn]', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}

// GET /api/user/subscription
export async function checkSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId).select('subscribed');

    if (!user) {
      res.status(404).json({ ok: false, error: 'User not found' });
      return;
    }

    res.status(200).json({ ok: true, subscribed: user.subscribed });
  } catch (error) {
    console.error('[checkSubscription]', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}