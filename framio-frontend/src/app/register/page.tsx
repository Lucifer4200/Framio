'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL } from '../../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-6 py-12">
      <section className="mx-auto grid min-h-screen max-w-[1280px] overflow-hidden rounded-[2rem] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)] md:grid-cols-[1.1fr_1fr]">
        <div
          className="relative flex items-end justify-start bg-cover bg-center p-12 text-[#1A1A1A] h-full md:min-h-[720px]"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(253,251,247,0.95) 0%, rgba(253,251,247,0.95) 100%), url('https://images.unsplash.com/photo-1582053628662-c65b0e0544e9?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
          }}
        >
          <div className="max-w-[360px] space-y-4 pb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-black/70">Framio Studio</p>
            <h1 className="text-[2.5rem] font-serif font-semibold leading-tight tracking-[-0.03em]">
              Create your account and start framing with ease.
            </h1>
            <p className="max-w-[300px] text-sm leading-7 text-slate-600">
              Join Framio for a refined framing experience with curated art-inspired design and elegant checkout flow.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-10 sm:p-14">
          <div className="w-full max-w-[440px] rounded-[1.25rem] border border-[#E5E5E5] bg-white p-9 shadow-sm">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Create account</p>
              <h2 className="text-[1.85rem] font-semibold text-[#111827]">Join Framio</h2>
              <p className="text-sm leading-7 text-slate-500">
                Start customizing your frame selection and enjoy a beautifully simple registration experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              {error && <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@framio.com"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#1A1A1A] focus:ring-2 focus:ring-[#1A1A1A]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#1A1A1A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-slate-900 underline underline-offset-4">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
