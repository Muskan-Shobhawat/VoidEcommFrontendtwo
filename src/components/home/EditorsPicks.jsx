import ProductCard from '@/components/product/ProductCard';
import SectionTitle from '@/components/ui/SectionTitle';
import Reveal from '@/components/ui/Reveal';

export default function EditorsPicks({ products }) {
  return (
    <section className="wrap pt-20 md:pt-28">
      <SectionTitle index="02" eyebrow="Editor’s picks" title={<>The pieces we <em>reach for</em></>} href="/shop?sort=featured" />
      <div className="row g-3 g-md-4 gy-5">
        {products.slice(0, 8).map((p, i) => (
          <div className="col-6 col-lg-3" key={p.id}>
            <Reveal delay={(i % 4) * 0.08}><ProductCard product={p} sizes="(max-width: 992px) 50vw, 25vw" /></Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
