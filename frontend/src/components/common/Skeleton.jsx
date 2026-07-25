export default function Skeleton({ rows = 5 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton-shimmer h-10 animate-shimmer rounded-lg" />
      ))}
    </div>
  );
}
