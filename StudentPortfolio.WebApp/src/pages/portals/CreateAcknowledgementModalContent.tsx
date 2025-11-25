import moment from "moment";
import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { postAcknowledgement } from "../../api/acknowledgements";
import { Dropdown } from "../../components/Dropdown";
import { MaskedInput } from "../../components/MaskedInput";
import { ModalContent, ModalRoot } from "../../components/Modal";
import { NumericInput } from "../../components/NumericInput";
import { TextArea } from "../../components/Textarea";
import { TextInput } from "../../components/TextInput";
import { useMutation } from "../../hooks/api";
import { AppEvents, useEvent } from "../../hooks/useEvent";
import { useFormModel } from "../../hooks/useFormModel";
import {
  AcknowledgementType,
  type AcknowledgementTypeValues,
  type CreateAcknowledgementRequest,
} from "../../types/dtos/acknowledgement";
import {
  addErrorsFromResponse,
  formModelToValue,
  type FormModel,
} from "../../types/formModel";
import { AcknowledgementTypeResc } from "../../utilities/enumResources";

export const CreateAcknowledgementModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState(
    {} as {
      fullName: string;
      institutionalId: string;
      id: string;
    }
  );
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(AppEvents.OpenCreateAcknowledgementModal, (e) => {
    setOpen(true);
    setStudent(e.detail);
  });

  return createPortal(
    <ModalRoot
      onClose={onClose}
      opened={open}
      className="gap-5"
      closeOnClickOutside={false}
    >
      <CreateAcknowledgementModalContent
        setOpen={setOpen}
        onClose={onClose}
        studentFullName={student.fullName}
        studentInstitutionalId={student.institutionalId}
        studentId={student.id}
      />
      ,
    </ModalRoot>,
    document.body
  );
};

interface CreateAcknowledgementModalContentProps {
  setOpen: (arg: boolean) => void;
  onClose: () => void;
  studentFullName?: string;
  studentInstitutionalId?: string;
  studentId?: string;
}

export const CreateAcknowledgementModalContent: FC<
  CreateAcknowledgementModalContentProps
> = ({
  setOpen,
  onClose,
  studentFullName,
  studentId,
  studentInstitutionalId,
}) => {
  const [createAcknowledgement, { mutating }] =
    useMutation(postAcknowledgement);

  const { formValue, setFormValue, handleChange, addError } =
    useFormModel<CreateAcknowledgementRequest>({
      type: { value: AcknowledgementType.Internship },
      studentId: { value: studentId },
    });

  const _onClose = useCallback(() => {
    setFormValue({} as FormModel<CreateAcknowledgementRequest>);
    onClose();
  }, []);

  const validate = () => {
    let valid = true;
    if (
      formValue.startDate &&
      !moment(formValue.startDate.value, "YYYY-MM-DD", true).isValid()
    ) {
      valid = false;
      addError(
        "startDate",
        "Please enter a date in the format YYYY-MM-DD, or leave the field empty"
      );
    }

    if (
      formValue.endDate &&
      !moment(formValue.endDate.value, "YYYY-MM-DD", true).isValid()
    ) {
      valid = false;
      addError(
        "endDate",
        "Please enter a date in the format YYYY-MM-DD, or leave the field empty"
      );
    }

    return valid;
  };

  const post = useCallback(async () => {
    const valid = validate();
    if (!valid) return;

    const payload = formModelToValue(formValue);
    payload.studentId = studentId;

    createAcknowledgement(payload, {
      onSuccess: () => {
        toast.success("Acknowledgement created successfully!", {
          position: "bottom-center",
        });

        setOpen(false);
      },
      onError: (e) => {
        if (e.status === 422) {
          toast.error(
            "Error creating acknowledgement. Please review form validation errors.",
            {
              position: "bottom-center",
            }
          );

          if (e?.response?.data?.errors)
            setFormValue((prev) =>
              addErrorsFromResponse(prev, e?.response?.data)
            );
        } else if (e.status === 400) {
          toast.error(
            "Could not create acknowledgement due to errors in the values.",
            {
              position: "bottom-center",
            }
          );
        } else {
          toast.error("Unexpected error occured.", {
            position: "bottom-center",
          });
        }
      },
    });
  }, [formValue]);

  return (
    <>
      <ModalContent
        onClose={_onClose}
        title="New acknowledgement"
        submitText="Create Acknowledgement"
        classNames={{ content: "", body: "overflow-auto" }}
        onSubmit={post}
        loading={mutating}
      >
        <div className="flex h-full mb-10">
          <div className="space-y-5">
            <div className="flex justify-center gap-3 mb-5">
              <Dropdown
                required
                label="Type"
                className="w-70"
                value={formValue?.type?.value}
                // error={formValue?.type?.error}
                options={Object.values(AcknowledgementType).map((type) => ({
                  text: AcknowledgementTypeResc[type],
                  value: type,
                }))}
                onChange={(e) => {
                  if (Number.isInteger(Number(e.currentTarget.value)))
                    handleChange(
                      "type",
                      Number(e.currentTarget.value) as AcknowledgementTypeValues
                    );
                }}
              />
            </div>

            <div className="w-100">
              <TextArea
                label="Description:"
                className="min-h-80 max-h-[60vh]"
                maxLength={500}
                description={`What skills did this student demonstrate troughout the course of this '${
                  AcknowledgementTypeResc[formValue.type?.value ?? 0]
                }'`}
                value={formValue?.description?.value}
                error={formValue?.description?.error}
                onChange={(e) => {
                  handleChange("description", e.target.value);
                }}
              />
            </div>
          </div>
          <div className="w-100 ps-5 ms-5 border-s-2 border-gray-300 flex flex-col gap-2">
            <div className="w-full flex gap-3">
              <MaskedInput
                label="Start Date"
                className="w-full"
                wrapperClassName="w-full"
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
                className="w-full"
                wrapperClassName="w-full"
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
            <TextInput
              label="Place"
              className="w-full"
              wrapperClassName="w-full"
              placeholder="Corporation, Institution, Entity Name..."
              value={formValue?.place?.value}
              error={formValue?.place?.error}
              required
              onChange={(e) => {
                handleChange("place", e.target.value);
              }}
            />
            {formValue.type?.value === AcknowledgementType.Other && (
              <TextInput
                label="'Other Event' Description"
                className="w-full"
                wrapperClassName="w-full"
                placeholder="..."
                value={formValue?.otherType?.value}
                error={formValue?.otherType?.error}
                required
                onChange={(e) => {
                  handleChange("otherType", e.target.value);
                }}
              />
            )}
            {formValue.type?.value === AcknowledgementType.Competition && (
              <div className="mt-5">
                <div className="text-sm">Competition Details</div>
                <div className="ps-2 border-s-2 border-gray-300">
                  <TextInput
                    label="Title"
                    placeholder="Hackaton, Tournament Name, etc..."
                    className="w-full"
                    wrapperClassName="w-full"
                    value={formValue?.competitionName?.value}
                    error={formValue?.competitionName?.error}
                    onChange={(e) => {
                      handleChange("competitionName", e.target.value);
                    }}
                  />
                  <NumericInput
                    label="Position"
                    placeholder="1st Place"
                    max={1000}
                    min={1}
                    className="w-full"
                    wrapperClassName="w-full"
                    format="{0}{ord} Place"
                    value={formValue?.competitionPosition?.value}
                    error={formValue?.competitionPosition?.error}
                    onChange={(e) => {
                      handleChange(
                        "competitionPosition",
                        e.target.value,
                        Number.isInteger(e.target.value)
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </ModalContent>
      {/* <div className="flex flex-col gap-5">
        <ModalContent
          onClose={() => {}}
          excludeFooter
          excludeCloseButton
          classNames={{
            content: "h-fit min-h-fit w-120 ",
            title: "text-base font-normal",
          }}
        >
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <MaskedInput
                label="Start Date"
                className="w-full"
                wrapperClassName="w-full"
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
                className="w-full"
                wrapperClassName="w-full"
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
            <div className="flex gap-3">
              <TextInput
                label="Place"
                className="w-full"
                wrapperClassName="w-full"
                placeholder="Corporation, Institution, Entity Name..."
                value={formValue?.place?.value}
                error={formValue?.place?.error}
                required
                onChange={(e) => {
                  handleChange("place", e.target.value);
                }}
              />
            </div>
          </div>
        </ModalContent>
        {formValue.type?.value === AcknowledgementType.Competition && (
          <ModalContent
            onClose={() => {}}
            excludeFooter
            title={"Competition Details"}
            excludeCloseButton
            classNames={{
              content:
                "h-fit min-h-fit w-120 bg-[color-mix(in_srgb,var(--color-primary-100)_20%,var(--color-gray-100)_80%)]",
              // title: "text-base font-normal",
            }}
          >
            <div className="flex justify-between gap-3">
              <TextInput
                label="Name"
                placeholder="Hackaton, Tournament Name, etc..."
                className="w-75"
                value={formValue?.competitionName?.value}
                error={formValue?.competitionName?.error}
                onChange={(e) => {
                  handleChange("competitionName", e.target.value);
                }}
              />
              <NumericInput
                label="Position"
                placeholder="1st Place"
                max={1000}
                min={0}
                className="w-30"
                format="{0}{ord} Place"
                value={formValue?.competitionPosition?.value}
                error={formValue?.competitionPosition?.error}
                onChange={(e) => {
                  handleChange(
                    "competitionPosition",
                    e.target.value,
                    Number.isInteger(e.target.value)
                  );
                }}
              />
            </div>
          </ModalContent>
        )}
      </div> */}
    </>
  );
};
