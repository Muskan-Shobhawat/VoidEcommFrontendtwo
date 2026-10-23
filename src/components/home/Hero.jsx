'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoopVideo from '@/components/ui/LoopVideo';
import { HERO_VIDEOS } from '@/lib/media';
import { cx } from '@/lib/format';

const ease = [0.22, 1, 0.36, 1];

/** Triptych of looping clips on wide screens; a slow crossfade between the same clips on phones. */
export default function Hero() {
  const [slide, setSlide] = useState(0);
  // Render only the layout that is on screen, so a phone or desktop downloads one set of clips, not two.
  const [wide, setWide] = useState(null);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    const id = setInterval(() => setSlide((s) => (s + 1) % HERO_VIDEOS.length), 6000);
    return () => { mq.removeEventListener('change', sync); clearInterval(id); };
  }, []);

  return (
    <section className="relative h-[calc(100svh-104px)] min-h-[560px] max-h-[980px] overflow-hidden bg-coal">
      {wide === false && (
        <div className="absolute inset-0">
          {HERO_VIDEOS.map((v, i) => (
            <div key={v.src} className={cx('absolute inset-0 transition-opacity duration-[1.5s]', i === slide ? 'opacity-100' : 'opacity-0')}>
              <LoopVideo {...v} />
            </div>
          ))}
        </div>
      )}
      {wide && (
        <div className="absolute inset-0 grid grid-cols-3 gap-px">
          {HERO_VIDEOS.map((v, i) => (
            <div key={v.src} className="relative overflow-hidden">
              <LoopVideo {...v} />
              {/* the reveal is a curtain lifting off a clip that is already playing */}
              <motion.div className="absolute inset-0 bg-coal origin-top" initial={{ scaleY: 1 }} animate={{ scaleY: 0 }} transition={{ duration: 1.4, delay: 0.15 * i, ease }} />
            </div>
          ))}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-black/10" />

      {/* on md+ the copy sits inside the middle photo, clear of the dividing lines */}
      <div className="relative h-full w-full md:w-1/3 mx-auto px-[1.25rem] md:px-[1.5rem] flex flex-col justify-end items-center text-center text-ivory pb-14 md:pb-20">
        <motion.p className="label mb-4" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.6, ease }}>Autumn / Winter 2026</motion.p>
        <motion.h1 className="font-serif text-[17vw] md:text-[length:min(8vw,8.5rem)] leading-[0.85] m-0 whitespace-nowrap" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.75, ease }}>
          <em>Endless</em>
        </motion.h1>
        <motion.p className="mt-5 max-w-md text-ivory/80" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.1 }}>
          Tailored outerwear, heavyweight basics and fluid dresses, cut to be worn for years.
        </motion.p>
        <motion.div className="mt-8 flex flex-wrap justify-center gap-3" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 1.25, ease }}>
          <Link href="/shop?gender=women" className="label bg-ivory text-coal px-7 py-4 hover:bg-transparent hover:text-ivory border border-ivory transition-colors">Shop Women</Link>
          <Link href="/shop?gender=men" className="label border border-ivory px-7 py-4 hover:bg-ivory hover:text-coal transition-colors">Shop Men</Link>
        </motion.div>
        <div className="md:hidden mt-8 flex gap-2">
          {HERO_VIDEOS.map((v, i) => <span key={v.src} className={cx('h-px w-8 transition-colors', i === slide ? 'bg-ivory' : 'bg-ivory/30')} />)}
        </div>
      </div>
    </section>
  );
}
