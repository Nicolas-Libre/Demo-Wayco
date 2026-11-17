import { Loading_Skeleton } from "@/components/loading/Loading_Skeleton";

export function TripCardSkeleton() {
  return (
    <div className="wayco-card" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Loading_Skeleton className="h-[38px] w-[38px] !rounded-full" />
        <Loading_Skeleton className="h-3 w-32" />
      </div>

      <Loading_Skeleton className="mt-4 h-4 w-48" />
      <Loading_Skeleton className="mt-2 h-3 w-28" />

      <div className="mt-4 flex items-center justify-between">
        <Loading_Skeleton className="h-6 w-24 !rounded-full" />
        <Loading_Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}
