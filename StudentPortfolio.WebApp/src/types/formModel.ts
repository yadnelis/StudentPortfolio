export type FormModel<T> = {
  [property in keyof T]: {
    value: T[property];
    isValid?: boolean;
    error?: string;
  };
};

export const formModelToValue = <T>(formModel: FormModel<T>): T => {
  return Object.keys(formModel).reduce<T>((prev, key) => {
    prev[key as keyof T] = formModel[key as keyof T].value;
    return prev;
  }, {} as T);
};
