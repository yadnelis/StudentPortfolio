import type { FC } from "react";
import { cn } from "../utilities/cs";
import { TextInput, type TextInputProps } from "./TextInput";

export interface TextAreaProps extends TextInputProps {}

export const TextArea: FC<TextAreaProps> = ({
  className,
  placeholder,
  ...rest
}) => {
  return (
    <TextInput
      {...rest}
      component={"textarea"}
      className={cn("w-full min-h-50 bg-gray-100 text-start", className)}
    ></TextInput>
  );
};
