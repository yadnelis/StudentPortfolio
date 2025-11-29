import { useEffect } from "react";

export const AppEvents = {
  OpenCreateUserModal: "modal.opencreateusermodal",
  OpenCreateAcknowledgementModal: "modal.opencreateacknowledgementmodal",
  OpenUpdateAcknowledgementModal: "modal.openupdateacknowledgementmodal",
  RefreshStudentList: "app.refreshstudentlist",
  StudentDeleted: "student.deleted",
  StudentCreated: "student.created",
  StudentEdited: "student.edited",
  Search: "app.Search",
} as const;

type eventNameArg = (typeof AppEvents)[keyof typeof AppEvents];
type eventCallbackArg = (arg: Event & { detail: any }) => void;

export const useEvent = (
  userEvent: eventNameArg,
  callback: eventCallbackArg
) => {
  useEffect(() => {
    window.addEventListener(userEvent, callback as EventListener);
    return () =>
      window.removeEventListener(userEvent, callback as EventListener);
  }, []);
};

export const emitEvent = (eventName: eventNameArg, detail?: any) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};
