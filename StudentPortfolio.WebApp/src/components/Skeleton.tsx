import type { ComponentProps, FC } from "react";
import { useDelayedTrigger } from "../hooks/useDelayedTrigger";
import { cn } from "../utilities/cs";

export interface SkeletonProps extends ComponentProps<"div"> {
  visible?: boolean;
  delay?: number;
}
export const Skeleton: FC<SkeletonProps> = ({
  className,
  children,
  visible = false,
  delay = 500,
}) => {
  const [delayedVisible] = useDelayedTrigger(visible, delay);
  return (
    delayedVisible && (
      <div
        className={cn(
          "animate-pulse bg-slate-400/50 rounded min-h-2 w-full",
          className
        )}
      >
        {children}
      </div>
    )
  );
};
