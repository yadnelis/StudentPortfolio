import { useEffect, useState, type ComponentProps, type FC } from "react";

interface LoaderDotsProps extends ComponentProps<"i"> {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  delay?: number;
  visible?: boolean;
}

type sizes = Exclude<LoaderDotsProps["size"], undefined>;

export const LoaderDots: FC<LoaderDotsProps> = ({
  className,
  size = "sm",
  visible = false,
  delay = 500,
  ...rest
}) => {
  const [_delayedVisible, setVisible] = useState(visible);
  const sizeMap: Record<sizes, string> = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-5",
  };

  const makeVisible = async () => {
    setTimeout(() => {
      setVisible(true);
    });
  };

  useEffect(() => {
    if (visible) {
      makeVisible();
    } else {
      setVisible(false);
    }
  }, [visible]);
  return !visible ? (
    <></>
  ) : (
    <i className={`loader-dots ${sizeMap[size]} ${className}`} {...rest}>
      <span className="sr-only">Loading</span>
    </i>
  );
};
