import Link from 'next/link';
import Newsletter from '@/components/home/Newsletter';
import Wordmark from '@/components/ui/Wordmark';

const COLUMNS = [
  { title: 'Shop', links: [['Women', '/shop?gender=women'], ['Men', '/shop?gender=men'], ['New In', '/shop?isNew=true'], ['Limited', '/shop?tag=limited']] },
  { title: 'Help', links: [['Your account', '/account'], ['Your bag', '/cart'], ['Shipping'], ['Returns']] },
  { title: 'House', links: [['Our story'], ['Journal'], ['Stores'], ['Careers']] },
];

export default function Footer() {
  return (
    <footer className="mt-24 md:mt-32 border-t hairline">
      <div className="wrap py-14 md:py-20">
        <div className="row g-4 g-lg-5">
          <div className="col-12 col-lg-4">
            <Newsletter compact />
            <p className="text-sm text-mute mt-6 max-w-xs">Considered clothing for men and women. Made to be worn often and kept for years.</p>
          </div>
          {COLUMNS.map((col) => (
            <div key={col.title} className="col-6 col-md-4 col-lg-2">
              <p className="label text-mute mb-4">{col.title}</p>
              <ul className="list-unstyled flex flex-col gap-2.5 m-0 text-sm">
                {col.links.map(([label, href]) => (
                  <li key={label}>{href ? <Link href={href} className="link-draw">{label}</Link> : <span className="text-mute">{label}</span>}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-16 md:mt-24 overflow-hidden">
          <Wordmark className="block text-[22vw] lg:text-[17rem] tracking-[0.12em] leading-[0.8] text-center" />
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t hairline pt-6 text-xs text-mute">
          <span>© {new Date().getFullYear()} VOID. Demo only — no real orders are processed.</span>
          <span>Photography via Unsplash · Next.js · MUI · Tailwind · Bootstrap</span>
        </div>
      </div>
    </footer>
  );
}
