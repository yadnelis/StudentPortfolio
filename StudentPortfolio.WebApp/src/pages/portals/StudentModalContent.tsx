import { useDidUpdate } from "@mantine/hooks";
import { useCallback, type FC } from "react";
import { MaskedInput } from "../../components/MaskedInput";
import { ModalContent } from "../../components/Modal";
import { TextInput } from "../../components/TextInput";
import { useFormModel } from "../../hooks/useFormModel";
import type { MutateStudentRequest, Student } from "../../types/dtos/student";
import {
  addErrorsFromResponse,
  formModelToValue,
  valueToFormModel,
  type FormModel,
} from "../../types/formModel";
import { validateStudent } from "../../utilities/validators/studentValidators";

export type studentModalMutatefn = (
  args: MutateStudentRequest,
  options: {
    onSuccess: () => void;
    onError: (e: any) => void;
  }
) => Promise<void>;

interface StudentModalContentProps {
  onClose: () => void;
  student?: Partial<Student>;
  mutate: studentModalMutatefn;
  mutating: boolean;
  acknowledgement?: Partial<Student>;
  title: string;
  submitText: string;
}

export const StudentModalContent: FC<StudentModalContentProps> = ({
  onClose,
  student,
  mutate,
  submitText,
  title,
  mutating,
}) => {
  const { formValue, setFormValue, handleChange, validate } =
    useFormModel<MutateStudentRequest>(undefined, validateStudent);

  const _onClose = useCallback(() => {
    setFormValue({} as FormModel<MutateStudentRequest>);
    onClose();
  }, []);

  const post = useCallback(async () => {
    const valid = validate();
    if (!valid) return;

    const payload = formModelToValue(formValue);
    payload.id = student?.id;

    await mutate(payload, {
      onSuccess: () => {
        _onClose();
      },
      onError: (e) => {
        if (e?.response?.data?.errors)
          setFormValue((prev) =>
            addErrorsFromResponse(prev, e?.response?.data)
          );
      },
    });
  }, [formValue]);

  useDidUpdate(() => {
    if (student) setFormValue(valueToFormModel(student));
  }, [student]);

  return (
    <ModalContent
      onClose={_onClose}
      title={title}
      submitText={submitText}
      onSubmit={post}
      loading={mutating}
    >
      <div className="space-y-5 mb-10">
        <div className="flex justify-center gap-3 mb-5">
          <TextInput
            required
            label="Institutional Id"
            className="w-70"
            placeholder="M00102030"
            value={formValue?.institutionalId?.value}
            error={formValue?.institutionalId?.error}
            onChange={(e) => {
              handleChange("institutionalId", e.target.value);
            }}
          />
        </div>
        <div className="flex gap-3 max-sm:flex-wrap">
          <TextInput
            label="Name"
            className="max-sm:w-full w-50"
            wrapperClassName="max-sm:w-full"
            placeholder="John"
            value={formValue?.name?.value}
            error={formValue?.name?.error}
            required
            onChange={(e) => {
              handleChange("name", e.target.value);
            }}
          />
          <TextInput
            label="Last Name"
            className="max-sm:w-full w-76"
            wrapperClassName="max-sm:w-full"
            placeholder="Smith"
            value={formValue?.lastName?.value}
            error={formValue?.lastName?.error}
            required
            onChange={(e) => {
              handleChange("lastName", e.target.value);
            }}
          />
        </div>
        <div className="flex gap-3">
          <MaskedInput
            label="Start Date"
            className="max-sm:w-full w-63"
            wrapperClassName="max-sm:w-full w-63"
            placeholder="yyyy-mm-dd"
            mask={"YYYY-MM-DD"}
            onBlur={validate}
            blocks={[
              { block: "YYYY", operator: "0" },
              { block: "MM", operator: "0" },
              { block: "DD", operator: "0" },
            ]}
            value={formValue?.startDate?.value}
            error={formValue?.startDate?.error}
            onChange={(e) => {
              handleChange("startDate", e.value, e.isValid);
            }}
          />
          <MaskedInput
            label="End Date"
            className="max-sm:w-full w-63"
            wrapperClassName="max-sm:w-full w-63"
            placeholder="yyyy-mm-dd"
            onBlur={validate}
            mask={"YYYY-MM-DD"}
            blocks={[
              { block: "YYYY", operator: "0" },
              { block: "MM", operator: "0" },
              { block: "DD", operator: "0" },
            ]}
            value={formValue?.endDate?.value}
            error={formValue?.endDate?.error}
            onChange={(e) => {
              handleChange("endDate", e.value, e.isValid);
            }}
          />
        </div>
      </div>
    </ModalContent>
  );
};
