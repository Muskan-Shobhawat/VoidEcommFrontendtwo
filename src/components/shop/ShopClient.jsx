'use client';
import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ViewModuleOutlinedIcon from '@mui/icons-material/ViewModuleOutlined';
import ProductCard from '@/components/product/ProductCard';
import { money, cx } from '@/lib/format';
import LoopVideo from '@/components/ui/LoopVideo';
import { COLLECTION_PHOTOS, COLLECTION_VIDEOS, CATEGORY_PHOTOS } from '@/lib/media';

const GENDERS = [
  { v: 'all', l: 'All' },
  { v: 'women', l: 'Women' },
  { v: 'men', l: 'Men' },
];
const SORTS = [
  { v: 'featured', l: 'Featured' },
  { v: 'newest', l: 'Newest' },
  { v: 'price-asc', l: 'Price, low to high' },
  { v: 'price-desc', l: 'Price, high to low' },
  { v: 'rating', l: 'Top rated' },
];

/** Text-style filter option: underlined when active. */
const Option = ({ active, onClick, children }) => (
  <button type="button" onClick={onClick} className={cx('bg-transparent border-0 p-0 text-left text-sm transition-colors', active ? 'text-ink underline underline-offset-[6px] decoration-1' : 'text-mute hover:text-ink')}>
    {children}
  </button>
);

export default function ShopClient({ products, total, categories, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [open, setOpen] = useState(false);
  const [dense, setDense] = useState(false);
  const [price, setPrice] = useState([Number(params.minPrice) || 0, Number(params.maxPrice) || 12000]);
  const [search, setSearch] = useState(params.search || '');

  useEffect(() => setSearch(params.search || ''), [params.search]);

  const update = useCallback(
    (patch) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '' || v === 'all' || v === false) next.delete(k);
        else next.set(k, String(v));
      });
      router.push(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [sp, pathname, router]
  );

  const activeCats = params.category === 'all' ? [] : params.category.split(',');
  const toggleCat = (slug) => {
    const set = new Set(activeCats);
    set.has(slug) ? set.delete(slug) : set.add(slug);
    update({ category: [...set].join(',') || 'all' });
  };

  const clearAll = () => router.push(pathname, { scroll: false });
  const single = activeCats.length === 1 ? categories.find((c) => c.slug === activeCats[0]) : null;
  const title = params.search ? `“${params.search}”` : single ? single.name : params.isNew === 'true' ? 'New In' : params.gender === 'all' ? 'All Clothing' : params.gender === 'men' ? 'Men' : 'Women';
  const banner = single ? CATEGORY_PHOTOS[single.slug] : COLLECTION_PHOTOS[params.gender];
  // Women / Men get the same clip as their homepage panel; categories keep a photo.
  const bannerVideo = !single && COLLECTION_VIDEOS[params.gender];

  const Filters = (
    <div className="flex flex-col gap-9">
      <div>
        <p className="label text-mute mb-2">Search</p>
        <form onSubmit={(e) => { e.preventDefault(); update({ search }); }}>
          <input className="form-control" placeholder="Search the collection" value={search} onChange={(e) => setSearch(e.target.value)} />
        </form>
      </div>
      <div>
        <p className="label text-mute mb-3">Collection</p>
        <div className="flex flex-col items-start gap-2">
          {GENDERS.map((g) => <Option key={g.v} active={params.gender === g.v} onClick={() => update({ gender: g.v, category: 'all' })}>{g.l}</Option>)}
        </div>
      </div>
      <div>
        <p className="label text-mute mb-3">Category</p>
        <div className="flex flex-col items-start gap-2">
          {categories.map((c) => (
            <Option key={c.slug} active={activeCats.includes(c.slug)} onClick={() => toggleCat(c.slug)}>
              {c.name} <span className="text-mute text-xs">({c.count})</span>
            </Option>
          ))}
        </div>
      </div>
      <div>
        <p className="label text-mute mb-3">Price · {money(price[0])} – {money(price[1])}</p>
        <div className="px-1">
          <Slider size="small" value={price} min={0} max={12000} step={500} onChange={(_, v) => setPrice(v)} onChangeCommitted={(_, v) => update({ minPrice: v[0] || '', maxPrice: v[1] >= 12000 ? '' : v[1] })} sx={{ color: 'text.primary' }} />
        </div>
      </div>
      <div>
        <p className="label text-mute mb-3">Edit</p>
        <div className="flex flex-col items-start gap-2">
          <Option active={params.isNew === 'true'} onClick={() => update({ isNew: params.isNew === 'true' ? '' : 'true' })}>New arrivals</Option>
          <Option active={params.tag === 'limited'} onClick={() => update({ tag: params.tag === 'limited' ? '' : 'limited' })}>Limited edition</Option>
        </div>
      </div>
      <button type="button" onClick={clearAll} className="label bg-transparent border-0 p-0 text-left link-draw w-max">Clear all</button>
    </div>
  );

  return (
    <div>
      {/* Header band: photo when browsing a collection or category */}
      <div className={cx('relative overflow-hidden', banner ? 'h-[34vh] min-h-[240px] bg-coal text-ivory' : 'pt-10 md:pt-16')}>
        {banner && (
          <>
            {bannerVideo
              ? <LoopVideo key={bannerVideo.src} {...bannerVideo} focus={`${bannerVideo.focus.split(' ')[0]} 25%`} className="opacity-75" />
              : <Image src={banner} alt="" fill priority sizes="100vw" className="object-cover object-[50%_30%] opacity-75" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </>
        )}
        <div className={cx('wrap relative', banner && 'h-full flex flex-col justify-end pb-8')}>
          <p className={cx('label mb-2', banner ? 'opacity-80' : 'text-clay')}>Shop</p>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] m-0">{title}</h1>
        </div>
      </div>

      <div className="wrap">
        <div className="sticky top-[57px] z-20 bg-paper flex items-center justify-between gap-3 border-b hairline py-3 mt-6">
          <div className="flex items-center gap-4">
            <button type="button" className="lg:hidden label bg-transparent border-0 p-0 link-draw" onClick={() => setOpen(true)}>Filter</button>
            <span className="text-sm text-mute">{total} {total === 1 ? 'piece' : 'pieces'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Select variant="standard" disableUnderline size="small" value={params.sort} onChange={(e) => update({ sort: e.target.value })} sx={{ fontSize: 13, minWidth: 150 }} renderValue={(v) => <span><span className="text-mute">Sort: </span>{SORTS.find((s) => s.v === v)?.l}</span>}>
              {SORTS.map((s) => <MenuItem key={s.v} value={s.v} sx={{ fontSize: 13 }}>{s.l}</MenuItem>)}
            </Select>
            <IconButton size="small" onClick={() => setDense((d) => !d)} aria-label={dense ? 'Larger photos' : 'More per row'} className="hidden md:inline-flex">
              {dense ? <GridViewOutlinedIcon fontSize="small" /> : <ViewModuleOutlinedIcon fontSize="small" />}
            </IconButton>
          </div>
        </div>

        <div className="row g-4 g-lg-5 mt-1">
          <aside className="col-lg-3 col-xl-2 d-none d-lg-block">
            <div className="sticky top-32 pt-2">{Filters}</div>
          </aside>
          <div className="col-12 col-lg-9 col-xl-10">
            {products.length === 0 ? (
              <div className="py-24 text-center">
                <p className="font-serif text-4xl">Nothing matched.</p>
                <p className="text-mute">Try widening your filters.</p>
                <Button variant="outlined" onClick={clearAll} sx={{ mt: 2 }}>Reset filters</Button>
              </div>
            ) : (
              <div className="row g-3 g-md-4 gy-5 pt-2">
                {products.map((p, i) => (
                  <div className={dense ? 'col-6 col-md-3' : 'col-6 col-md-4'} key={p.id}>
                    <ProductCard product={p} priority={i < 3} sizes={dense ? '(max-width: 768px) 50vw, 20vw' : '(max-width: 768px) 50vw, 28vw'} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Drawer anchor="left" open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { width: '88vw', maxWidth: 380, p: 3 } }}>
        <div className="flex items-center justify-between mb-8">
          <p className="font-serif text-3xl m-0">Filter</p>
          <IconButton onClick={() => setOpen(false)} aria-label="Close filters"><CloseOutlinedIcon /></IconButton>
        </div>
        {Filters}
        <Button variant="contained" fullWidth sx={{ mt: 4 }} onClick={() => setOpen(false)}>Show {total} pieces</Button>
      </Drawer>
    </div>
  );
}
