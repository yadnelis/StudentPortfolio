import { type ComponentProps } from "react";

type dropdownValue = string | number | readonly string[] | undefined;

export interface DropdownOption<TValue extends dropdownValue> {
  text: string;
  value: TValue;
}

interface DropdownProps<TValue extends dropdownValue>
  extends ComponentProps<"select"> {
  wrapperClassName?: string;
  classNames?: Record<"input" | "wrapper" | string, string>;
  options: DropdownOption<TValue>[];
  value: TValue;
  label?: string;
}

export function Dropdown<TValue extends dropdownValue>({
  className,
  classNames,
  wrapperClassName,
  options,
  label,
  value,
  ...rest
}: DropdownProps<TValue>) {
  // const [selected, setSelected] = useState<TValue>(value);
  // useEffect(() => {
  //   if (value != selected) setSelected(value);
  // }, [value]);
  return (
    <label className="inline-flex flex-col text-sm">
      <span className="font-semibold">{label}</span>
      <select
        className={`bg-white hover:bg-slate-50 p-2 border-gray-200 rounded-xs border-2  focus:ring-blue-200/50 focus:ring-2 focus:border-gray-300 outline-none ${
          className ?? ""
        }`}
        {...rest}
      >
        {options.map((opt) => (
          <option value={opt.value}>{opt.text}</option>
        ))}
      </select>
    </label>
    // <Select
    //   withCheckIcon={false}
    //   withScrollArea={false}
    //   rightSection={
    //     <div className="flex flex-col items-center justify-center">
    //       <ChevronUp
    //         className="text-stone-500 size-5 translate-y-0.5"
    //         strokeWidth={2.5}
    //       />
    //       <ChevronDown
    //         className="text-stone-500 size-5 -translate-y-0.5"
    //         strokeWidth={2.5}
    //       />
    //     </div>
    //   }
    //   {...rest}
    //   classNames={{
    //     input: `bg-white hover:bg-slate-50 p-2 border-gray-200 rounded-xs border-2  focus:ring-blue-200/50 focus:ring-2 focus:border-gray-300 outline-none ${
    //       className ?? ""
    //     }`,
    //     section: `inline-flex absolute h-full [&[data-position=right]]:right-0 [&[data-position=left]]:left-0 px-2 ${classNames?.section}`,
    //     wrapper: `relative ${classNames?.wrapper}`,
    //     root: `${wrapperClassName}`,
    //     dropdown:
    //       "absolute bg-gray-50 border border-gray-100 overflow-visible shadow-lg",
    //     option:
    //       "[svg]:fs-base [&[aria-selected=true]]:bg-accent-200/50  hover:bg-gray-100 p-2",
    //     error: "text-form-error-text text-wrap",
    //     required: "text-form-required",
    //     ...classNames,
    //   }}
    // ></Select>
  );
}
