export interface ValidationResult<T> {
  success: boolean;
  errors: ValidationError<T>[];
  payload: T;
}

interface ValidationError<T> {
  property: keyof T;
  message: string;
}
