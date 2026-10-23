import Link from 'next/link';
import Image from 'next/image';
import Reveal from '@/components/ui/Reveal';
import SectionTitle from '@/components/ui/SectionTitle';
import { CATEGORY_PHOTOS } from '@/lib/media';

export default function CategoryTiles({ categories }) {
  return (
    <section className="wrap pt-20 md:pt-28">
      <SectionTitle index="01" eyebrow="Shop by category" title={<>Find your <em>piece</em></>} href="/shop" linkLabel="Shop all" />
      <div className="flex md:grid md:grid-cols-4 gap-3 md:gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-[1.25rem] px-[1.25rem] md:mx-0 md:px-0">
        {categories.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08} className="w-[72vw] sm:w-[44vw] md:w-auto shrink-0 snap-start">
            <Link href={`/shop?category=${c.slug}`} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                <Image src={CATEGORY_PHOTOS[c.slug]} alt={c.name} fill sizes="(max-width: 768px) 72vw, 25vw" className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-[1.25rem] text-ivory flex items-end justify-between">
                  <span className="font-serif text-3xl md:text-4xl">{c.name}</span>
                  <span className="label opacity-80">{c.count} pieces</span>
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
