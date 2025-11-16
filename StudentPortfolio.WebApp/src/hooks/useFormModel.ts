import { useCallback, useState } from "react";
import type { FormModel } from "../types/formModel";

export const useFormModel = <T>() => {
  const [formValue, setFormValue] = useState<FormModel<T>>({} as FormModel<T>);

  const addError = useCallback((name: keyof T, error: string) => {
    setFormValue((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: error,
      },
    }));
  }, []);

  const removeError = useCallback((name: keyof T, error: string) => {
    setFormValue((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        error: error,
      },
    }));
  }, []);

  const handleChange = (
    name: keyof T,
    value: string,
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
  };

  return {
    formValue,
    setFormValue,
    handleChange,
    addError,
    removeError,
  };
};
