import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { AcknowledgementApi } from "../../api/AcknowledgementApi";
import { ModalRoot } from "../../components/Modal";
import { AppEvents, emitEvent, useEvent } from "../../hooks/useEvent";
import { useMutation } from "../../hooks/useMutation";
import type { Student } from "../../types/dtos/student";
import {
  AcknowledgementModalContent,
  type acknowledgemenetModalMutatefn,
} from "./AcknowledgementModalContent";

export const CreateAcknowledgementModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [createAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.create
  );

  const [student, setStudent] = useState<Partial<Student>>({});
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(AppEvents.OpenCreateAcknowledgementModal, (e) => {
    setOpen(true);
    setStudent(e.detail);
  });

  const onSubmit = useCallback<acknowledgemenetModalMutatefn>(
    async (payload, { onError, onSuccess }) => {
      createAcknowledgement([payload], {
        onSuccess: () => {
          toast.success("Acknowledgement created successfully!", {
            position: "bottom-center",
          });
          emitEvent(AppEvents.AcknowledgementCreated, {
            student: student,
            akcnowledgement: payload,
          });
          onSuccess?.();
        },
        onError: (e) => {
          if (e.status === 422) {
            toast.error(
              "Error creating acknowledgement. Please review form validation errors.",
              {
                position: "bottom-center",
              }
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
          onError?.(e);
        },
      });
    },
    [student]
  );

  return createPortal(
    <ModalRoot
      onClose={onClose}
      opened={open}
      className="gap-5"
      closeOnClickOutside={false}
    >
      <AcknowledgementModalContent
        submitText="Create Acknowledgement"
        title={`Acknowledge ${student?.fullName ?? "..."}`}
        setOpen={setOpen}
        onClose={onClose}
        student={student}
        mutate={onSubmit}
        mutating={mutating}
      />
    </ModalRoot>,
    document.body
  );
};
