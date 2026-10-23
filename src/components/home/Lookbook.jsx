import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionTitle from '@/components/ui/SectionTitle';
import { LOOKBOOK_PHOTOS } from '@/lib/media';
import { cx } from '@/lib/format';

/** Magazine spreads: one large photo and two small ones per story, alternating sides. */
export default function Lookbook({ stories }) {
  return (
    <section className="wrap pt-20 md:pt-28">
      <SectionTitle index="03" eyebrow="The Journal" title={<>Stories from <em>the season</em></>} />
      <div className="flex flex-col gap-16 md:gap-28">
        {stories.map((s, i) => {
          const [big, small1, small2] = LOOKBOOK_PHOTOS[s.id] || [];
          if (!big) return null;
          const flip = i % 2 === 1;
          return (
            <article key={s.id} className="row g-3 g-md-4 align-items-end">
              <div className={cx('col-12 col-md-7', flip && 'order-md-2')}>
                <Reveal>
                  <Link href={s.link} className="group block relative aspect-[4/5] md:aspect-[6/7] overflow-hidden bg-surface">
                    <Image src={big} alt={s.title} fill sizes="(max-width: 768px) 100vw, 58vw" className="object-cover transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
                  </Link>
                </Reveal>
              </div>
              <div className={cx('col-12 col-md-5', flip && 'order-md-1')}>
                <Reveal delay={0.1}>
                  <p className="label text-clay mb-3">Chapter 0{i + 1} · {s.subtitle}</p>
                  <h3 className="font-serif text-5xl md:text-7xl leading-[0.9] m-0 capitalize">{s.title.toLowerCase()}</h3>
                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {[small1, small2].map((src) => (
                      <div key={src} className="relative aspect-[4/5] overflow-hidden bg-surface">
                        <Image src={src} alt="" fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                  <Link href={s.link} className="label inline-block mt-6 link-draw">Shop the story →</Link>
                </Reveal>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
