import {
  useCallback,
  useEffect,
  useState,
  type ChangeEventHandler,
  type FC,
  type FocusEventHandler,
  type KeyboardEventHandler,
} from "react";
import { useNumericValue } from "../hooks/useNumericValue";
import { TextInput, type TextInputProps } from "./TextInput";

export interface NumericInputProps extends Omit<TextInputProps, "value"> {
  value?: number;
  format?: string;
  allowDecimals?: boolean;
  min?: number;
  max?: number;
}

export const NumericInput: FC<NumericInputProps> = ({
  value,
  format,
  onChange,
  allowDecimals,
  min,
  max,
  onFocus,
  onKeyDown,
  onBlur,
  ...rest
}) => {
  const [focused, setFocused] = useState(false);
  const [actualValue, displayValue, setActualValue] = useNumericValue(
    value,
    format,
    min,
    max
  );

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!allowDecimals) e.target.value = e.target.value.replace(/[.,]/g, "");
    // Remove periods, commas, and anything not 0–9

    e.target.value = setActualValue(e.target.value)?.toString() ?? "";
    onChange?.(e);
  };

  useEffect(() => {
    setActualValue(value);
  }, [value]);

  return (
    <>
      <TextInput
        {...rest}
        value={focused ? actualValue?.toString() : displayValue}
        onChange={handleChange}
        onKeyDown={useCallback<KeyboardEventHandler<HTMLInputElement>>(
          (e) => {
            if (focused && e.key === "ArrowUp") {
              const nv = (actualValue ?? 0) + 1;
              setActualValue(nv);
              e.preventDefault();
            } else if (focused && e.key === "ArrowDown") {
              const nv = (actualValue ?? 0) - 1;
              setActualValue(nv);
              e.preventDefault();
            }
            onKeyDown?.(e);
          },
          [onKeyDown, actualValue, focused]
        )}
        onFocus={useCallback<FocusEventHandler<HTMLInputElement>>(
          (e) => {
            setFocused(true);
            onFocus?.(e);
          },
          [onFocus]
        )}
        onBlur={useCallback<FocusEventHandler<HTMLInputElement>>(
          (e) => {
            setFocused(false);
            onBlur?.(e);
          },
          [onBlur]
        )}
      />
    </>
  );
};
