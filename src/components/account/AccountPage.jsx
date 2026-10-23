'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import { api } from '@/lib/api';
import { money, cx } from '@/lib/format';
import { photoFor } from '@/lib/media';
import { useAuth } from '@/store/auth';
import Photo from '@/components/product/Photo';
import OrderTracking from './OrderTracking';

const STATUS_STYLE = {
  confirmed: 'text-clay',
  shipped: 'text-ink',
  delivered: 'text-sage',
  cancelled: 'text-mute',
};
const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

export default function AccountPage() {
  const router = useRouter();
  const { token, user, clear } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');
  const signingOut = useRef(false); // sign-out goes home, not to the login redirect below

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!hydrated) return;
    if (!user) { if (!signingOut.current) router.replace('/login?next=/account'); return; }
    let live = true;
    api.myOrders({ token, user })
      .then((list) => live && setOrders(list))
      .catch((err) => {
        if (!live) return;
        if (err.status === 401) { clear(); return; } // session expired (e.g. demo server restarted)
        setError(err.message); setOrders([]);
      });
    return () => { live = false; };
  }, [hydrated, user, token, router, clear]);

  const signOut = () => { signingOut.current = true; api.logout(token); clear(); router.push('/'); };

  if (!hydrated || !user) return <div className="wrap pt-16 min-h-[60vh]" />;

  const spent = (orders || []).reduce((s, o) => s + o.summary.total, 0);

  return (
    <div className="wrap pt-10 md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b hairline pb-8">
        <div>
          <p className="label text-clay mb-3">Your account</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] m-0">Hello, <em>{user.name.split(' ')[0]}</em></h1>
        </div>
        <button type="button" onClick={signOut} className="label bg-transparent border-0 p-0 link-draw">Sign out</button>
      </div>

      <div className="row g-4 g-lg-5 mt-2">
        <div className="col-12 col-lg-4">
          <div className="lg:sticky lg:top-24">
            <dl className="m-0 flex flex-col gap-5 text-sm">
              <div><dt className="label text-mute">Name</dt><dd className="m-0 mt-1 font-serif text-2xl">{user.name}</dd></div>
              <div><dt className="label text-mute">Email</dt><dd className="m-0 mt-1 break-all">{user.email}</dd></div>
              {user.createdAt && <div><dt className="label text-mute">Member since</dt><dd className="m-0 mt-1">{fmtDate(user.createdAt)}</dd></div>}
            </dl>
            <div className="mt-8 grid grid-cols-2 border-t border-l hairline">
              {[['Orders', orders ? orders.length : '—'], ['Spent', orders ? money(spent) : '—']].map(([label, value]) => (
                <div key={label} className="border-r border-b hairline p-4">
                  <p className="label text-mute m-0">{label}</p>
                  <p className="font-serif text-3xl m-0 mt-1">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-8">
          <p className="label mb-4">Order history</p>
          {error && <p className="text-clay text-sm">{error}</p>}
          {!orders ? (
            <div className="flex flex-col gap-3">{[0, 1].map((i) => <Skeleton key={i} variant="rectangular" height={96} />)}</div>
          ) : orders.length === 0 ? (
            <div className="bg-surface p-8 text-center">
              <p className="font-serif text-4xl m-0">No orders yet</p>
              <p className="text-mute mt-2">Orders you place while signed in show up here.</p>
              <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Start shopping</Button>
            </div>
          ) : (
            <div className="border-t hairline">
              {orders.map((o, i) => (
                <Accordion key={o.id} defaultExpanded={i === 0} disableGutters elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid var(--line)', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<AddOutlinedIcon fontSize="small" />} sx={{ px: 0, py: 1.5, '& .Mui-expanded.MuiAccordionSummary-expandIconWrapper': { transform: 'rotate(45deg)' } }}>
                    <div className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 pr-3">
                      <div className="flex gap-1">
                        {o.lines.slice(0, 3).map((l) => (
                          <div key={`${l.productId}${l.size}${l.color}`} className="relative w-11 aspect-[4/5] overflow-hidden bg-surface"><Photo src={photoFor(l)} alt="" sizes="44px" /></div>
                        ))}
                      </div>
                      <div className="min-w-0">
                        <p className="m-0 font-semibold text-sm">{o.id}</p>
                        <p className="m-0 text-xs text-mute">{fmtDate(o.createdAt)} · {o.summary.itemCount} item{o.summary.itemCount === 1 ? '' : 's'}</p>
                      </div>
                      <span className={cx('label text-[0.6rem]', STATUS_STYLE[o.status] || STATUS_STYLE.confirmed)}>● {o.status}</span>
                      <span className="ml-auto font-serif text-2xl">{money(o.summary.total)}</span>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pb: 4 }}>
                    <OrderTracking order={o} />
                    <div className="flex flex-col gap-4 border-t hairline pt-5">
                      {o.lines.map((l) => (
                        <Link key={`${l.productId}${l.size}${l.color}`} href={`/product/${l.slug}`} className="group flex items-center gap-4">
                          <div className="relative w-14 aspect-[4/5] overflow-hidden bg-surface shrink-0"><Photo src={photoFor(l)} alt={l.name} sizes="60px" /></div>
                          <div className="flex-1 min-w-0 text-sm"><p className="m-0 font-serif text-lg leading-tight truncate group-hover:italic">{l.name}</p><p className="m-0 text-mute text-xs">{l.color} · {l.size} · ×{l.quantity}</p></div>
                          <span className="text-sm">{money(l.lineTotal)}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                      <div className="text-mute">
                        {o.shippingAddress?.line1 && <p className="m-0">Ship to {[o.shippingAddress.line1, o.shippingAddress.city, o.shippingAddress.country].filter(Boolean).join(', ')}</p>}
                        <p className="m-0">{o.status === 'delivered' ? 'Delivered' : 'Estimated delivery'} {fmtDate(o.estimatedDelivery)}</p>
                      </div>
                      <table className="table table-borderless mb-0 text-sm">
                        <tbody>
                          <tr><td className="text-mute p-0">Subtotal</td><td className="text-end p-0">{money(o.summary.subtotal)}</td></tr>
                          <tr><td className="text-mute p-0">Shipping</td><td className="text-end p-0">{o.summary.shipping === 0 ? 'Complimentary' : money(o.summary.shipping)}</td></tr>
                          <tr><td className="text-mute p-0">GST</td><td className="text-end p-0">{money(o.summary.tax)}</td></tr>
                          <tr><td className="p-0 pt-1 font-semibold">Total</td><td className="text-end p-0 pt-1 font-semibold">{money(o.summary.total)}</td></tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionDetails>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
