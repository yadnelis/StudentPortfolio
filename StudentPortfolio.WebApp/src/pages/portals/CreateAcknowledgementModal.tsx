import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import { postAcknowledgement } from "../../api/acknowledgements";
import { ModalRoot } from "../../components/Modal";
import { useMutation } from "../../hooks/api";
import { AppEvents, useEvent } from "../../hooks/useEvent";
import type { Student } from "../../types/dtos/student";
import { AcknowledgementModalContent } from "./AcknowledgementModalContent";

export const CreateAcknowledgementModal: FC = () => {
  const [open, setOpen] = useState(false);
  const [createAcknowledgement, { mutating }] =
    useMutation(postAcknowledgement);

  const [student, setStudent] = useState<Partial<Student>>({});
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(AppEvents.OpenCreateAcknowledgementModal, (e) => {
    console.log("hereasd");
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
      <AcknowledgementModalContent
        setOpen={setOpen}
        onClose={onClose}
        student={student}
        mutate={createAcknowledgement}
        mutating={mutating}
      />
    </ModalRoot>,
    document.body
  );
};
