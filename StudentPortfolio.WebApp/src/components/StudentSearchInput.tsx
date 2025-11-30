"use client";
import { useDebouncedValue } from "@mantine/hooks";
import { Menu, X } from "lucide-react";
import { type FC, useEffect, useRef, useState } from "react";
import { AppEvents, emitEvent, useEvent } from "../hooks/useEvent";
import { useUrlSearchParam } from "../hooks/useUrlSearchParam";
import { cn } from "../utilities/cs";
import { TextInput, type TextInputProps } from "./TextInput";

export interface StudentSearchInputProps extends TextInputProps {
  onChangeDebounceValue?: (value: string) => void;
}

export const StudentSearchInput: FC<StudentSearchInputProps> = ({
  onChange,
  className,
  ...props
}) => {
  const firstUpdate = useRef(true);

  const [searchValue] = useUrlSearchParam("search");
  const [value, setValue] = useState<string>(searchValue);
  const [debounced] = useDebouncedValue(value, 300);

  useEffect(() => {
    if (value !== searchValue || firstUpdate.current)
      emitEvent(AppEvents.Search, { value });
  }, [debounced]);

  useEffect(() => {
    firstUpdate.current = false;
  }, []);

  useEvent(
    [AppEvents.ReplaceSearchValueNoUpdate],
    (e) => {
      const newValue = e.detail?.value;
      setValue(newValue);
    },
    []
  );

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
        "bg-slate-100 hover:bg-white rounded-lg border-0 px-12",
        className
      )}
      {...props}
    />
  );
};
