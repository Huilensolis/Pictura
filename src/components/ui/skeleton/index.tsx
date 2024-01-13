export function Skeleton({ className }: { className: string }) {
  return (
    <div
      className={`rounded-md bg-neutral-300 dark:bg-neutral-800 animate-pulse transition-colors delay-100 ${className}`}
    />
  );
}