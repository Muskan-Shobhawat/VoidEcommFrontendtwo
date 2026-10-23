'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { useCart } from '@/store/cart';
import { api } from '@/lib/api';
import CartLine from './CartLine';
import Summary from './Summary';

export default function CartPage() {
  const { items, clear } = useCart();
  const [summary, setSummary] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) { setSummary(null); return; }
    let live = true;
    api.priceCart(items.map((i) => ({ productId: i.productId, quantity: i.quantity, size: i.size, color: i.color })))
      .then((r) => live && setSummary(r.summary))
      .catch(() => live && setSummary(null));
    return () => { live = false; };
  }, [items, hydrated]);

  return (
    <div className="wrap pt-10 md:pt-16">
      <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] m-0">Your bag</h1>

      {hydrated && items.length === 0 ? (
        <div className="py-24 text-center border-t hairline mt-8">
          <p className="font-serif text-4xl">Nothing here yet</p>
          <p className="text-mute">Your bag is waiting for its first piece.</p>
          <Button component={Link} href="/shop" variant="contained" sx={{ mt: 2 }}>Shop the edit</Button>
        </div>
      ) : (
        <div className="row g-4 g-lg-5 mt-4">
          <div className="col-12 col-lg-8">
            <div className="flex flex-col border-t hairline">
              {items.map((l) => <div key={`${l.productId}${l.size}${l.color}`} className="py-6 border-b hairline"><CartLine line={l} /></div>)}
            </div>
            {items.length > 0 && <button type="button" onClick={clear} className="label text-mute bg-transparent border-0 p-0 mt-4 link-draw">Clear bag</button>}
          </div>
          <div className="col-12 col-lg-4">
            <div className="bg-surface p-6 md:p-8 lg:sticky lg:top-24">
              <p className="label mb-4">Order summary</p>
              <Summary summary={summary} />
              <Button component={Link} href="/checkout" variant="contained" fullWidth sx={{ mt: 3 }} disabled={!items.length}>Checkout</Button>
              <p className="text-xs text-mute mt-4 mb-0">Complimentary shipping over ₹2,999 · 30-day returns · Secure demo checkout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
