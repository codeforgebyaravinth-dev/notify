import { cn } from '@/utils/ui';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-neutral-alpha-100 animate-pulse rounded-none', className)} {...props} />;
}

export { Skeleton };
