import { useCallback, useState, type FC } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { StudentApi } from "../../api/StudentApi";
import { ModalRoot } from "../../components/Modal";
import { AppEvents, emitEvent, useEvent } from "../../hooks/useEvent";
import { useMutation } from "../../hooks/useMutation";
import type { Student } from "../../types/dtos/student";
import {
  StudentModalContent,
  type studentModalMutatefn,
} from "./StudentModalContent";

export const UpdateStudentModal: FC = () => {
  const [updateStudent, { mutating }] = useMutation(StudentApi.update);
  const [open, setOpen] = useState(false);
  const [student, setStudent] = useState<Student | undefined>();

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  useEvent(
    AppEvents.OpenUpdateStudentModal,
    (e) => {
      console.log(e);
      if (e.detail?.student) {
        setStudent(e.detail.student);
        setOpen(true);
      }
    },
    []
  );

  const put = useCallback<studentModalMutatefn>(
    async (payload, { onSuccess, onError }) => {
      if (!student?.id) return;

      updateStudent([student.id, payload], {
        onSuccess: (e) => {
          toast.success("Student updated successfully!", {
            position: "bottom-center",
          });

          emitEvent(AppEvents.RefreshStudentList);
          emitEvent(AppEvents.StudentCreated, e.entity);
          onSuccess?.();
        },
        onError: (e) => {
          if (e.status === 422) {
            toast.error(
              "Error update student. Please review form validation errors.",
              {
                position: "bottom-center",
              }
            );
          } else if (e.status === 400) {
            toast.error(
              "Could not update student due to errors in the values.",
              {
                position: "bottom-center",
              }
            );
          }
          onError?.(e);
        },
      });
    },
    [student]
  );

  return createPortal(
    <ModalRoot onClose={close} opened={open} className="gap-5">
      <StudentModalContent
        mutate={put}
        onClose={close}
        mutating={mutating}
        student={student}
        title={`Update '${student?.institutionalId}'`}
        submitText="Update"
      />
    </ModalRoot>,
    document.body
  );
};
