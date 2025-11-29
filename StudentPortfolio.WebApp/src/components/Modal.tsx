import type { ModalProps, ModalRootProps } from "@mantine/core";
import { Modal as MTNModal } from "@mantine/core";
import { X } from "lucide-react";
import type { FC, MouseEventHandler, ReactNode } from "react";
import { Button } from "../components/Button";
import { cn } from "../utilities/cs";
import { IconButton } from "./IconButton";
import { LoaderSpinner } from "./LoaderSpinner";

interface MoreModalProps extends ModalProps {}

type modalRootProps = Omit<MoreModalProps, "title">;

interface ModalContentProps
  extends Pick<MoreModalProps, "onClose" | "children" | "classNames"> {
  header?: ReactNode;
  title?: string;
  excludeFooter?: boolean;
  excludeCloseButton?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit?: MouseEventHandler<HTMLButtonElement>;
  loading?: boolean;
  classNames?: {
    content?: string;
    header?: string;
    footer?: string;
    body?: string;
    title?: string;
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
      // classNames={{
      //   inner: "block! w-fit! h-fit!",
      //   content: "max-w-100 min-w-80 w-fit",
      // }}
      className={`${className} h-dvh w-dvw bg-transparent absolute top-0 left-0 z-100 flex justify-center items-center ${
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
  excludeCloseButton,
}) => {
  return (
    <MTNModal.Content>
      <div
        className={cn(
          "relative grid bg-white max-h-dvh max-w-dvw min-h-80 min-w-100 px-8 pt-8 pb-4 grid-rows-[min-content_minmax(0,1fr)_min-content] rounded",
          classNames?.content
        )}
      >
        <LoaderSpinner
          includeBackground
          backgroundClassName="rounded"
          className="text-primary-700 "
          size="md"
          visible={loading}
        />
        <MTNModal.Header
          className={cn({ "mb-5": title || header }, classNames?.header)}
        >
          <>
            {!excludeCloseButton && (
              <IconButton
                className="absolute -top-2 -right-2 z-15 rounded-full bg-slate-200"
                size="xs"
                onClick={onClose}
              >
                <X className="stroke-3" />
              </IconButton>
            )}
            {title && (
              <MTNModal.Title
                className={cn("text-lg font-semibold", classNames?.title)}
              >
                {title}
              </MTNModal.Title>
            )}
            {header}
          </>
        </MTNModal.Header>
        <MTNModal.Body
          className={`flex flex-col overflow-y-auto overflow-x-auto ${classNames?.body}`}
        >
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
