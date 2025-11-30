import type { ButtonProps } from "@mantine/core";
import { UserPlus } from "lucide-react";
import type { FC } from "react";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { cn } from "../utilities/cs";
import { IconButton } from "./IconButton";

// export interface AddStudentButtonProps extends ButtonProps {}

export const AddStudentButton: FC<ButtonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "relative group/addbtn transition-colors hover:to-green-400 hover:from-accent-200 p-1 bg-linear-to-b from-green-400 to-lime-600 hover:animate-light-bounce rounded-full",
        className
      )}
    >
      <IconButton
        size="xl"
        className={cn([
          "relative rounded-full bg-linear-to-r ",
          "text-lime-50 p-3 group-hover/addbtn:text-white hover:text-white",
          "from-lime-600 to-green-800",
          "hover:to-green-700 hover:from-lime-600",
        ])}
        onClick={() => {
          emitEvent(AppEvents.OpenCreateStudentModal);
        }}
      >
        <UserPlus />
      </IconButton>
    </div>
  );
};
