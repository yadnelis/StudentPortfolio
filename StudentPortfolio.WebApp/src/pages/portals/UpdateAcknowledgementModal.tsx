import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { AcknowledgementApi } from "../../api/AcknowledgementApi";
import { ModalRoot } from "../../components/Modal";
import { useMutation } from "../../hooks/api";
import { AppEvents, useEvent } from "../../hooks/useEvent";
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
    Partial<Acknowledgement>
  >({});

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(AppEvents.OpenUpdateAcknowledgementModal, (e) => {
    setOpen(true);
    setStudent(e.detail?.student);
    setAcknoledgement(e.detail?.acknowledgement);
  });

  const onSubmit = useCallback<acknowledgemenetModalMutatefn>(
    async (payload, { onError, onSuccess }) => {
      console.log(acknowledgement);
      if (!acknowledgement.id) return;

      updateAcknowledgement([acknowledgement.id, payload], {
        onSuccess: () => {
          toast.success("Acknowledgement created successfully!", {
            position: "bottom-center",
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
    [acknowledgement]
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
