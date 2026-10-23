import Skeleton from '@mui/material/Skeleton';
import { money } from '@/lib/format';

const Cell = ({ value, width = 60 }) => (value === null ? <Skeleton width={width} sx={{ ml: 'auto' }} /> : value);

/** Subtotal / shipping / tax / total rows; shows skeletons until the API has priced the bag. */
export default function Summary({ summary, taxLabel = 'Tax (est.)' }) {
  const v = (fn) => (summary ? fn(summary) : null);
  return (
    <table className="table table-borderless mb-0 text-sm">
      <tbody>
        <tr><td className="text-mute ps-0">Subtotal</td><td className="text-end pe-0"><Cell value={v((s) => money(s.subtotal))} /></td></tr>
        <tr><td className="text-mute ps-0">Shipping</td><td className="text-end pe-0"><Cell value={v((s) => (s.shipping === 0 ? 'Complimentary' : money(s.shipping)))} /></td></tr>
        <tr><td className="text-mute ps-0">{taxLabel}</td><td className="text-end pe-0"><Cell value={v((s) => money(s.tax))} /></td></tr>
        <tr className="border-top"><td className="ps-0 pt-3 label align-bottom">Total</td><td className="text-end pe-0 pt-3 font-serif text-3xl"><Cell value={v((s) => money(s.total))} width={90} /></td></tr>
      </tbody>
    </table>
  );
}
