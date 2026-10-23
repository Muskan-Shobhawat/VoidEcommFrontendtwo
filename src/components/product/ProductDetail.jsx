'use client';
import Link from 'next/link';
import { useState } from 'react';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ReplayOutlinedIcon from '@mui/icons-material/ReplayOutlined';
import ProductGallery from './ProductGallery';
import { useCart } from '@/store/cart';
import { money, cx } from '@/lib/format';
import { photosFor } from '@/lib/media';

const SIZE_CHART = [
  ['XS', '84–88', '70–74'], ['S', '88–94', '74–80'], ['M', '94–100', '80–86'],
  ['L', '100–106', '86–92'], ['XL', '106–112', '92–98'], ['XXL', '112–118', '98–104'],
];

export default function ProductDetail({ product }) {
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(null);
  const [guide, setGuide] = useState(false);
  const add = useCart((s) => s.add);

  const off = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  const addToBag = () => {
    if (!size) { setToast({ severity: 'warning', msg: 'Please select a size.' }); return; }
    add(product, { size, color, quantity: qty });
    setToast({ severity: 'success', msg: `${product.name} added to your bag.` });
  };

  return (
    <section className="wrap pt-6 md:pt-10">
      <nav className="label text-mute mb-6 flex gap-2 flex-wrap text-[0.6rem]">
        <Link href="/" className="hover:text-ink">Home</Link><span>/</span>
        <Link href={`/shop?gender=${product.gender}`} className="hover:text-ink">{product.gender}</Link><span>/</span>
        <Link href={`/shop?gender=${product.gender}&category=${product.category}`} className="hover:text-ink">{product.category}</Link>
      </nav>

      <div className="row g-4 g-lg-5">
        <div className="col-12 col-lg-7 col-xl-8">
          <ProductGallery
            photos={photosFor(product)}
            name={product.name}
            badges={
              <>
                {product.isNew && <span className="label bg-paper/90 text-ink px-2 py-1 text-[0.58rem]">New</span>}
                {off > 0 && <span className="label bg-clay text-ivory px-2 py-1 text-[0.58rem]">−{off}%</span>}
              </>
            }
          />
        </div>

        <div className="col-12 col-lg-5 col-xl-4">
          <div className="lg:sticky lg:top-28">
            <p className="label text-clay">{product.gender} · {product.category}</p>
            <h1 className="font-serif text-5xl md:text-6xl leading-[0.95] mt-3 mb-0">{product.name}</h1>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-xl font-semibold">{money(product.price)}</span>
              {product.compareAtPrice && <span className="text-mute line-through">{money(product.compareAtPrice)}</span>}
              <span className="ml-auto text-xs text-mute">★ {product.rating} ({product.reviews})</span>
            </div>
            <p className="mt-6 text-mute leading-relaxed">{product.description}</p>

            <div className="mt-8">
              <p className="label text-mute mb-3">Colour — <span className="text-ink">{color.name}</span></p>
              <div className="flex gap-2.5">
                {product.colors.map((c) => (
                  <button key={c.name} type="button" onClick={() => setColor(c)} aria-label={c.name} title={c.name} className={cx('h-8 w-8 border p-0 transition-shadow', color.name === c.name ? 'border-ink shadow-[0_0_0_3px_var(--paper),0_0_0_4px_var(--ink)]' : 'hairline')} style={{ background: c.hex }} />
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="flex justify-between mb-3">
                <p className="label text-mute m-0">Size{size && <> — <span className="text-ink">{size}</span></>}</p>
                <button type="button" onClick={() => setGuide(true)} className="label bg-transparent border-0 p-0 link-draw">Size guide</button>
              </div>
              <div className="grid border-l border-t hairline" style={{ gridTemplateColumns: `repeat(${product.sizes.length}, minmax(0, 1fr))` }}>
                {product.sizes.map((s) => (
                  <button key={s} type="button" onClick={() => setSize(s)} className={cx('border-r border-b hairline py-3 text-sm transition-colors', size === s ? 'bg-ink text-paper' : 'bg-transparent hover:bg-surface')}>{s}</button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <div className="inline-flex items-center border hairline">
                <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><RemoveOutlinedIcon fontSize="small" /></IconButton>
                <span className="w-8 text-center text-sm">{qty}</span>
                <IconButton size="small" onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity"><AddOutlinedIcon fontSize="small" /></IconButton>
              </div>
              <Button variant="contained" fullWidth onClick={addToBag} sx={{ py: 2 }}>
                Add to bag · {money(product.price * qty)}
              </Button>
            </div>
            {product.stock <= 20 && <p className="mt-3 text-xs text-clay mb-0">Only {product.stock} left in stock</p>}

            <div className="mt-6 grid grid-cols-2 gap-3 text-xs text-mute">
              <p className="m-0 flex items-center gap-2"><LocalShippingOutlinedIcon sx={{ fontSize: 18 }} /> Free shipping over ₹2,999</p>
              <p className="m-0 flex items-center gap-2"><ReplayOutlinedIcon sx={{ fontSize: 18 }} /> 30-day returns</p>
            </div>

            <div className="mt-8 border-t hairline">
              {[
                { t: 'Details', c: <ul className="m-0 ps-4 text-mute text-sm flex flex-col gap-1">{product.details.map((d) => <li key={d}>{d}</li>)}</ul> },
                { t: 'Shipping & returns', c: <p className="m-0 text-mute text-sm">Ships in 1–2 business days. Free standard shipping on orders over ₹2,999. Returns accepted within 30 days in original condition.</p> },
                { t: 'Care', c: <p className="m-0 text-mute text-sm">Machine wash cold, inside out. Do not tumble dry. Cool iron on the reverse.</p> },
              ].map((row) => (
                <Accordion key={row.t} disableGutters elevation={0} sx={{ bgcolor: 'transparent', borderBottom: '1px solid var(--line)', '&:before': { display: 'none' } }}>
                  <AccordionSummary expandIcon={<AddOutlinedIcon fontSize="small" />} sx={{ px: 0, '& .Mui-expanded.MuiAccordionSummary-expandIconWrapper': { transform: 'rotate(45deg)' } }}>
                    <span className="label">{row.t}</span>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 0, pt: 0 }}>{row.c}</AccordionDetails>
                </Accordion>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={guide} onClose={() => setGuide(false)} maxWidth="xs" fullWidth>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-serif text-3xl m-0">Size guide</p>
            <IconButton onClick={() => setGuide(false)} aria-label="Close"><CloseOutlinedIcon /></IconButton>
          </div>
          <table className="table text-sm mb-2">
            <thead><tr><th className="label text-mute">Size</th><th className="label text-mute">Chest (cm)</th><th className="label text-mute">Waist (cm)</th></tr></thead>
            <tbody>{SIZE_CHART.map(([s, c, w]) => <tr key={s}><td>{s}</td><td>{c}</td><td>{w}</td></tr>)}</tbody>
          </table>
          <p className="text-xs text-mute m-0">Between sizes? Size down for a closer fit, up for a relaxed one.</p>
        </div>
      </Dialog>

      <Snackbar open={!!toast} autoHideDuration={2600} onClose={() => setToast(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} sx={{ bottom: { xs: 80, md: 88 } }}>
        {toast ? <Alert severity={toast.severity} variant="filled" onClose={() => setToast(null)}>{toast.msg}</Alert> : null}
      </Snackbar>
    </section>
  );
}
