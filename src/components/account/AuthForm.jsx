'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { api } from '@/lib/api';
import { DEMO_ACCOUNT } from '@/lib/localAccount';
import { useAuth } from '@/store/auth';
import { COLLECTION_PHOTOS } from '@/lib/media';

/* Only follow same-site paths after signing in. */
const safeNext = (next) => (next?.startsWith('/') && !next.startsWith('//') ? next : '/account');

export default function AuthForm({ mode }) {
  const isSignup = mode === 'signup';
  const router = useRouter();
  const next = safeNext(useSearchParams().get('next'));
  const { user, setSession } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [slow, setSlow] = useState(false);

  // A sleeping free-tier backend can take ~30s to wake; say so instead of looking stuck.
  useEffect(() => {
    if (status !== 'loading') { setSlow(false); return; }
    const id = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(id);
  }, [status]);

  // Already signed in: go straight on.
  useEffect(() => { if (user) router.replace(next); }, [user, next, router]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (body) => {
    setStatus('loading'); setError('');
    try {
      setSession(await (isSignup ? api.signup(body) : api.login(body)));
    } catch (err) {
      setError(err.message); setStatus('idle');
    }
  };

  const switchHref = `${isSignup ? '/login' : '/signup'}${next !== '/account' ? `?next=${encodeURIComponent(next)}` : ''}`;

  return (
    <div className="wrap pt-6 md:pt-10">
      <div className="row g-0 min-h-[70vh]">
        <div className="col-lg-6 d-none d-lg-block relative">
          <Image src={isSignup ? COLLECTION_PHOTOS.men : COLLECTION_PHOTOS.women} alt="" fill sizes="50vw" className="object-cover" />
        </div>
        <div className="col-12 col-lg-6 flex items-center">
          <div className="w-full max-w-md mx-auto py-8 lg:px-8">
            <p className="label text-clay mb-3">{isSignup ? 'Join VOID.' : 'Account'}</p>
            <h1 className="font-serif text-6xl md:text-7xl leading-[0.9] m-0">{isSignup ? <>Create an <em>account</em></> : <>Welcome <em>back</em></>}</h1>
            <p className="text-mute mt-4">{isSignup ? 'Track orders, save your details and check out faster.' : 'Sign in to see your orders and check out faster.'}</p>

            <form onSubmit={(e) => { e.preventDefault(); submit(isSignup ? form : { email: form.email, password: form.password }); }} className="mt-8 flex flex-col gap-5">
              {isSignup && (
                <div><label className="form-label" htmlFor="name">Full name</label><input id="name" required autoComplete="name" className="form-control" value={form.name} onChange={set('name')} /></div>
              )}
              <div><label className="form-label" htmlFor="email">Email</label><input id="email" required type="email" autoComplete="email" className="form-control" value={form.email} onChange={set('email')} /></div>
              <div>
                <label className="form-label" htmlFor="password">Password</label>
                <input id="password" required type="password" minLength={6} autoComplete={isSignup ? 'new-password' : 'current-password'} className="form-control" value={form.password} onChange={set('password')} placeholder={isSignup ? 'At least 6 characters' : ''} />
              </div>
              {error && <p className="text-clay text-sm m-0" role="alert">{error}</p>}
              {slow && <p className="text-mute text-sm m-0" role="status">Waking up the demo server, this can take up to a minute…</p>}
              <Button type="submit" variant="contained" fullWidth disabled={status === 'loading'} sx={{ mt: 1 }}>
                {status === 'loading' ? 'One moment…' : isSignup ? 'Create account' : 'Sign in'}
              </Button>
              {!isSignup && (
                <Button variant="outlined" fullWidth disabled={status === 'loading'} onClick={() => submit({ email: DEMO_ACCOUNT.email, password: DEMO_ACCOUNT.password })}>
                  Use demo account
                </Button>
              )}
              <p className="text-sm text-mute text-center m-0">
                {isSignup ? 'Already have an account?' : 'New to VOID.?'}{' '}
                <Link href={switchHref} className="text-ink underline underline-offset-4">{isSignup ? 'Sign in' : 'Create an account'}</Link>
              </p>
            </form>
            <p className="text-xs text-mute mt-6 text-center">Demo only: accounts are kept in memory on the demo server and reset when it restarts.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
