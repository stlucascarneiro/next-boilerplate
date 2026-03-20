export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-muted mb-4 h-20 w-full animate-pulse rounded-md ${className}`}
    />
  );
}
