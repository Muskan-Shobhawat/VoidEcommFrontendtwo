'use client';
import Link from 'next/link';
import Photo from '@/components/product/Photo';
import { useCart, lineKey } from '@/store/cart';
import { money } from '@/lib/format';
import { photoFor } from '@/lib/media';

export default function CartLine({ line, compact = false }) {
  const { setQty, remove } = useCart();
  const key = lineKey(line);
  return (
    <div className="flex gap-4">
      <Link href={`/product/${line.slug}`} className={`relative shrink-0 aspect-[4/5] overflow-hidden bg-surface ${compact ? 'w-24' : 'w-28 md:w-32'}`}>
        <Photo src={photoFor(line)} alt={line.name} sizes="140px" />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex justify-between gap-3">
          <Link href={`/product/${line.slug}`} className="font-serif text-xl leading-tight hover:italic">{line.name}</Link>
          <span className="text-sm font-semibold shrink-0">{money(line.price * line.quantity)}</span>
        </div>
        <p className="text-xs text-mute mt-1 mb-0">{line.color} · Size {line.size}</p>
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div className="inline-flex items-center border hairline text-sm">
            <button type="button" className="bg-transparent border-0 px-3 py-1 disabled:opacity-30" onClick={() => setQty(key, line.quantity - 1)} disabled={line.quantity <= 1} aria-label="Decrease quantity">−</button>
            <span className="w-6 text-center">{line.quantity}</span>
            <button type="button" className="bg-transparent border-0 px-3 py-1 disabled:opacity-30" onClick={() => setQty(key, line.quantity + 1)} disabled={line.quantity >= 10} aria-label="Increase quantity">+</button>
          </div>
          <button type="button" onClick={() => remove(key)} className="label text-[0.6rem] text-mute bg-transparent border-0 p-0 link-draw">Remove</button>
        </div>
      </div>
    </div>
  );
}
