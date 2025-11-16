import {
  TextInput as MTextInput,
  type TextInputProps as MTextInputProps,
} from "@mantine/core";
import type { LucideProps } from "lucide-react";
import type { FC, ReactElement } from "react";
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
  classNames?: Record<"input" | "wrapper" | string, string>;
}

export const TextInput: FC<TextInputProps> = ({
  leftButton,
  rightButton,
  size,
  className,
  classNames,
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
    <div className="relative">
      <MTextInput
        {...props}
        classNames={{
          input: `bg-white hover:bg-slate-50 p-2 border-gray-200 rounded-xs border-2  focus:ring-blue-200/50 focus:ring-2 focus:border-gray-300 outline-none ${
            className ?? ""
          }`,
          section: `inline-flex absolute h-full [&[data-position=right]]:right-0 [&[data-position=left]]:left-0 px-2 ${classNames?.section}`,
          wrapper: `relative ${classNames?.wrapper}`,
          error: "text-form-error-text",
          required: "text-form-required",
          ...classNames,
        }}
      />
    </div>
  );
};

TextInput.displayName = "TextInput";
