import { type ComponentProps } from "react";
import { cn } from "../utilities/cs";

type dropdownValue = string | number | readonly string[] | undefined;

export interface DropdownOption<TValue extends dropdownValue> {
  text: string;
  value: TValue;
}

type classNames =
  | "option"
  | "label"
  | "labelText"
  | "select"
  | "error"
  | "wrapper";

interface DropdownProps<TValue extends dropdownValue>
  extends ComponentProps<"select"> {
  wrapperClassName?: string;
  classNames?: Partial<Record<classNames, string>>;
  options: DropdownOption<TValue>[];
  value: TValue;
  label?: string;
  error?: string;
}

export function Dropdown<TValue extends dropdownValue>({
  className,
  classNames,
  wrapperClassName,
  options,
  label,
  error,
  ...rest
}: DropdownProps<TValue>) {
  return (
    <div className={cn("inline-block", classNames?.wrapper)}>
      <label className={cn("inline-flex flex-col w-full", classNames?.label)}>
        <span className={cn("font-semibold", classNames?.labelText)}>
          {label}
        </span>
        <select
          className={cn(
            "bg-white hover:bg-slate-50 p-2 border-gray-200 rounded-xs border-2  focus:ring-blue-200/50 focus:ring-2 focus:border-gray-300 outline-none",
            className,
            classNames?.select
          )}
          {...rest}
        >
          {options.map((opt) => (
            <option value={opt.value} className={cn(classNames?.option)}>
              {opt.text}
            </option>
          ))}
        </select>
        {error && (
          <span
            className={cn("text-form-error-text text-sm", classNames?.error)}
          >
            {error}
          </span>
        )}
      </label>
    </div>
  );
}
