import Image from 'next/image';
import Hero from '@/components/home/Hero';
import CategoryTiles from '@/components/home/CategoryTiles';
import EditorsPicks from '@/components/home/EditorsPicks';
import CollectionsSplit from '@/components/home/CollectionsSplit';
import Lookbook from '@/components/home/Lookbook';
import StreetGrid from '@/components/home/StreetGrid';
import Values from '@/components/home/Values';
import Newsletter from '@/components/home/Newsletter';
import Reveal from '@/components/ui/Reveal';
import { api } from '@/lib/api';
import { photoFor } from '@/lib/media';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [featured, categories, collections, lookbook] = await Promise.all([
    api.listProducts({ featured: 'true', limit: 8 }),
    api.categories(),
    api.collections(),
    api.lookbook(),
  ]);
  // Featured has fewer than 8 items: top up with the rest of the catalogue so the grid stays full.
  let picks = featured.data;
  if (picks.length < 8) {
    const rest = await api.listProducts({ sort: 'rating', limit: 16 });
    picks = [...picks, ...rest.data.filter((p) => !picks.some((f) => f.id === p.id))].slice(0, 8);
  }

  return (
    <>
      <Hero />
      <CategoryTiles categories={categories} />
      <EditorsPicks products={picks} />
      <CollectionsSplit collections={collections} />
      <Lookbook stories={lookbook} />
      <StreetGrid />
      <section className="wrap pt-20 md:pt-28">
        <Reveal>
          <div className="row g-0 bg-surface">
            <div className="col-12 col-md-5 relative min-h-[320px]">
              <Image src={photoFor({ slug: 'velvet-midi-dress' })} alt="" fill sizes="(max-width: 768px) 100vw, 40vw" className="object-cover" />
            </div>
            <div className="col-12 col-md-7 p-6 p-md-5 flex items-center">
              <div className="w-full max-w-lg mx-auto py-md-5"><Newsletter /></div>
            </div>
          </div>
        </Reveal>
      </section>
      <Values />
    </>
  );
}
