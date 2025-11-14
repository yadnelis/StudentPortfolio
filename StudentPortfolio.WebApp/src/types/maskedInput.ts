import type { ChangeEvent } from "react";
import type { TextInputProps, textInputValue } from "../components/TextInput";

//Interfaces
export interface maskBlock {
  operator: maskOperatorsSignatures;
  block: string;
  numeric?: boolean;
}

export interface MaskedInputProps extends TextInputProps {
  mask: string;
  blocks?: maskBlock[];
  onChange?: (e: MaskedInputChangeEventResponse) => void;
}

export interface MaskedInputChangeEventResponse
  extends ChangeEvent<HTMLInputElement> {
  value: string;
  rawValue: textInputValue;
  isValid: boolean;
  blockValues?: blockValues;
}

// Constants
export const maskOperators = [
  { sig: "0", test: (char: string) => /\d/.test(char) },
  { sig: "a", test: (char: string) => /[a-zA-Z]/.test(char) },
  { sig: "@", test: (char: string) => /[^a-zA-Z0-9]/.test(char) },
] as const;

export const maskOperatorsSignatures: string[] = maskOperators.map(
  (m) => m.sig
);

// Types
export type maskOperatorsSignatures = (typeof maskOperators)[number]["sig"];
export type blockValues = Record<string, string>;
export type blockPositions = { block: string; substring: [number, number] }[];
export type blockIndexes = Record<number, maskBlock>;
