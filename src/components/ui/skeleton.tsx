import { cn } from "@/lib/cn";

interface SkeletonProps {
  className?: string;
}

/** Generic shimmer skeleton for loading states */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-navy-100/60",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** Skeleton for a card with image, title, and body */
export function CardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-lg overflow-hidden border border-ivory-400", className)}>
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}

/** Skeleton for a news article list item */
export function ArticleSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("flex gap-4 py-4 border-b border-ivory-400", className)}>
      <Skeleton className="h-20 w-20 flex-shrink-0 rounded" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  );
}

/** Skeleton for a team member card */
export function TeamMemberSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("text-center space-y-3", className)}>
      <Skeleton className="h-40 w-40 rounded-full mx-auto" />
      <Skeleton className="h-5 w-32 mx-auto" />
      <Skeleton className="h-4 w-24 mx-auto" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6 mx-auto" />
    </div>
  );
}
