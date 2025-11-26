import { useCallback, useState } from "react";
import type { FormModel } from "../types/formModel";

export type useFormModelValidateArg<T> = (
  formValue: FormModel<T>,
  addError: useFormModelAddError<T>,
  removeError: useFormModelRemoveError<T>
) => boolean;

export type useFormModelAddError<T> = (prop: keyof T, error: string) => void;
export type useFormModelRemoveError<T> = (prop: keyof T) => void;
export type useFormModelValidate = () => boolean;
export type useFormModelHandleChange<T> = (
  name: keyof T,
  value: T[typeof name],
  isValid?: boolean,
  error?: string
) => void;

export const useFormModel = <T>(
  defaultValue?: FormModel<T>,
  validateFn?: useFormModelValidateArg<T>
) => {
  const [formValue, setFormValue] = useState<FormModel<T>>(
    defaultValue as FormModel<T>
  );

  const addError = useCallback<useFormModelAddError<T>>(
    (name: keyof T, error: string) => {
      setFormValue((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          error: error,
        },
      }));
    },
    []
  );

  const removeError = useCallback<useFormModelRemoveError<T>>(
    (name: keyof T) => {
      setFormValue((prev) => ({
        ...prev,
        [name]: {
          ...prev[name],
          error: null,
        },
      }));
    },
    []
  );

  const validate = useCallback<useFormModelValidate>(() => {
    return validateFn?.(formValue, addError, removeError) ?? true;
  }, [validateFn, formValue, addError]);

  const handleChange = useCallback<useFormModelHandleChange<T>>(
    (
      name: keyof T,
      value: T[typeof name],
      isValid?: boolean,
      error?: string
    ) => {
      const newValue = { ...formValue };
      newValue[name] = {
        value,
        isValid,
        error,
      };
      setFormValue(newValue);
    },
    [formValue]
  );

  return {
    formValue,
    setFormValue,
    handleChange,
    addError,
    removeError,
    validate,
  };
};
