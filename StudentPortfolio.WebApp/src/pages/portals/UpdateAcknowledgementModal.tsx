import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { AcknowledgementApi } from "../../api/AcknowledgementApi";
import { ModalRoot } from "../../components/Modal";
import { AppEvents, emitEvent, useEvent } from "../../hooks/useEvent";
import { useMutation } from "../../hooks/useMutation";
import type { Acknowledgement } from "../../types/dtos/acknowledgement";
import type { Student } from "../../types/dtos/student";
import {
  AcknowledgementModalContent,
  type acknowledgemenetModalMutatefn,
} from "./AcknowledgementModalContent";

export const UpdateAcknowledgementModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [updateAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.update
  );

  const [student, setStudent] = useState<Partial<Student>>({});
  const [acknowledgement, setAcknoledgement] = useState<
    Partial<Acknowledgement> & { timeStamp: Date } // time stamp lets the modal be repopulated with the same data after closing
  >({ timeStamp: new Date() });

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(AppEvents.OpenUpdateAcknowledgementModal, (e) => {
    setOpen(true);
    setStudent(e.detail?.student);
    setAcknoledgement({ ...e.detail?.acknowledgement, timeStamp: new Date() });
  });

  const onSubmit = useCallback<acknowledgemenetModalMutatefn>(
    async (payload, { onError, onSuccess }) => {
      if (!acknowledgement.id) return;

      updateAcknowledgement([acknowledgement.id, payload], {
        onSuccess: () => {
          toast.success("Acknowledgement updated successfully!", {
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
              "Error updating acknowledgement. Please review form validation errors.",
              {
                position: "bottom-center",
              }
            );
          } else if (e.status === 400) {
            toast.error(
              "Could not update acknowledgement due to errors in the values.",
              {
                position: "bottom-center",
              }
            );
          }
          onError?.(e);
        },
      });
    },
    [acknowledgement, student]
  );

  return createPortal(
    <ModalRoot
      onClose={onClose}
      opened={open}
      className="gap-5"
      closeOnClickOutside={false}
    >
      <AcknowledgementModalContent
        submitText="Update Acknowledgement"
        title={`Acknowledge ${student?.fullName ?? "..."}`}
        setOpen={setOpen}
        onClose={onClose}
        student={student}
        mutate={onSubmit}
        mutating={mutating}
        acknowledgement={acknowledgement}
      />
    </ModalRoot>,
    document.body
  );
};
