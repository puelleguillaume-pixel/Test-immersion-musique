interface MarqueeProps {
  items: string[];
  className?: string;
}

export function Marquee({ items, className }: MarqueeProps) {
  const doubled = [...items, ...items];
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`}>
      <div className="inline-flex animate-marquee gap-10">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-sm uppercase tracking-[0.35em] text-ivoire/40"
          >
            {item} <span className="text-cuir-bright">●</span>
          </span>
        ))}
      </div>
    </div>
  );
}
