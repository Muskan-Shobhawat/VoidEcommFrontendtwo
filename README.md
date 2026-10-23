# VOID. — The Edit (demo 2)

A second storefront design for the VOID. clothing demo: light, editorial and photo-led, with no 3D.
It uses the **same backend** as the 3D demo (`ecomm_demo_backend`): same catalogue, cart pricing, accounts and orders.

Stack: Next.js 14 (App Router) · MUI 6 · Tailwind 3 · Bootstrap 5 · framer-motion · zustand.

## Run locally

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5001/api
npm run dev                  # http://localhost:3002
```

The backend must allow this origin: add `http://localhost:3002` (and the deployed URL) to its `CLIENT_ORIGIN`.
If the backend is down, the site falls back to bundled sample data and browser-only accounts, like demo 1.

## How photos work

The backend's `images` point at the 3D demo's renders, so this demo looks photos up **by product slug** in
`src/lib/media.js` (`/public/images/products/<slug>-1.jpg`, `-2.jpg`). Editorial shots (hero, categories,
collections, lookbook, mosaic) live in `/public/images/editorial`. To swap in the client's own shoots, replace
the files and keep the names and the 4:5 crop.

## Photo credits

All photos are from [Unsplash](https://unsplash.com) under the Unsplash License (free for commercial use, no attribution required).
Source IDs (`https://images.unsplash.com/photo-<id>`):

| File | Unsplash photo id |
| --- | --- |
| `products/orbit-oversized-tee-1.jpg` | `1571455786673-9d9d6c194f90` |
| `products/orbit-oversized-tee-2.jpg` | `1762914395034-67c2f8c73c59` |
| `products/eclipse-heavy-tee-1.jpg` | `1776997155893-2fdccbc50d0d` |
| `products/eclipse-heavy-tee-2.jpg` | `1771894431313-6d442f2a50a1` |
| `products/signal-boxy-tee-1.jpg` | `1777901513094-f8b4ca262d57` |
| `products/signal-boxy-tee-2.jpg` | `1780565336242-b7d1638c56cb` |
| `products/lunar-relaxed-tee-1.jpg` | `1789867650435-2424bac80f41` |
| `products/lunar-relaxed-tee-2.jpg` | `1762291629616-3e2c044c79a0` |
| `products/gravity-tech-hoodie-1.jpg` | `1578768079052-aa76e52ff62e` |
| `products/gravity-tech-hoodie-2.jpg` | `1609885654455-f81e5a682c87` |
| `products/ember-flame-hoodie-1.jpg` | `1513789181297-6f2ec112c0bc` |
| `products/ember-flame-hoodie-2.jpg` | `1647540573277-4954a0c302c5` |
| `products/night-shift-hoodie-1.jpg` | `1573156555591-189ac70df8fb` |
| `products/night-shift-hoodie-2.jpg` | `1647610229306-3906b8f72539` |
| `products/halo-oversized-hoodie-1.jpg` | `1633292750937-120a94f5c2bb` |
| `products/halo-oversized-hoodie-2.jpg` | `1608673670133-4e2efaa43c44` |
| `products/monolith-leather-jacket-1.jpg` | `1770652901157-4b9010586fe2` |
| `products/monolith-leather-jacket-2.jpg` | `1683609553620-d85c01bc2ba5` |
| `products/axis-moto-jacket-1.jpg` | `1792001706684-2d061fb55542` |
| `products/axis-moto-jacket-2.jpg` | `1762287517767-2a5dbd819a3e` |
| `products/rider-leather-jacket-1.jpg` | `1786053257282-f1daeaac1cf2` |
| `products/rider-leather-jacket-2.jpg` | `1786053252246-8b92029090a3` |
| `products/noir-cropped-biker-1.jpg` | `1775900047843-af687d4f3890` |
| `products/noir-cropped-biker-2.jpg` | `1760595968567-c5b981a8d6df` |
| `products/aurora-slip-dress-1.jpg` | `1790896343297-8f87340bc470` |
| `products/aurora-slip-dress-2.jpg` | `1704775991534-563c1d548f88` |
| `products/velvet-midi-dress-1.jpg` | `1771620955160-b7ab0740136d` |
| `products/velvet-midi-dress-2.jpg` | `1704775983177-8ae543524081` |
| `products/lilac-flare-dress-1.jpg` | `1776111885208-c7f243c0c9dc` |
| `products/lilac-flare-dress-2.jpg` | `1774379457574-692fd39c4315` |
| `products/emerald-tea-dress-1.jpg` | `1761084490411-077dcd762609` |
| `products/emerald-tea-dress-2.jpg` | `1786947400433-7eb134374a8d` |
| `editorial/hero-1.jpg` | `1605763240000-7e93b172d754` |
| `editorial/hero-2.jpg` | `1626497764746-6dc36546b388` |
| `editorial/hero-3.jpg` | `1509631179647-0177331693ae` |
| `editorial/cat-tees.jpg` | `1594751684241-bcef815d5a57` |
| `editorial/cat-hoodies.jpg` | `1579572331145-5e53b299c64e` |
| `editorial/cat-jackets.jpg` | `1592158249887-ac6ae7921691` |
| `editorial/cat-dresses.jpg` | `1779912217733-0b7df75b5083` |
| `editorial/men.jpg` | `1789141297944-8ebfd488b647` |
| `editorial/women.jpg` | `1595065666634-4725aa7e8379` |
| `editorial/lb-outerwear-1.jpg` | `1663343683182-70885ae0a792` |
| `editorial/lb-outerwear-2.jpg` | `1764973636371-a31bb5ff41d3` |
| `editorial/lb-outerwear-3.jpg` | `1771512682056-83a44fb73efa` |
| `editorial/lb-women-1.jpg` | `1779912217695-807c97b7e79b` |
| `editorial/lb-women-2.jpg` | `1779912217723-73b7cb98c0bc` |
| `editorial/lb-women-3.jpg` | `1760439427505-70b4353451ce` |
| `editorial/lb-basics-1.jpg` | `1450133064473-71024230f91b` |
| `editorial/lb-basics-2.jpg` | `1789938680760-5d630f611bc3` |
| `editorial/lb-basics-3.jpg` | `1647797819874-f51a8a8fc5c0` |
| `editorial/wild-1.jpg` | `1721713168896-11db10d9740b` |
| `editorial/wild-2.jpg` | `1741742641803-7ce34d532baf` |
| `editorial/wild-3.jpg` | `1687864472792-9e603e2b36db` |
| `editorial/wild-4.jpg` | `1634756988236-8c06ce9fa1f0` |
| `editorial/wild-5.jpg` | `1762232976182-48bf8ce16088` |
| `editorial/wild-6.jpg` | `1521794286957-348245b517a0` |

### Hero videos

The homepage hero plays three vertical clips from [Mixkit](https://mixkit.co) (Mixkit Free License). Each was downloaded at 1080×1920, trimmed to its first 10 seconds and re-encoded as H.264 at about 4 Mbps with no audio, into `public/videos/`. The hero photos above are no longer used there.

| File | Mixkit clip |
| --- | --- |
| `videos/mixkit-34404.mp4` | [Woman posing for the camera in the middle of a desert](https://mixkit.co/free-stock-video/woman-posing-for-the-camera-in-the-middle-of-a-34404/) |
| `videos/mixkit-41489.mp4` | [Model wearing old fashion in an old and worn place](https://mixkit.co/free-stock-video/model-wearing-old-fashion-in-an-old-and-worn-place-41489/) |
| `videos/mixkit-52278.mp4` | [Woman in a white dress and red boots posing over a white background](https://mixkit.co/free-stock-video/a-young-beautiful-woman-wearing-a-white-dress-and-vibrant-52278/) |

The homepage Women / Men panels use two more clips, prepared the same way (landscape 1080p, 10s, ~4 Mbps), each with its first frame saved as a `.jpg` poster:

| File | Mixkit clip |
| --- | --- |
| `videos/mixkit-806.mp4` | [Woman modelling dress in a studio](https://mixkit.co/free-stock-video/woman-modelling-dress-in-a-studio-806/) |
| `videos/mixkit-41480.mp4` | [Young man modeling old fashion style](https://mixkit.co/free-stock-video/young-man-modeling-old-fashion-style-41480/) |
