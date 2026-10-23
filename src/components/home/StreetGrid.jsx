import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import { STREET_PHOTOS } from '@/lib/media';
import { cx } from '@/lib/format';

/** "Worn by you" mosaic; the first and fourth tiles span two rows on wide screens. */
export default function StreetGrid() {
  return (
    <section className="wrap pt-20 md:pt-28">
      <div className="text-center mb-10 md:mb-14">
        <p className="label text-mute mb-3"><span className="text-clay mr-3">04</span>Worn by you</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] m-0"><em>#</em>WearVOID</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-2 md:gap-3 md:h-[78vh] md:max-h-[820px]">
        {STREET_PHOTOS.map((src, i) => (
          <Reveal key={src} delay={(i % 3) * 0.08} className={cx('relative overflow-hidden bg-surface aspect-[4/5] md:aspect-auto', (i === 0 || i === 3) && 'md:row-span-2')}>
            <div className="group absolute inset-0">
              <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-[1.2s] group-hover:scale-105" />
              <span className="absolute left-3 bottom-3 label text-ivory text-[0.58rem] opacity-0 group-hover:opacity-100 transition-opacity">@void.studio</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
