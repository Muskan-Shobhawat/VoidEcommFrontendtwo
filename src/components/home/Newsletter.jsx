'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', msg: '' });

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading', msg: '' });
    try {
      const r = await api.newsletter(email);
      setState({ status: 'done', msg: r.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', msg: err.message });
    }
  };

  return (
    <div>
      {compact ? (
        <p className="label text-mute mb-4">Newsletter</p>
      ) : (
        <>
          <p className="label text-clay mb-4">The Letter</p>
          <h3 className="font-serif text-4xl md:text-6xl leading-[0.95] m-0">First to know,<br /><em>first to wear.</em></h3>
          <p className="text-mute mt-4 mb-8 max-w-md">New arrivals, private sales and the occasional styling note. Once a fortnight, never more.</p>
        </>
      )}
      <form onSubmit={submit} className="flex items-end gap-4 border-b border-current pb-1">
        <label htmlFor={compact ? 'nl-compact' : 'nl'} className="visually-hidden">Email address</label>
        <input id={compact ? 'nl-compact' : 'nl'} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" className="flex-1 min-w-0 bg-transparent border-0 outline-none py-2 text-ink placeholder:text-mute" />
        <button type="submit" disabled={state.status === 'loading'} className="label bg-transparent border-0 py-2 px-0 hover:text-clay">
          {state.status === 'loading' ? '…' : 'Subscribe →'}
        </button>
      </form>
      {state.msg && <p className={`text-sm mt-3 mb-0 ${state.status === 'error' ? 'text-clay' : 'text-sage'}`}>{state.msg}</p>}
    </div>
  );
}
