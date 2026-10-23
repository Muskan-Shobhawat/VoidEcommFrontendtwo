/**
 * Photography for this storefront. The shared backend's `images` point at the 3D demo's renders,
 * so this demo looks photos up by product slug instead (same catalogue, different media).
 * All photos are from Unsplash (Unsplash License); see README for the source list.
 */
const product = (slug) => [`/images/products/${slug}-1.jpg`, `/images/products/${slug}-2.jpg`];

const SLUGS = [
  'orbit-oversized-tee', 'eclipse-heavy-tee', 'signal-boxy-tee', 'lunar-relaxed-tee',
  'gravity-tech-hoodie', 'ember-flame-hoodie', 'night-shift-hoodie', 'halo-oversized-hoodie',
  'monolith-leather-jacket', 'axis-moto-jacket', 'rider-leather-jacket', 'noir-cropped-biker',
  'aurora-slip-dress', 'velvet-midi-dress', 'lilac-flare-dress', 'emerald-tea-dress',
];
const PRODUCT_PHOTOS = Object.fromEntries(SLUGS.map((s) => [s, product(s)]));

const FALLBACK = '/images/editorial/wild-4.jpg';

/** All photos for a product (or anything with a `slug`, like a cart or order line). */
export const photosFor = (item) => PRODUCT_PHOTOS[item?.slug] || [FALLBACK];
export const photoFor = (item) => photosFor(item)[0];

const ed = (name) => `/images/editorial/${name}.jpg`;

/**
 * Vertical 1080×1920 Mixkit clips (Mixkit Free License), trimmed to 10s and re-encoded at ~4 Mbps.
 * `focus` is the object-position that keeps the subject in frame. The middle clip sits under the
 * hero copy, so it should stay dark at the bottom.
 */
export const HERO_VIDEOS = [
  { src: '/videos/mixkit-34404.mp4', focus: '50% 40%' },
  { src: '/videos/mixkit-41489.mp4', focus: '50% 50%' },
  { src: '/videos/mixkit-52278.mp4', focus: '50% 60%' },
];

export const CATEGORY_PHOTOS = { tees: ed('cat-tees'), hoodies: ed('cat-hoodies'), jackets: ed('cat-jackets'), dresses: ed('cat-dresses') };

export const COLLECTION_PHOTOS = { men: ed('men'), women: ed('women') };

/** Homepage Women / Men panels: 1080p Mixkit clips (10s, ~4 Mbps) with their first frame as the poster. */
export const COLLECTION_VIDEOS = {
  women: { src: '/videos/mixkit-806.mp4', poster: '/videos/mixkit-806.jpg', focus: '35% 50%' },
  men: { src: '/videos/mixkit-41480.mp4', poster: '/videos/mixkit-41480.jpg', focus: '55% 50%' },
};

/** Lookbook stories by the backend's lookbook ids. */
export const LOOKBOOK_PHOTOS = {
  'lb-1': [ed('lb-outerwear-1'), ed('lb-outerwear-2'), ed('lb-outerwear-3')],
  'lb-2': [ed('lb-women-1'), ed('lb-women-2'), ed('lb-women-3')],
  'lb-3': [ed('lb-basics-1'), ed('lb-basics-2'), ed('lb-basics-3')],
};

export const STREET_PHOTOS = [1, 2, 3, 4, 5, 6].map((i) => ed(`wild-${i}`));
