import type { MantineSize } from "@mantine/core";
import type {
  ComponentProps,
  FC,
  MouseEventHandler,
  ReactElement,
} from "react";
import React, { Children, cloneElement } from "react";
import { tv } from "tailwind-variants";

export interface IconButtonProps extends ComponentProps<"button"> {
  size?: MantineSize;
  children: ReactElement<ComponentProps<"svg">>;
  onClick: MouseEventHandler<HTMLButtonElement>;
  variant?: "default" | "secondary" | "danger";
}

const iconButtonVariants = tv({
  slots: {
    base: "appearance-none p-1 rounded-xs group/iconbutton inline-flex justify-center items-center",
    icon: " group-active/iconbutton::text-gray-950 transition transition-50",
  },
  variants: {
    variant: {
      default: {
        base: "text-stone-600",
        icon: "group-hover/iconbutton:text-gray-400",
      },
      danger: {
        base: "bg-rose-300 text-white active:bg-rose-400 hover:bg-red-400 active:text-red-800",
        icon: "",
      },
      secondary: {
        base: "bg-secondary-100 hover:bg-secondary-200 active:bg-slate-200 text-stone-600 active:text-stone-500 hover:text-stone-700",
      },
    },
    size: {
      xs: { icon: "size-3" },
      sm: { icon: "size-4" },
      md: { icon: "size-5" },
      lg: { icon: "size-6" },
      xl: { icon: "size-8" },
    },
  },
});

export const IconButton: FC<IconButtonProps> = ({
  children,
  size = "sm",
  className,
  variant,
  ...props
}) => {
  const { base: buttonTailwind, icon: iconTailwind } = iconButtonVariants({
    size,
    variant,
  });
  return (
    <button className={buttonTailwind({ className })} {...props}>
      {Children.map(children, (child) =>
        cloneElement(child, {
          className: iconTailwind({
            className: React.Children.only(child).props.className,
          }),
        })
      )}
    </button>
  );
};
