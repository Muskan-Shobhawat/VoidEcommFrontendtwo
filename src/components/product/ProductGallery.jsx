'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined';
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import { cx } from '@/lib/format';

/** One photo that magnifies under the mouse (hover-capable screens only). */
function ZoomPhoto({ src, alt, priority, onOpen }) {
  const [origin, setOrigin] = useState(null);
  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin(`${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <button type="button" onClick={onOpen} onPointerMove={onMove} onPointerLeave={() => setOrigin(null)} aria-label={`Open ${alt} full screen`} className="relative block w-full aspect-[4/5] overflow-hidden bg-surface border-0 p-0 cursor-zoom-in">
      <Image src={src} alt={alt} fill priority={priority} sizes="(max-width: 1024px) 100vw, 30vw" className="object-cover transition-transform duration-300 ease-out" style={origin ? { transform: 'scale(1.8)', transformOrigin: origin } : undefined} />
    </button>
  );
}

export default function ProductGallery({ photos, name, badges }) {
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive] = useState(0);
  const rail = useRef(null);

  const onScroll = () => {
    const el = rail.current;
    if (el) setActive(Math.round(el.scrollLeft / el.clientWidth));
  };
  const step = (d) => setLightbox((i) => (i + d + photos.length) % photos.length);

  return (
    <div className="relative">
      <div className="absolute left-3 top-3 z-10 flex flex-col items-start gap-1.5 pointer-events-none">{badges}</div>

      {/* Phones / tablets: swipeable rail */}
      <div className="lg:hidden">
        <div ref={rail} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto no-scrollbar -mx-[1.25rem] md:mx-0">
          {photos.map((src, i) => (
            <div key={src} className="relative w-full shrink-0 snap-center aspect-[4/5] bg-surface">
              <button type="button" onClick={() => setLightbox(i)} className="absolute inset-0 border-0 p-0 bg-transparent" aria-label={`Open photo ${i + 1} full screen`}>
                <Image src={src} alt={`${name}, photo ${i + 1}`} fill priority={i === 0} sizes="100vw" className="object-cover" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-2">
          {photos.map((src, i) => (
            <span key={src} className={cx('h-px w-8 transition-colors', i === active ? 'bg-ink' : 'bg-ink/20')} />
          ))}
        </div>
      </div>

      {/* Desktop: editorial two-up grid with hover zoom */}
      <div className="hidden lg:grid grid-cols-2 gap-2">
        {photos.map((src, i) => (
          <ZoomPhoto key={src} src={src} alt={`${name}, photo ${i + 1}`} priority={i === 0} onOpen={() => setLightbox(i)} />
        ))}
      </div>

      <Dialog fullScreen open={lightbox !== null} onClose={() => setLightbox(null)} PaperProps={{ sx: { bgcolor: 'background.default' } }}>
        {lightbox !== null && (
          <div className="relative h-full w-full">
            <Image src={photos[lightbox]} alt={`${name}, photo ${lightbox + 1}`} fill sizes="100vw" className="object-contain" />
            <div className="absolute top-3 right-3 flex items-center gap-3">
              <span className="label text-mute">{lightbox + 1} / {photos.length}</span>
              <IconButton onClick={() => setLightbox(null)} aria-label="Close" sx={{ bgcolor: 'background.default' }}><CloseOutlinedIcon /></IconButton>
            </div>
            {photos.length > 1 && (
              <>
                <IconButton onClick={() => step(-1)} aria-label="Previous photo" sx={{ position: 'absolute', left: 12, top: '50%', bgcolor: 'background.default' }}><ArrowBackIosNewOutlinedIcon fontSize="small" /></IconButton>
                <IconButton onClick={() => step(1)} aria-label="Next photo" sx={{ position: 'absolute', right: 12, top: '50%', bgcolor: 'background.default' }}><ArrowForwardIosOutlinedIcon fontSize="small" /></IconButton>
              </>
            )}
          </div>
        )}
      </Dialog>
    </div>
  );
}
