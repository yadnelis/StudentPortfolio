import type { ValidationResult } from "./dtos/validationResult";

export type FormModel<T> = {
  [property in keyof T]: {
    value: T[property] | undefined;
    isValid?: boolean;
    error?: string;
    meta?: Record<string, string | undefined>;
  };
};

export const isValid = <T>(formModel: FormModel<T>) => {
  Object.values<{
    value: unknown;
    error?: string;
    meta?: Record<string, string | undefined>;
  }>(formModel).reduce((prev, curr) => prev && !curr.error, true);
};

export const addErrorsFromResponse = <T>(
  formModel: FormModel<T>,
  response: ValidationResult<T>
) => {
  const nv = { ...formModel };
  response.errors?.forEach?.((error) => {
    if (nv[error.property]) nv[error.property].error = error.message;
    else nv[error.property] = { value: undefined, error: error.message };
  });
  return nv;
};

export const formModelToValue = <T>(formModel: FormModel<T>): T => {
  return Object.keys(formModel).reduce<T>((prev, key) => {
    prev[key as keyof T] = formModel[key as keyof T].value as T[keyof T];
    return prev;
  }, {} as T);
};
