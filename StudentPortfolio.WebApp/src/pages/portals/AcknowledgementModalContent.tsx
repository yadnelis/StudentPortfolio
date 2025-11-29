import { useDidUpdate } from "@mantine/hooks";
import moment from "moment";
import { useCallback, type FC } from "react";
import { Dropdown } from "../../components/Dropdown";
import { MaskedInput } from "../../components/MaskedInput";
import { ModalContent } from "../../components/Modal";
import { NumericInput } from "../../components/NumericInput";
import { TextArea } from "../../components/Textarea";
import { TextInput } from "../../components/TextInput";
import { useFormModel } from "../../hooks/useFormModel";
import {
  acknowledgementType,
  type Acknowledgement,
  type AcknowledgementTypeValues,
  type MutateAcknowledgementRequest,
} from "../../types/dtos/acknowledgement";
import type { Student } from "../../types/dtos/student";
import {
  addErrorsFromResponse,
  formModelToValue,
  valueToFormModel,
  type FormModel,
} from "../../types/formModel";
import { AcknowledgementTypeResc } from "../../utilities/enumResources";
import { validateAcknowledgement } from "../../utilities/validators/acknowledgementValidators";

export type acknowledgemenetModalMutatefn = (
  args: MutateAcknowledgementRequest,
  options: {
    onSuccess: () => void;
    onError: (e: any) => void;
  }
) => Promise<void>;

interface AcknowledgementModalContentProps {
  setOpen: (arg: boolean) => void;
  onClose: () => void;
  student?: Partial<Student>;
  mutate: acknowledgemenetModalMutatefn;
  mutating: boolean;
  acknowledgement?: Partial<Acknowledgement>;
  title: string;
  submitText: string;
}

export const AcknowledgementModalContent: FC<
  AcknowledgementModalContentProps
> = ({
  onClose,
  student,
  mutate,
  mutating,
  acknowledgement,
  title,
  submitText,
}) => {
  //
  const { formValue, setFormValue, handleChange, validate } =
    useFormModel<MutateAcknowledgementRequest>(
      {
        type: { value: acknowledgementType.Internship },
        studentId: { value: student?.id },
      },
      validateAcknowledgement
    );

  const _onClose = useCallback(() => {
    setFormValue({} as FormModel<MutateAcknowledgementRequest>);
    onClose();
  }, []);

  const post = useCallback(async () => {
    const valid = validate();
    if (!valid) return;

    const payload = formModelToValue(formValue);
    payload.studentId = student?.id;

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
    if (acknowledgement) setFormValue(valueToFormModel(acknowledgement));
  }, [acknowledgement]);

  return (
    <>
      <ModalContent
        onClose={_onClose}
        title={title}
        header={
          <>
            {student?.institutionalId && (
              <div className="text-sm text-gray-600">
                {student?.institutionalId}
              </div>
            )}
            {student?.startDate && (
              <div className="text-sm text-gray-600">
                Start Date: {moment(student?.startDate).format("MMMM, YYYY")}
              </div>
            )}
          </>
        }
        submitText={submitText}
        classNames={{
          header: "mb-9",
          body: "overflow-y-auto overflow-x-hidden",
          content: "",
        }}
        onSubmit={post}
        loading={mutating}
      >
        <div className="flex h-full mb-10 max-sm:flex-col max-sm:pe-3">
          {/* Column 1 */}
          <div className="space-y-5 max-w-150">
            <div className="flex justify-center gap-3 mb-5 shadow p-5 bg-secondary-50">
              <Dropdown
                required
                label="Type"
                className="w-full"
                classNames={{ wrapper: "w-full" }}
                value={formValue?.type?.value}
                error={formValue?.type?.error}
                options={Object.values(acknowledgementType).map((type) => ({
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

            <div className="w-full">
              <TextArea
                label="Description:"
                className="min-h-80 max-h-[60vh] resize-none"
                wrapperClassName="w-full"
                maxLength={500}
                description={`List the technical, professional, or interpersonal skills the student demonstrated during the '${
                  AcknowledgementTypeResc[formValue.type?.value ?? 0]
                }'.`}
                value={formValue?.description?.value}
                error={formValue?.description?.error}
                classNames={{ description: "mb-3" }}
                onChange={(e) => {
                  handleChange("description", e.target.value);
                }}
              />
            </div>
          </div>
          {/* Column 2 */}
          <div className="sm:ps-5 sm:ms-5 max-sm:mt-5 sm:border-s-2 border-gray-300 flex flex-col gap-2 max-w-150">
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
            {!formValue.type?.value && (
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
            {formValue.type?.value === acknowledgementType.Competition && (
              <div className="mt-5">
                <div className="">Competition Details</div>
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
    </>
  );
};
