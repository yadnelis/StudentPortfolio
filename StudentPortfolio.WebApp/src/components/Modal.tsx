import type { ModalProps, ModalRootProps } from "@mantine/core";
import { Modal as MTNModal } from "@mantine/core";
import { X } from "lucide-react";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { Button } from "../components/Button";
import { IconButton } from "./IconButton";
import { LoaderSpinner } from "./LoaderSpinner";

interface MoreModalProps extends ModalProps {}

type modalRootProps = Omit<MoreModalProps, "title">;

interface ModalContentProps
  extends Pick<MoreModalProps, "onClose" | "children" | "classNames"> {
  header?: ReactNode;
  title?: string;
  excludeFooter?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  classNames?: {
    content?: string;
    header?: string;
    footer?: string;
    body?: string;
  };
}

export const Modal: FC<MoreModalProps & ModalContentProps> = ({ ...rest }) => {
  return (
    <ModalRoot {...rest}>
      <ModalContent {...rest} />
    </ModalRoot>
  );
};

export const ModalRoot: FC<modalRootProps> = ({
  onClose,
  opened,
  closeOnEscape,
  children,
  className,
  ...rest
}) => {
  return (
    <MTNModal.Root
      {...(rest as ModalRootProps)}
      opened={opened}
      onClose={onClose}
      closeOnEscape={closeOnEscape}
      className={`${className} h-dvh w-dvw bg-transparent absolute top-0 left-0 flex justify-center items-center ${
        !opened && "hidden"
      }`}
    >
      <MTNModal.Overlay className="h-full w-full bg-black/50 absolute top-0 left-0" />
      {children}
    </MTNModal.Root>
  );
};

export const ModalContent: FC<ModalContentProps> = ({
  onClose,
  header,
  title,
  excludeFooter,
  children,
  classNames,
  submitText = "Submit",
  cancelText = "Cancel",
  onSubmit,
  loading,
}) => {
  return (
    <MTNModal.Content>
      <div
        className={`relative bg-white min-h-80 min-w-100 px-8 pt-8 pb-4 grid grid-rows-[min-content_auto_min-content] rounded ${classNames?.content}`}
      >
        <LoaderSpinner
          includeBackground
          backgroundClassName="rounded"
          className="text-primary-700 "
          size="md"
          visible={loading}
        />
        <MTNModal.Header
          className={`${(title || header) && "mb-5"} ${classNames?.header}`}
        >
          <>
            <IconButton
              className="absolute -top-2 -right-2 z-15 rounded-full bg-slate-200"
              size="xs"
              onClick={onClose}
            >
              <X />
            </IconButton>
            {title && (
              <MTNModal.Title className="text-lg font-semibold">
                {title}
              </MTNModal.Title>
            )}
            {header}
          </>
        </MTNModal.Header>
        <MTNModal.Body className={`flex flex-col ${classNames?.body}`}>
          {children}
        </MTNModal.Body>
        {!excludeFooter && (
          <div className={`flex justify-end gap-2.5 ${classNames?.footer}`}>
            <Button onClick={onClose}>{cancelText}</Button>
            <Button onClick={onSubmit} color="primary" loading={loading}>
              {submitText}
            </Button>
          </div>
        )}
      </div>
    </MTNModal.Content>
  );
};
