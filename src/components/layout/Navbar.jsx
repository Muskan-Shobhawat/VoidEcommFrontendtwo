'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { cx } from '@/lib/format';
import { CATEGORY_PHOTOS } from '@/lib/media';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Wordmark from '@/components/ui/Wordmark';

const LINKS = [
  { href: '/shop?isNew=true', label: 'New In' },
  { href: '/shop?gender=women', label: 'Women' },
  { href: '/shop?gender=men', label: 'Men' },
  { href: '/shop', label: 'Shop All' },
];
const MENU_CATEGORIES = [
  { href: '/shop?category=dresses', label: 'Dresses', img: CATEGORY_PHOTOS.dresses },
  { href: '/shop?category=jackets', label: 'Jackets', img: CATEGORY_PHOTOS.jackets },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const user = useAuth((s) => s.user);
  const signedIn = hydrated && !!user;

  useEffect(() => {
    setHydrated(true);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={cx('sticky top-0 z-40 bg-paper border-b transition-[border-color,box-shadow] duration-300', scrolled ? 'hairline shadow-[0_8px_30px_-20px_rgba(0,0,0,0.4)]' : 'border-transparent')}>
      <nav className={cx('wrap grid grid-cols-[1fr_auto_1fr] items-center transition-[padding] duration-300', scrolled ? 'py-2' : 'py-3 md:py-5')}>
        <div className="flex items-center gap-1">
          <IconButton className="lg:!hidden" onClick={() => setOpen(true)} aria-label="Open menu" sx={{ color: 'text.primary', ml: -1 }}>
            <MenuOutlinedIcon />
          </IconButton>
          <ul className="hidden lg:flex items-center gap-8 list-unstyled m-0">
            {LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="label link-draw">{l.label}</Link></li>
            ))}
          </ul>
        </div>

        <Link href="/" aria-label="VOID. home" className="justify-self-center">
          <Wordmark className={cx('transition-[font-size] duration-300', scrolled ? 'text-2xl' : 'text-2xl md:text-4xl')} />
        </Link>

        <div className="flex items-center justify-end gap-0.5">
          <span className="hidden md:inline-flex"><ThemeToggle /></span>
          <Link href="/shop" aria-label="Search" className="hidden sm:inline-flex">
            <IconButton sx={{ color: 'text.primary' }} tabIndex={-1}><SearchOutlinedIcon fontSize="small" /></IconButton>
          </Link>
          <Link href={signedIn ? '/account' : '/login'} aria-label={signedIn ? 'Your account' : 'Sign in'} className="hidden sm:inline-flex">
            <IconButton sx={{ color: 'text.primary' }} tabIndex={-1}><PersonOutlineOutlinedIcon fontSize="small" /></IconButton>
          </Link>
          <button type="button" onClick={openCart} aria-label="Open bag" className="label bg-transparent border-0 pl-2 pr-0 py-2 link-draw">
            Bag ({hydrated ? count : 0})
          </button>
        </div>
      </nav>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: '88vw', maxWidth: 420, p: 3, display: 'flex', flexDirection: 'column' } }}>
        <div className="flex items-center justify-between mb-10">
          <Wordmark className="text-3xl" />
          <IconButton onClick={() => setOpen(false)} aria-label="Close menu"><CloseOutlinedIcon /></IconButton>
        </div>
        <ul className="list-unstyled flex flex-col gap-3 m-0">
          {LINKS.map((l) => (
            <li key={l.href} className="border-b hairline pb-3">
              <Link href={l.href} className="font-serif text-2xl hover:italic">{l.label}</Link>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-2 gap-3 mt-8">
          {MENU_CATEGORIES.map((c) => (
            <Link key={c.href} href={c.href} className="group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt="" className="aspect-[4/5] w-full object-cover" />
              <span className="label mt-2 block link-draw w-max">{c.label}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 flex flex-col items-start gap-4">
          <Link href={signedIn ? '/account' : '/login'} className="inline-flex items-center gap-2 label text-mute hover:text-ink">
            <PersonOutlineOutlinedIcon fontSize="small" /> {signedIn ? 'Account & orders' : 'Sign in'}
          </Link>
          <ThemeToggle withLabel />
        </div>
        <p className="mt-auto pt-8 text-xs text-mute">Demo build · sample data</p>
      </Drawer>
    </header>
  );
}
