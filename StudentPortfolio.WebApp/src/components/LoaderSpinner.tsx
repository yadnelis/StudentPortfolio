import { useEffect, useState, type ComponentProps, type FC } from "react";

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
  const [trigger, setTrigger] = useState(false);
  const [_delayedVisible, setVisible] = useState(false);
  const sizeMap: Record<sizes, string> = {
    "3xs": "w-2 [--spinner-width:2px]",
    "2xs": "w-4 [--spinner-width:2px]",
    xs: "w-6",
    sm: "w-8",
    md: "w-12",
    lg: "w-15",
    xl: "w-20",
  };

  const triggerVisible = async () => {
    setTimeout(() => {
      setTrigger((prev) => !prev);
    }, delay);
  };

  useEffect(() => {
    if (visible) {
      triggerVisible();
    } else {
      setVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setVisible(true);
    }
  }, [trigger]);

  const spinner = (
    <i
      className={`inline-block w- loader-spinner ${sizeMap[size]} ${className}`}
      {...rest}
    >
      <span className="sr-only">Loading</span>
    </i>
  );

  return !_delayedVisible ? (
    <></>
  ) : !includeBackground ? (
    spinner
  ) : (
    <>
      <div
        className={`absolute flex h-full w-full bg-white/70 z-10 ${backgroundClassName}`}
      ></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        {spinner}
      </div>
    </>
  );
};
