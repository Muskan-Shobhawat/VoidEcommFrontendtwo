'use client';
import Link from 'next/link';
import { useState } from 'react';
import Photo from './Photo';
import { useCart } from '@/store/cart';
import { money, cx } from '@/lib/format';
import { photosFor } from '@/lib/media';

export default function ProductCard({ product, priority = false, sizes }) {
  const [colorIdx, setColorIdx] = useState(0);
  const add = useCart((s) => s.add);
  const [img1, img2] = photosFor(product);
  const color = product.colors[colorIdx];
  const off = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        <Link href={`/product/${product.slug}`} className="absolute inset-0" aria-label={product.name}>
          <Photo src={img1} alt={product.name} priority={priority} sizes={sizes} className="transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]" />
          {img2 && <Photo src={img2} alt="" sizes={sizes} className="opacity-0 transition-opacity duration-700 group-hover:opacity-100" />}
        </Link>
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5 pointer-events-none">
          {product.isNew && <span className="label bg-paper/90 text-ink px-2 py-1 text-[0.58rem]">New</span>}
          {off > 0 && <span className="label bg-clay text-ivory px-2 py-1 text-[0.58rem]">−{off}%</span>}
          {product.tags.includes('limited') && <span className="label bg-coal text-ivory px-2 py-1 text-[0.58rem]">Limited</span>}
        </div>
        {/* Quick add: mouse only (hover), so it never covers the photo on touch screens */}
        <div className="absolute inset-x-0 bottom-0 hidden [@media(hover:hover)]:block translate-y-full transition-transform duration-500 group-hover:translate-y-0">
          <div className="bg-paper/95 backdrop-blur px-3 py-3">
            <p className="label text-mute text-[0.58rem] mb-2">Quick add</p>
            <div className="flex flex-wrap gap-1">
              {product.sizes.map((s) => (
                <button key={s} type="button" aria-label={`Add ${product.name}, size ${s}, to bag`} onClick={() => add(product, { size: s, color })} className="min-w-9 border hairline bg-transparent px-2 py-1.5 text-xs hover:bg-ink hover:text-paper transition-colors">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/product/${product.slug}`} className="font-serif text-lg md:text-xl leading-tight hover:italic">{product.name}</Link>
          <p className="text-xs text-mute mt-1 mb-0 capitalize">{product.gender} · {color.name}</p>
        </div>
        <div className="text-right shrink-0 text-sm">
          <p className="m-0 font-semibold">{money(product.price)}</p>
          {product.compareAtPrice && <p className="m-0 text-xs text-mute line-through">{money(product.compareAtPrice)}</p>}
        </div>
      </div>
      {product.colors.length > 1 && (
        <div className="mt-2 flex items-center gap-1.5">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              title={c.name}
              onMouseEnter={() => setColorIdx(i)}
              onClick={() => setColorIdx(i)}
              className={cx('h-3.5 w-3.5 border p-0 transition-shadow', i === colorIdx ? 'border-ink shadow-[0_0_0_2px_var(--paper),0_0_0_3px_var(--ink)]' : 'hairline')}
              style={{ background: c.hex }}
            />
          ))}
        </div>
      )}
    </article>
  );
}
