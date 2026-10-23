const MESSAGES = ['Complimentary shipping over ₹2,999', '30-day returns', 'The Autumn Edit is here', 'Members get early access'];

/** Thin scrolling strip above the header. */
export default function AnnouncementBar() {
  const row = [...MESSAGES, ...MESSAGES];
  return (
    <div className="bg-coal text-ivory overflow-hidden">
      <div className="flex w-max animate-ticker py-2">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0" aria-hidden={k === 1}>
            {row.map((m, i) => (
              <span key={i} className="label px-8 text-[0.62rem] opacity-90">{m}<span className="ml-16 opacity-40">✕</span></span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
