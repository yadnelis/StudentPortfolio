import { useCallback, useState } from "react";
import { ordinalSuffixOf } from "../utilities/utils";

export const useNumericValue = (
  value?: number,
  format?: string,
  min: number = Number.MIN_SAFE_INTEGER,
  max: number = Number.MAX_SAFE_INTEGER
) => {
  const [actualValue, setActualValue] = useState<number | undefined>(value);
  const [displayValue, setDisplayValue] = useState<string | undefined>(
    getDisplayValue(value, format)
  );
  const _setActualValue = useCallback(
    (value?: number | string) => {
      if (value === null || value === undefined || value === "") {
        setActualValue(undefined);
        setDisplayValue(undefined);
        return;
      }
      let strValue = value?.toString() ?? "";
      // if (strValue?.toString().charAt(strValue.length - 1) == ".") {
      //   strValue += 0;
      // }
      let numericValue = Number(strValue);

      if (!isNaN(numericValue)) {
        const isValid =
          (max != null && max != undefined ? numericValue <= max : true) &&
          (min != null && min != undefined ? numericValue >= min : true);

        if (isValid) {
          setActualValue(numericValue);
          setDisplayValue(getDisplayValue(numericValue, format));
          return numericValue;
        }
      }
      return actualValue;
    },
    [format, min, max, actualValue]
  );

  return [actualValue, displayValue, _setActualValue] as const;
};

const getDisplayValue = (value?: number, format?: string) => {
  if (!format) return value?.toString() ?? "0";

  let rtrnStr = format;
  rtrnStr = rtrnStr.replaceAll("{0}", value?.toString() ?? "0");
  rtrnStr = rtrnStr.replaceAll("{ord}", ordinalSuffixOf(value ?? 0) ?? "0");
  return rtrnStr;
};
