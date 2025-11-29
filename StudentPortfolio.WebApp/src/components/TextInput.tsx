import {
  TextInput as MTextInput,
  type TextInputProps as MTextInputProps,
} from "@mantine/core";
import type { LucideProps } from "lucide-react";
import type { FC, ReactElement } from "react";
import { cn } from "../utilities/cs";
import { IconButton, type IconButtonProps } from "./IconButton";

export type textInputValue = string | undefined | readonly string[];

type buttonProps = { icon: ReactElement<Omit<LucideProps, "ref">> } & Omit<
  IconButtonProps,
  "children"
>;

export interface TextInputProps extends Omit<MTextInputProps, "value"> {
  value?: textInputValue;
  leftButton?: buttonProps;
  rightButton?: buttonProps;
  wrapperClassName?: string;
  component?: any;
  classNames?: Record<"input" | "wrapper" | string, string>;
}

export const TextInput: FC<TextInputProps> = ({
  leftButton,
  rightButton,
  size,
  className,
  component,
  wrapperClassName,
  classNames,
  value = "",
  ...props
}) => {
  if (leftButton) {
    props.leftSection = (
      <IconButton size={"sm"} {...leftButton}>
        {leftButton.icon}
      </IconButton>
    );
  }
  if (rightButton) {
    props.rightSection = (
      <IconButton size={"sm"} {...rightButton}>
        {rightButton.icon}
      </IconButton>
    );
  }

  return (
    <MTextInput
      {...props}
      value={value}
      component={component}
      classNames={{
        ...classNames,
        input: cn(
          `bg-white hover:bg-slate-50 p-2 border-gray-200 rounded-xs border-2 focus:ring-blue-200/50 focus:ring-2 focus:border-gray-300 outline-none`,
          className
        ),
        section: cn(
          "inline-flex absolute h-full [&[data-position=right]]:right-0 [&[data-position=left]]:left-0 px-2",
          classNames?.section
        ),
        wrapper: cn("relative w-full", classNames?.wrapper),
        label: cn("font-semibold", classNames?.label),
        description: cn("font-normal", classNames?.description),
        root: wrapperClassName,
        error: cn("text-form-error-text text-wrap text-sm", classNames?.error),
        required: cn("text-form-required", classNames?.required),
      }}
    />
  );
};

TextInput.displayName = "TextInput";
