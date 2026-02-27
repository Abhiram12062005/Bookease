'use client';

import { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const SERVER_PORT = process.env.SERVER_PORT ?? 5000;
  const [formData, setFormData] = useState({
    name: '',
    phoneCountryCode: '+91',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    organisationName: '',
    location: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      container.style.setProperty('--mx', `${x}%`);
      container.style.setProperty('--my', `${y}%`);
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:${SERVER_PORT}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
      } else {
        router.push('/');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
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
      <div className="w-full max-w-2xl space-y-8 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
        <div>
          <h2 className="text-center text-3xl font-jakarta font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-white/60 font-dm">
            Fill in your details to get started.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="name" className="text-white/70 font-dm">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-white/70 font-dm">Phone Number</Label>
            <div className="mt-1 flex gap-3">
              <Select
                value={formData.phoneCountryCode}
                onValueChange={(value: string) =>
                  setFormData({ ...formData, phoneCountryCode: value })
                }
              >
                <SelectTrigger className="w-[110px] bg-white/10 border-white/15 text-white">
                  <SelectValue placeholder="+91" />
                </SelectTrigger>
                <SelectContent className="bg-[#111118] text-white border-white/10">
                  <SelectItem value="+91">+91</SelectItem>
                  <SelectItem value="+1">+1</SelectItem>
                  <SelectItem value="+44">+44</SelectItem>
                  <SelectItem value="+61">+61</SelectItem>
                  <SelectItem value="+971">+971</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="flex-1 bg-white/10 border-white/15 text-white placeholder:text-white/40"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="email" className="text-white/70 font-dm">Email address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-white/70 font-dm">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-white/50" />
                ) : (
                  <Eye className="h-5 w-5 text-white/50" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="confirmPassword" className="text-white/70 font-dm">Confirm Password</Label>
            <div className="relative mt-1">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="pr-10 bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-white/50" />
                ) : (
                  <Eye className="h-5 w-5 text-white/50" />
                )}
              </button>
            </div>
          </div>
          <div>
            <Label htmlFor="organisationName" className="text-white/70 font-dm">
              Organisation Name
            </Label>
            <Input
              id="organisationName"
              name="organisationName"
              type="text"
              required
              value={formData.organisationName}
              onChange={handleChange}
              placeholder="Company name or NA"
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <Label htmlFor="location" className="text-white/70 font-dm">Location</Label>
            <Input
              id="location"
              name="location"
              type="text"
              required
              value={formData.location}
              onChange={handleChange}
              className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          <div>
            <Button type="submit" className="w-full bg-[#7C3AED] text-white hover:bg-[#6D28D9]" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>
        </form>
        <div className="text-center">
          <p className="text-sm text-white/60 font-dm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="font-medium text-[#9B5CF6] hover:text-white transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
