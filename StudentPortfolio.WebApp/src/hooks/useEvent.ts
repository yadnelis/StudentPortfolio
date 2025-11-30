import { useEffect } from "react";

export const AppEvents = {
  OpenCreateStudentModal: "modal.opencreatestudentmodal",
  OpenUpdateStudentModal: "modal.openupdatestudentmodal",
  OpenCreateAcknowledgementModal: "modal.opencreateacknowledgementmodal",
  OpenUpdateAcknowledgementModal: "modal.openupdateacknowledgementmodal",
  RefreshStudentList: "app.refreshstudentlist",
  StudentDeleted: "student.deleted",
  StudentCreated: "student.created",
  StudentEdited: "student.edited",
  AcknowledgementDeleted: "acknowledgement.deleted",
  AcknowledgementCreated: "acknowledgement.created",
  AcknowledgementEdited: "acknowledgement.edited",
  Search: "app.search",
  ReplaceSearchValueNoUpdate: "search.replacevaluenoupdate",
} as const;

type eventNameArg = (typeof AppEvents)[keyof typeof AppEvents];
type eventCallbackArg = (arg: Event & { detail: any }) => void;

export const useEvent = (
  userEvent: eventNameArg | eventNameArg[],
  callback: eventCallbackArg,
  deps: unknown[]
) => {
  useEffect(() => {
    if (Array.isArray(userEvent)) {
      userEvent.forEach((event) => {
        window.addEventListener(event, callback as EventListener);
      });
    } else {
      window.addEventListener(userEvent, callback as EventListener);
    }
    return () => {
      if (Array.isArray(userEvent)) {
        userEvent.forEach((event) => {
          window.removeEventListener(event, callback as EventListener);
        });
      } else {
        window.removeEventListener(userEvent, callback as EventListener);
      }
    };
  }, [userEvent, callback, ...(deps ?? [])]);
};

export const emitEvent = (eventName: eventNameArg, detail?: any) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};
