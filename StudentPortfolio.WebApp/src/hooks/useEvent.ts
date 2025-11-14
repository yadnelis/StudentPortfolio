import { useEffect } from "react";

export const AppEvents = {
  OpenCreateUserModal: "modal.opencreateusermodal",
  OpenAddAcknowledgementModal: "modal.openaddacknowledgementmodal",
} as const;

type eventNameArg = (typeof AppEvents)[keyof typeof AppEvents];
type eventCallbackArg = (arg: Event) => void;

export const useEvent = (
  userEvent: eventNameArg,
  callback: eventCallbackArg
) => {
  useEffect(() => {
    window.addEventListener(userEvent, callback);
    return () => window.removeEventListener(userEvent, callback);
  }, []);
};

export const emitEvent = (eventName: eventNameArg, detail?: unknown) => {
  window.dispatchEvent(new CustomEvent(eventName, { detail }));
};
