import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { StudentApi } from "../../api/StudentApi";
import { ModalRoot } from "../../components/Modal";
import { AppEvents, emitEvent, useEvent } from "../../hooks/useEvent";
import { useMutation } from "../../hooks/useMutation";
import {
  StudentModalContent,
  type studentModalMutatefn,
} from "./StudentModalContent";

export const CreateStudentModal: FC = () => {
  const [createStudent, { mutating }] = useMutation(StudentApi.create);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(
    AppEvents.OpenCreateStudentModal,
    () => {
      setOpen(true);
    },
    []
  );

  const post = useCallback<studentModalMutatefn>(
    async (payload, { onSuccess, onError }) => {
      createStudent([payload], {
        onSuccess: (e) => {
          toast.success("Student created successfully!", {
            position: "bottom-center",
          });

          emitEvent(AppEvents.StudentCreated, e.entity);
          onSuccess?.();
        },
        onError: (e) => {
          if (e.status === 422) {
            toast.error(
              "Error creating student. Please review form validation errors.",
              {
                position: "bottom-center",
              }
            );
          } else if (e.status === 400) {
            toast.error(
              "Could not create student due to errors in the values.",
              {
                position: "bottom-center",
              }
            );
          }
          onError?.(e);
        },
      });
    },
    []
  );

  return createPortal(
    <ModalRoot onClose={close} opened={open} className="gap-5">
      <StudentModalContent
        mutate={post}
        onClose={close}
        mutating={mutating}
        title="New Student"
        submitText="Create"
      />
    </ModalRoot>,
    document.body
  );
};
