import { notifications } from "@mantine/notifications";
import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { postStudent } from "../../api/students";
import { MaskedInput } from "../../components/MaskedInput";
import { ModalContent, ModalRoot } from "../../components/Modal";
import { TextInput } from "../../components/TextInput";
import { useMutation } from "../../hooks/api";
import { AppEvents, useEvent } from "../../hooks/useEvent";
import { useFormModel } from "../../hooks/useFormModel";
import type { CreateStudentRequest } from "../../types/dtos/student";
import { addErrorsFromResponse, formModelToValue } from "../../types/formModel";

export const CreateStudentModal: FC = () => {
  const [createStudent, { mutating }] = useMutation(postStudent);
  const [open, setOpen] = useState(true);
  const { formValue, setFormValue, handleChange, addError, removeError } =
    useFormModel<CreateStudentRequest>();

  useEvent(AppEvents.OpenCreateUserModal, () => {
    setOpen(true);
  });

  const post = useCallback(async () => {
    const payload = formModelToValue(formValue);
    createStudent(payload, {
      onSuccess: () => {
        notifications.show({
          title: "Student created",
          message: "The student was created successfully.",
          color: "green",
        });
        setOpen(false);
      },
      onError: (e) => {
        console.log("here", e?.response);
        if (e?.response?.data?.errors)
          setFormValue((prev) =>
            addErrorsFromResponse(prev, e?.response?.data)
          );
      },
    });
  }, [formValue]);

  return createPortal(
    <ModalRoot onClose={() => setOpen(false)} opened={open} className="gap-5">
      <ModalContent
        onClose={() => setOpen(false)}
        title="New student"
        submitText="Create Student"
        onSubmit={post}
        loading={mutating}
      >
        <div className="space-y-5 mb-10">
          <div className="flex justify-center gap-3 mb-5">
            <TextInput
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
          <div className="flex gap-3">
            <TextInput
              label="Name"
              className="w-50"
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
              className="w-76"
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
              className="w-63"
              placeholder="yyyy-mm-dd"
              mask={"YYYY-MM-DD"}
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
              className="w-63"
              placeholder="yyyy-mm-dd"
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
    </ModalRoot>,
    document.body
  );
};
