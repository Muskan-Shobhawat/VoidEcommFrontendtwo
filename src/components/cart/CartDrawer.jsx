'use client';
import Link from 'next/link';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { useCart } from '@/store/cart';
import CartLine from './CartLine';
import { money } from '@/lib/format';

const FREE_SHIPPING = 2999;

export default function CartDrawer() {
  const { items, isOpen, close } = useCart();
  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING - subtotal);
  const count = items.reduce((n, i) => n + i.quantity, 0);

  return (
    <Drawer anchor="right" open={isOpen} onClose={close} PaperProps={{ sx: { width: '100vw', maxWidth: 460, display: 'flex', flexDirection: 'column' } }}>
      <div className="flex items-center justify-between px-6 py-4 border-b hairline">
        <p className="font-serif text-3xl m-0">Your bag <span className="text-mute text-base font-sans">({count})</span></p>
        <IconButton onClick={close} aria-label="Close bag"><CloseOutlinedIcon /></IconButton>
      </div>

      {items.length > 0 && (
        <div className="px-6 py-3 text-xs bg-surface">
          <p className="m-0">{remaining > 0 ? <>You&apos;re <strong>{money(remaining)}</strong> away from complimentary shipping.</> : 'Your order ships free.'}</p>
          <div className="mt-2 h-px bg-ink/15"><div className="h-px bg-ink transition-all duration-700" style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING) * 100)}%` }} /></div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 flex flex-col gap-6 py-6">
        {items.length === 0 && (
          <div className="py-16 text-center">
            <p className="font-serif text-4xl">Your bag is empty</p>
            <p className="text-mute text-sm">Discover something you&apos;ll wear for years.</p>
            <Button component={Link} href="/shop" variant="outlined" onClick={close} sx={{ mt: 2 }}>Explore the edit</Button>
          </div>
        )}
        {items.map((line) => <CartLine key={`${line.productId}${line.size}${line.color}`} line={line} compact />)}
      </div>

      {items.length > 0 && (
        <div className="border-t hairline p-6 flex flex-col gap-3">
          <div className="flex justify-between"><span className="label">Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div>
          <p className="text-xs text-mute m-0">Shipping and taxes calculated at checkout.</p>
          <Button component={Link} href="/checkout" onClick={close} variant="contained" fullWidth>Checkout</Button>
          <Button component={Link} href="/cart" onClick={close} variant="outlined" fullWidth>View bag</Button>
        </div>
      )}
    </Drawer>
  );
}
