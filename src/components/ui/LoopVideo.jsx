'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/format';

/**
 * Muted, looping background clip that fills its (relative) parent.
 * It starts playing as soon as it mounts, so it runs underneath any intro animation instead of after it.
 * `lazy` waits until the clip is near the viewport before downloading it, showing `poster` until then.
 */
export default function LoopVideo({ src, focus = '50% 50%', poster, lazy = false, className }) {
  const ref = useRef(null);
  const [near, setNear] = useState(!lazy);

  useEffect(() => {
    if (near) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: '400px' });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [near]);

  useEffect(() => { if (near) ref.current?.play().catch(() => {}); }, [near]);

  return (
    <video
      ref={ref}
      src={near ? src : undefined}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={near ? 'auto' : 'none'}
      aria-hidden
      className={cx('absolute inset-0 h-full w-full object-cover', className)}
      style={{ objectPosition: focus }}
    />
  );
}
