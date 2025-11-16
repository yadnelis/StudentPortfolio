import { useMemo, type ChangeEvent, type FocusEvent } from "react";
import {
  maskOperators,
  maskOperatorsSignatures,
  type blockIndexes,
  type blockPositions,
  type maskBlock,
  type MaskedInputProps,
} from "../types/maskedInput";
import { TextInput, type textInputValue } from "./TextInput";

export const MaskedInput = ({
  mask,
  value,
  onChange,
  blocks,
  onBlur,
  ...props
}: MaskedInputProps) => {
  const { blockPositions, blockIndexMap } = useBlockIndexes(mask, blocks);
  value = format(value, mask, blockIndexMap, value).value;

  const _onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const res = format(rawValue, mask, blockIndexMap, value);

    const blockValues = blockPositions?.reduce<Record<string, string>>(
      (prev, { block, substring }) => {
        prev[block] = res.value.substring(substring[0], substring[1]);
        return prev;
      },
      {}
    );

    onChange?.({
      ...e,
      ...res,
      blockValues,
    });
  };

  const _onblur = (e: FocusEvent<HTMLInputElement, Element>) => {
    const rawValue = e.target.value;
    const res = format(rawValue, mask, blockIndexMap, value);

    const blockValues = blockPositions?.reduce<Record<string, string>>(
      (prev, { block, substring }) => {
        prev[block] = res.value.substring(substring[0], substring[1]);
        return prev;
      },
      {}
    );

    onBlur?.({
      ...e,
      ...res,
      blockValues,
    });
  };

  return (
    <TextInput
      {...props}
      data-mask={mask}
      onChange={_onChange}
      value={value}
      onBlur={_onblur}
    />
  );
};

/**
 * @param rawValue Raw value return by the HTML change event (user input)
 * @param mask Sequence of characters that dictates how the value should be formatted
 * @param blockIndexMap Maps an index to a mask blocks
 * @param currentValue Previous formatted value of the text input
 */
const format = (
  rawValue: textInputValue,
  mask: string,
  blockIndexMap: blockIndexes,
  currentValue?: textInputValue
) => {
  if (!rawValue) {
    return { value: "", rawValue: "", isValid: false };
  }

  if (currentValue && rawValue.length > mask.length) {
    //avoid unnecessary processing if the value reached max length
    return {
      value: currentValue.toString(),
      rawValue,
      isValid: mask.length === currentValue.length,
    };
  }

  let maskedValue = "";
  for (
    let i = 0;
    i < rawValue.length && maskedValue.length < mask.length;
    i++
  ) {
    const block = blockIndexMap?.[i];
    const operator = block?.operator ?? mask[i];

    if (mask.length > i) {
      if (isOperator(operator)) {
        //If the character passes the mask operator test (of that index's operator), add it to the masked value
        if (testOperator(rawValue[i], operator)) maskedValue += rawValue[i];
      } else {
        //If the character is a static mask character (like a slash '/'), add it to the masked value
        maskedValue += operator;
        if (rawValue[i] !== operator && mask.length > i) {
          maskedValue += rawValue[i];
        }
      }
    }
  }
  return {
    value: maskedValue,
    rawValue,
    isValid: mask.length === maskedValue.length,
  };
};

const useBlockIndexes = (mask: string, blocks?: maskBlock[]) => {
  return useMemo(() => {
    const blockIndexMap: blockIndexes = {};
    const blockPositions: blockPositions = [];
    blocks?.forEach((block) => {
      if (mask.includes(block.block)) {
        let startIndex = mask.indexOf(block.block);
        blockPositions.push({
          block: block.block,
          substring: [startIndex, startIndex + block.block.length],
        });
        for (let i = startIndex; i < startIndex + block.block.length; i++) {
          blockIndexMap[i] = block;
        }
      }
    });

    return { blockIndexMap, blockPositions };
  }, [mask]);
};

const isOperator = (char: string): char is maskOperatorsSignatures => {
  return maskOperatorsSignatures.includes(char);
};

const getOperator = (char: string) => {
  return maskOperators.find((m) => m.sig === char);
};

const testOperator = (rawChar: string, maskChar: maskOperatorsSignatures) => {
  const operator = getOperator(maskChar);
  if (operator) {
    return operator.test(rawChar);
  }
  return false;
};
