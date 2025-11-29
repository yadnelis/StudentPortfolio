import moment from "moment";
import type {
  useFormModelAddError,
  useFormModelRemoveError,
} from "../../hooks/useFormModel";
import type { CreateStudentRequest } from "../../types/dtos/student";
import type { FormModel } from "../../types/formModel";

export function validateStudent<T extends CreateStudentRequest>(
  formValue: FormModel<T>,
  addError: useFormModelAddError<T>,
  removeError: useFormModelRemoveError<T>
) {
  let valid = true;
  let validProperties = { startDate: true, endDate: true };

  if (
    formValue.startDate?.value &&
    !moment(formValue.startDate?.value, "YYYY-MM-DD", true).isValid()
  ) {
    valid = false;
    addError(
      "startDate",
      "Please enter a date in the format YYYY-MM-DD, or leave the field empty"
    );
  }

  if (
    formValue.endDate?.value &&
    !moment(formValue.endDate?.value, "YYYY-MM-DD", true).isValid()
  ) {
    valid = false;
    addError(
      "endDate",
      "Please enter a date in the format YYYY-MM-DD, or leave the field empty"
    );
  }

  if (
    formValue.endDate?.value &&
    formValue.startDate?.value &&
    formValue.endDate.value < formValue.startDate.value
  ) {
    valid = false;
    validProperties.endDate = false;
    addError("endDate", "Please enter a date after the start date.");
  }

  if (validProperties.startDate) removeError("startDate");
  if (validProperties.endDate) removeError("endDate");

  return valid;
}
