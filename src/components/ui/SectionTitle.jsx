import Link from 'next/link';

/** Editorial section heading: small numbered label, serif title, optional link on the right. */
export default function SectionTitle({ index, eyebrow, title, href, linkLabel = 'View all' }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-8 md:mb-12">
      <div>
        <p className="label text-mute mb-3">{index && <span className="text-clay mr-3">{index}</span>}{eyebrow}</p>
        <h2 className="font-serif text-4xl md:text-6xl leading-[0.95] m-0">{title}</h2>
      </div>
      {href && <Link href={href} className="label link-draw">{linkLabel} →</Link>}
    </div>
  );
}
