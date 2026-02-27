import { Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { AuthRequest } from '../middleware/authMiddleware';
import User from '../models/userModel';

// ─── Razorpay instance ────────────────────────────────────────────────────────

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// ─── Plan config ──────────────────────────────────────────────────────────────

const PLANS = {
  Starter: { monthly: 299,  yearly: 2990  },
  Growth:  { monthly: 799,  yearly: 7990  },
  Scale:   { monthly: 1999, yearly: 19990 },
} as const;

type PackageType  = keyof typeof PLANS;
type BillingCycle = 'monthly' | 'yearly';

// ─── 1. Create Razorpay Order ─────────────────────────────────────────────────
// POST /api/payment/create-order

export async function createOrder(req: AuthRequest, res: Response): Promise<void> {
  try {
    const { packageType, billingCycle } = req.body as {
      packageType:  PackageType;
      billingCycle: BillingCycle;
    };

    if (!PLANS[packageType] || !['monthly', 'yearly'].includes(billingCycle)) {
      res.status(400).json({ ok: false, error: 'Invalid plan or billing cycle' });
      return;
    }

    const amount = PLANS[packageType][billingCycle]; // in INR
    const amountInPaise = amount * 100;              // Razorpay needs paise

    const order = await razorpay.orders.create({
      amount:   amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${req.user?.userId?.slice(-6)}_${Date.now().toString().slice(-8)}`,
      notes: {
        userId:      req.user?.userId ?? '',
        packageType,
        billingCycle,
      },
    });

    res.status(201).json({
      ok:           true,
      orderId:      order.id,
      amount:       amountInPaise,
      currency:     'INR',
      packageType,
      billingCycle,
      keyId:        process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('[createOrder]', error);
    res.status(500).json({ ok: false, error: 'Failed to create payment order' });
  }
}

// ─── 2. Verify Payment & Activate Subscription ───────────────────────────────
// POST /api/payment/verify

export async function verifyPayment(req: AuthRequest, res: Response): Promise<void> {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      packageType,
      billingCycle,
    } = req.body as {
      razorpay_order_id:  string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      packageType:        PackageType;
      billingCycle:       BillingCycle;
    };

    // ── Verify signature ───────────────────────────────────────────────────────
    const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest('hex');

    if (expected !== razorpay_signature) {
      res.status(400).json({ ok: false, error: 'Payment verification failed' });
      return;
    }

    // ── Calculate dates ────────────────────────────────────────────────────────
    const durationDays = billingCycle === 'yearly' ? 365 : 30;
    const startDate    = new Date();
    const endDate      = new Date();
    endDate.setDate(endDate.getDate() + durationDays);

    const price = PLANS[packageType][billingCycle];

    // ── Update user in DB ──────────────────────────────────────────────────────
    const user = await User.findByIdAndUpdate(
      req.user?.userId,
      {
        subscribed: true,
        $push: {
          subscriptions: {
            packageType,
            packagePrice:      price,
            billingCycle,
            durationDays,
            startDate,
            endDate,
            razorpayOrderId:   razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            status:            'active',
          },
        },
      },
      { new: true },
    );

    if (!user) {
      res.status(404).json({ ok: false, error: 'User not found' });
      return;
    }

    // Return latest subscription for invoice
    const latest = user.subscriptions[user.subscriptions.length - 1];

    res.status(200).json({
      ok: true,
      message: 'Payment verified and subscription activated',
      subscription: {
        id:               (latest as any)._id,
        packageType:      latest.packageType,
        packagePrice:     latest.packagePrice,
        billingCycle:     latest.billingCycle,
        durationDays:     latest.durationDays,
        startDate:        latest.startDate,
        endDate:          latest.endDate,
        razorpayOrderId:  latest.razorpayOrderId,
        razorpayPaymentId: latest.razorpayPaymentId,
      },
      user: {
        id:    user._id.toString(),
        name:  user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('[verifyPayment]', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}

// ─── 3. Check subscription status + expire if needed ─────────────────────────
// GET /api/user/subscription

export async function checkSubscription(req: AuthRequest, res: Response): Promise<void> {
  try {
    const user = await User.findById(req.user?.userId);

    if (!user) {
      res.status(404).json({ ok: false, error: 'User not found' });
      return;
    }

    const now = new Date();

    // Mark any expired subscriptions
    let changed = false;
    for (const sub of user.subscriptions) {
      if (sub.status === 'active' && new Date(sub.endDate) < now) {
        sub.status = 'expired';
        changed    = true;
      }
    }

    // Recompute subscribed flag
    const hasActive = user.subscriptions.some((s) => s.status === 'active');
    if (user.subscribed !== hasActive) {
      user.subscribed = hasActive;
      changed         = true;
    }

    if (changed) await user.save();

    const activeSub = user.subscriptions.find((s) => s.status === 'active');

    res.status(200).json({
      ok:          true,
      subscribed:  user.subscribed,
      activePlan:  activeSub
        ? {
            packageType:  activeSub.packageType,
            billingCycle: activeSub.billingCycle,
            endDate:      activeSub.endDate,
            daysLeft:     Math.ceil(
              (new Date(activeSub.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            ),
          }
        : null,
    });
  } catch (error) {
    console.error('[checkSubscription]', error);
    res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}