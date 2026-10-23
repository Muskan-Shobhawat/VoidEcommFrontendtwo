'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { api } from '@/lib/api';
import { money } from '@/lib/format';
import { photoFor } from '@/lib/media';
import Photo from '@/components/product/Photo';
import Summary from './Summary';

const EMPTY = { name: '', email: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'India' };

const Field = ({ label, className = 'col-12', ...props }) => (
  <div className={className}>
    <label className="form-label" htmlFor={props.id}>{label}</label>
    <input className="form-control" {...props} />
  </div>
);

const LineThumb = ({ line, total }) => (
  <div className="flex items-center gap-3">
    <div className="relative w-[52px] aspect-[4/5] shrink-0 overflow-hidden bg-surface"><Photo src={photoFor(line)} alt={line.name} sizes="60px" /></div>
    <div className="flex-1 min-w-0 text-sm"><p className="m-0 font-serif text-lg leading-tight truncate">{line.name}</p><p className="m-0 text-mute text-xs">{line.color} · {line.size} · ×{line.quantity}</p></div>
    <span className="text-sm">{money(total)}</span>
  </div>
);

export default function CheckoutPage() {
  const { items, clear } = useCart();
  const { token, user } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [summary, setSummary] = useState(null);
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);
  // Signed in: start with the account's name and email.
  useEffect(() => {
    if (hydrated && user) setForm((f) => ({ ...f, name: f.name || user.name, email: f.email || user.email }));
  }, [hydrated, user]);
  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    api.priceCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color }))).then((r) => setSummary(r.summary)).catch(() => {});
  }, [items, hydrated]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('loading'); setError('');
    try {
      const o = await api.createOrder({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })),
        customer: { name: form.name, email: form.email, phone: form.phone },
        shippingAddress: { line1: form.line1, line2: form.line2, city: form.city, state: form.state, postalCode: form.postalCode, country: form.country },
      }, { token, user });
      setOrder(o);
      clear();
      setStatus('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err.message); setStatus('idle');
    }
  };

  if (order) {
    return (
      <div className="wrap pt-10 md:pt-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="label text-clay">Order confirmed</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] mt-3">Thank you{order.customer?.name ? `, ${order.customer.name.split(' ')[0]}` : ''}.</h1>
          <p className="text-mute mt-4">Order <span className="text-ink font-semibold">{order.id}</span> is confirmed. A receipt was “sent” to {order.customer?.email}. Estimated delivery {order.estimatedDelivery}.</p>
          {order.offline && <p className="text-xs text-clay mt-2">Backend offline: this order was priced locally{user ? ' and saved in this browser' : ' and not stored'}.</p>}
          <div className="mt-10 flex flex-col gap-4 text-left border-t hairline pt-6">
            {order.lines.map((l) => <LineThumb key={`${l.productId}${l.size}${l.color}`} line={l} total={l.lineTotal} />)}
            <div className="flex justify-between border-t hairline pt-4"><span className="label">Total</span><span className="font-serif text-3xl">{money(order.summary.total)}</span></div>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button component={Link} href="/shop" variant="contained">Continue shopping</Button>
            {user
              ? <Button component={Link} href="/account" variant="outlined">View order history</Button>
              : <Button component={Link} href="/signup" variant="outlined">Create an account</Button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap pt-10 md:pt-16">
      <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] m-0">Checkout</h1>
      <p className="text-mute mt-4">
        Demo checkout — no payment is collected.{' '}
        {hydrated && (user
          ? <>Signed in as <span className="text-ink">{user.email}</span>; this order will appear in your <Link href="/account" className="underline underline-offset-4 text-ink">order history</Link>.</>
          : <><Link href="/login?next=/checkout" className="underline underline-offset-4 text-ink">Sign in</Link> to save it to your order history.</>)}
      </p>

      {hydrated && items.length === 0 ? (
        <div className="py-20 text-center">
          <p className="font-serif text-4xl">Your bag is empty</p>
          <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Go shopping</Button>
        </div>
      ) : (
        <form onSubmit={submit} className="row g-4 g-lg-5 mt-4">
          <div className="col-12 col-lg-7">
            <p className="label border-b hairline pb-3"><span className="text-clay mr-3">01</span>Contact</p>
            <div className="row g-4 mt-1">
              <Field className="col-12 col-md-6" id="name" label="Full name" required value={form.name} onChange={set('name')} autoComplete="name" />
              <Field className="col-12 col-md-6" id="email" label="Email" type="email" required value={form.email} onChange={set('email')} autoComplete="email" />
              <Field className="col-12 col-md-6" id="phone" label="Phone" value={form.phone} onChange={set('phone')} autoComplete="tel" />
            </div>
            <p className="label border-b hairline pb-3 mt-12"><span className="text-clay mr-3">02</span>Delivery address</p>
            <div className="row g-4 mt-1">
              <Field id="line1" label="Address" required value={form.line1} onChange={set('line1')} autoComplete="address-line1" />
              <Field id="line2" label="Apartment, suite (optional)" value={form.line2} onChange={set('line2')} autoComplete="address-line2" />
              <Field className="col-12 col-md-5" id="city" label="City" required value={form.city} onChange={set('city')} autoComplete="address-level2" />
              <Field className="col-6 col-md-3" id="state" label="State" value={form.state} onChange={set('state')} autoComplete="address-level1" />
              <Field className="col-6 col-md-4" id="postalCode" label="PIN code" required value={form.postalCode} onChange={set('postalCode')} autoComplete="postal-code" />
              <div className="col-12">
                <label className="form-label" htmlFor="country">Country</label>
                <select id="country" className="form-select" value={form.country} onChange={set('country')}>
                  {['India', 'United States', 'United Kingdom', 'United Arab Emirates', 'Singapore', 'Australia', 'Canada'].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <p className="label border-b hairline pb-3 mt-12"><span className="text-clay mr-3">03</span>Payment</p>
            <p className="text-sm text-mute">Demo mode: payment is simulated. Place the order to generate a confirmation.</p>
            {error && <p className="text-clay text-sm mt-4 m-0" role="alert">{error}</p>}
          </div>
          <div className="col-12 col-lg-5">
            <div className="bg-surface p-6 md:p-8 lg:sticky lg:top-24">
              <p className="label mb-4">In your bag</p>
              <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1 mb-4">
                {items.map((l) => <LineThumb key={`${l.productId}${l.size}${l.color}`} line={l} total={l.price * l.quantity} />)}
              </div>
              <Summary summary={summary} taxLabel="GST" />
              <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={status === 'loading' || !items.length}>
                {status === 'loading' ? 'Placing order…' : 'Place order'}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
