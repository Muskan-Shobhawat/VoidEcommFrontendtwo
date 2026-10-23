import Link from 'next/link';
import Reveal from '@/components/ui/Reveal';
import LoopVideo from '@/components/ui/LoopVideo';
import { COLLECTION_VIDEOS } from '@/lib/media';

export default function CollectionsSplit({ collections }) {
  // Women first: it leads the editorial story.
  const ordered = [...collections].sort((a, b) => (b.slug === 'women') - (a.slug === 'women'));
  return (
    <section className="pt-20 md:pt-28">
      <div className="grid md:grid-cols-2 gap-px bg-ink/10">
        {ordered.map((c, i) => (
          <Link key={c.slug} href={`/shop?gender=${c.slug}`} className="group relative block aspect-[4/5] md:aspect-[5/6] overflow-hidden bg-coal">
            <LoopVideo {...COLLECTION_VIDEOS[c.slug]} lazy className="opacity-90 transition-transform duration-[1.6s] ease-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            <Reveal delay={i * 0.1} className="absolute inset-x-0 bottom-0 p-6 md:p-12 text-ivory">
              <p className="label mb-3 opacity-80">{c.count} pieces · {c.tagline}</p>
              <h3 className="font-serif text-6xl md:text-8xl leading-none m-0">{c.name}</h3>
              <p className="mt-4 max-w-sm text-ivory/80 hidden sm:block">{c.description}</p>
              <span className="label mt-6 inline-block link-draw">Discover the collection →</span>
            </Reveal>
          </Link>
        ))}
      </div>
    </section>
  );
}
