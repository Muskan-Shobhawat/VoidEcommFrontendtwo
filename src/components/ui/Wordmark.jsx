import { cx } from '@/lib/format';

/** The VOID. wordmark set in the editorial serif. */
export default function Wordmark({ className = '' }) {
  return (
    <span className={cx('font-serif font-medium tracking-[0.28em] leading-none', className)}>
      VOID<span className="text-clay">.</span>
    </span>
  );
}
