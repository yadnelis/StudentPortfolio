import { type ComponentProps, type FC } from "react";
import { useDelayedTrigger } from "../hooks/useDelayedTrigger";
import { cn } from "../utilities/cs";

interface LoaderSpinnerProps extends ComponentProps<"i"> {
  size?: "3xs" | "2xs" | "xs" | "sm" | "md" | "lg" | "xl";
  delay?: number;
  visible?: boolean;
  includeBackground?: boolean;
  backgroundClassName?: string;
}

type sizes = Exclude<LoaderSpinnerProps["size"], undefined>;

export const LoaderSpinner: FC<LoaderSpinnerProps> = ({
  className,
  size = "sm",
  delay = 500,
  visible = false,
  includeBackground = false,
  backgroundClassName,
  ...rest
}) => {
  const [delayedVisible] = useDelayedTrigger(visible, delay);

  const sizeMap: Record<sizes, string> = {
    "3xs": "w-2 ",
    "2xs": "w-4 ",
    xs: "w-6",
    sm: "w-8",
    md: "w-12",
    lg: "w-15",
    xl: "w-20",
  };

  const spinner = (
    <i
      className={`inline-block w- loader-spinner ${sizeMap[size]} ${className} [--spinner-width:2px]`}
      {...rest}
    >
      <span className="sr-only">Loading</span>
    </i>
  );

  return !delayedVisible ? (
    <></>
  ) : !includeBackground ? (
    spinner
  ) : (
    <>
      <div
        className={cn(
          `absolute h-full w-full bg-white/70 z-5 `,
          backgroundClassName
        )}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-6">
        {spinner}
      </div>
    </>
  );
};
