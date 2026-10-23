const VALUES = [
  { t: 'Complimentary shipping', d: 'On every order over ₹2,999, delivered in 3–5 days.' },
  { t: '30-day returns', d: 'Changed your mind? Send it back, no questions asked.' },
  { t: 'Considered materials', d: 'Organic cotton, recycled fleece, vegetable-tanned leather.' },
  { t: 'Made to last', d: 'Reinforced seams and fabrics chosen for years of wear.' },
];

export default function Values() {
  return (
    <section className="wrap pt-20 md:pt-28">
      <div className="grid grid-cols-2 lg:grid-cols-4 border-t hairline">
        {VALUES.map((v, i) => (
          <div key={v.t} className="pt-6 pb-2 pr-6">
            <p className="font-serif text-clay text-2xl m-0">0{i + 1}</p>
            <p className="label mt-3 mb-2">{v.t}</p>
            <p className="text-sm text-mute m-0">{v.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
