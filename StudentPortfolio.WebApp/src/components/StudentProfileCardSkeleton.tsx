import type { FC } from "react";
import { Skeleton, type SkeletonProps } from "./Skeleton";

export const StudentProfileCardSkeleton: FC<
  Omit<SkeletonProps, "className">
> = ({ visible, ...props }) => {
  return (
    <Skeleton
      className="h-50 bg-white px-10 w-[90dvw] max-w-300 py-7"
      {...props}
      visible={visible}
    >
      <Skeleton className="h-4 w-1/2 mb-5 bg-slate-300/50" />
      <div className="space-y-7">
        <Skeleton className="h-8" visible={visible} />
        <Skeleton className="h-8" visible={visible} />
      </div>
    </Skeleton>
  );
};
