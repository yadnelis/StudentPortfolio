import type { ButtonProps } from "@mantine/core";
import { UserPlus } from "lucide-react";
import type { FC } from "react";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { IconButton } from "./IconButton";

// export interface AddStudentButtonProps extends ButtonProps {}

export const AddStudentButton: FC<ButtonProps> = ({ className }) => {
  return (
    <div
      className={`${className} p-1 bg-gradient-to-b from-green-400 to-lime-600 rounded-full`}
    >
      <IconButton
        size="xl"
        className={`!rounded-full bg-gradient-to-r from-lime-600 to-green-800 p-3`}
        onClick={() => {
          emitEvent(AppEvents.OpenCreateUserModal);
        }}
      >
        <UserPlus className="!text-lime-50" />
      </IconButton>
    </div>
  );
};
