import { cx } from '@/lib/format';

const DAY = 864e5;
const fmt = (d) => d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

/**
 * Demo tracking timeline derived from the order's status and dates
 * (the in-memory backend only stores confirmed / shipped / delivered).
 */
function trackingSteps(order) {
  const placed = new Date(order.createdAt);
  const eta = new Date(`${order.estimatedDelivery}T12:00:00`);
  const steps = [
    { label: 'Ordered', date: placed },
    { label: 'Packed', date: new Date(placed.getTime() + DAY) },
    { label: 'Shipped', date: new Date(placed.getTime() + 2 * DAY) },
    { label: 'Out for delivery', date: eta },
    { label: 'Delivered', date: eta },
  ];
  // Index of the step the parcel is at now.
  let current = { confirmed: 0, shipped: 2, delivered: 4 }[order.status] ?? 0;
  if (order.status === 'confirmed' && Date.now() > steps[1].date.getTime()) current = 1;
  if (order.status === 'shipped' && new Date().toDateString() === eta.toDateString()) current = 3;
  return { steps, current };
}

const headline = (steps, current) =>
  current === 4 ? `Delivered ${fmt(steps[4].date)}` : current === 3 ? 'Out for delivery today' : `Arriving ${fmt(steps[4].date)}`;

export default function OrderTracking({ order }) {
  if (order.status === 'cancelled') return null;
  const { steps, current } = trackingSteps(order);
  const trackingNo = current >= 2 ? `VX${order.id.replace(/\W/g, '').slice(-6)}${order.createdAt.slice(8, 10)}` : null;

  // Explicit [1.25rem] spacing: Bootstrap's !important pb-5 / mb-5 would otherwise win over Tailwind's.
  return (
    <div className="pb-[1.5rem]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-[1.25rem]">
        <p className="m-0 font-serif text-2xl">{headline(steps, current)}</p>
        <p className="m-0 text-xs text-mute">{trackingNo ? <>VOID Express · <span className="text-ink">{trackingNo}</span></> : 'Tracking number once shipped'}</p>
      </div>
      <ol className="list-unstyled m-0 p-0 flex flex-col md:flex-row" aria-label="Delivery progress">
        {steps.map((s, i) => {
          const done = i <= current;
          return (
            <li key={s.label} className="relative flex md:flex-1 md:flex-col gap-3 md:gap-2 pb-[1.25rem] last:pb-0 md:pb-0" aria-current={i === current ? 'step' : undefined}>
              {/* connector to the next step: vertical on phones, horizontal from md up */}
              {i < steps.length - 1 && (
                <span className={cx('absolute left-[4px] top-3 bottom-0 w-px md:left-0 md:top-[4px] md:bottom-auto md:h-px md:w-full', i < current ? 'bg-ink' : 'bg-ink/15')} aria-hidden />
              )}
              <span className={cx('relative z-10 mt-1 md:mt-0 h-[9px] w-[9px] shrink-0 border border-solid', done ? 'border-ink bg-ink' : 'border-ink/30 bg-paper', i === current && 'outline outline-1 outline-offset-2 outline-clay')} aria-hidden />
              <div className="md:pr-3">
                <p className={cx('m-0 label text-[0.6rem]', !done && 'text-mute')}>{s.label}</p>
                <p className="m-0 text-xs text-mute mt-1">{done ? fmt(s.date) : i === steps.length - 1 ? `Expected ${fmt(s.date)}` : 'Pending'}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
