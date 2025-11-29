"use client";
import { useDebouncedValue } from "@mantine/hooks";
import { Menu, X } from "lucide-react";
import { type FC, useEffect, useState } from "react";
import { TextInput, type TextInputProps } from "../components/TextInput";
import { cn } from "../utilities/cs";

export interface SearchInputProps extends TextInputProps {
  onChangeDebounceValue?: (value: string) => void;
}

export const SearchInput: FC<SearchInputProps> = ({
  onChangeDebounceValue,
  onChange,
  className,
  ...props
}) => {
  const [value, setValue] = useState("");
  const [debounced] = useDebouncedValue(value, 300);

  useEffect(() => {
    onChangeDebounceValue?.(debounced);
  }, [debounced]);

  return (
    <TextInput
      leftButton={{ icon: <Menu />, onClick: () => {} }}
      rightButton={{ icon: <X />, onClick: () => setValue("") }}
      size="md"
      placeholder="Search"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
        onChange?.(e);
      }}
      className={cn(
        "!bg-slate-100 hover:!bg-white !rounded-lg !border-0 !px-12",
        className
      )}
      {...props}
    />
  );
};
