'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { clearError, clearMessage } from '../api/auth/authSlice';
import { signIn } from '../api/auth/authThunks';
import { useAppDispatch, useAuth } from '../api/hooks';

export default function SignIn() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useAppDispatch();

  // ── Redux state replaces local loading/error/message ──────────────────────
  const { loading, error, message } = useAuth();

  // ── Local UI state (not needed in Redux) ──────────────────────────────────
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localMessage, setLocalMessage] = useState<string | null>(null);

  // Mouse-tracking glow effect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      container.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      container.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
    };
    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Show success banner when redirected from signup
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setLocalMessage('Account created! Please sign in.');
    }
  }, [searchParams]);

  // Clear Redux error & message on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearMessage());
    };
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalMessage(null);

    const result = await dispatch(signIn({ email, password }));

    if (signIn.fulfilled.match(result)) {
      router.push('/');
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center px-6 py-16 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 70% 50% at 50% -10%, rgba(124, 58, 237, 0.18) 0%, transparent 70%),
          radial-gradient(900px circle at var(--mx) var(--my), rgba(124, 58, 237, 0.12) 0%, transparent 60%),
          #0A0A0F
        `,
      }}
    >
      <div className="w-full max-w-md space-y-8 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-jakarta font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-white/60 font-dm">
            Welcome back. Enter your details to continue.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Success: either from ?registered=true redirect or Redux message */}
          {(localMessage || message) && (
            <div className="p-3 rounded bg-green-500/10 border border-green-400/30 text-green-200 text-sm">
              {localMessage ?? message}
            </div>
          )}

          {/* Error from Redux */}
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-white/70 font-dm">
              Email address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-white/70 font-dm">
              Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword
                  ? <EyeOff className="h-5 w-5 text-white/50" />
                  : <Eye    className="h-5 w-5 text-white/50" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-dm font-medium text-white/70 hover:text-white transition-colors">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-white/60 font-dm">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-medium text-[#9B5CF6] hover:text-white transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}