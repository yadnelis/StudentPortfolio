import { ChevronDown, ChevronUp, Dot, Plus, Trash } from "lucide-react";
import {
  Children,
  useCallback,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import toast from "react-hot-toast";
import { StudentApi } from "../api/StudentApi";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { useMutation } from "../hooks/useMutation";
import type { Student } from "../types/dtos/student";
import { Button } from "./Button";

interface StudentProfileCardProps
  extends Omit<ComponentProps<"div">, "className"> {
  institutionalId?: string;
  children: ReactNode;
  onClickAddAcknowledgement: MouseEventHandler<HTMLButtonElement>;
  student: Student;
}

export const StudentProfileCard: FC<StudentProfileCardProps> = ({
  student,
  children,
  onClickAddAcknowledgement,
  ...props
}) => {
  const [removeStudent] = useMutation(StudentApi.remove);
  const [showHidden, setShowHidden] = useState(false);

  const { visibleChildren, childrenLenght } = useMemo(() => {
    let visibleChildren = Children.toArray(children);
    let otherChildren = visibleChildren;
    let childrenLenght = Children.toArray(children).length;

    if (!showHidden || Children.count(children) <= 2) {
      otherChildren = visibleChildren.slice(childrenLenght - 3);
      visibleChildren = visibleChildren.slice(0, 2);
    } else otherChildren = [];

    return { visibleChildren, childrenLenght, otherChildren };
  }, [showHidden]);

  const onRemove = useCallback(() => {
    if (student?.id) {
      removeStudent([student.id], {
        onSuccess: () => {
          toast.success("Student removed successfully!", {
            position: "top-right",
          });
          emitEvent(AppEvents.StudentDeleted, { id: student.id });
        },
        onError: () => {
          toast.success("Error removing student. Please try again.", {
            position: "top-right",
          });
        },
      });
    }
  }, [student, removeStudent]);

  return (
    <div
      {...props}
      className="px-10 w-[min(90vw,1200px)] py-7 space-y-2.5 bg-slate-50 shadow-lg max-w-300 outline-accent hover:outline-2 group/studentcard transition-all transition-200"
    >
      <div>
        <div className="py-2">
          <span className="font-bold">{student?.institutionalId}</span>
          <Dot className="inline-block" />
          <span className="font-semibold">{student?.fullName}</span>
        </div>
        <div className="flex"></div>
      </div>
      <div className="flex flex-col gap-10">{visibleChildren}</div>
      {childrenLenght > 2 && !showHidden && (
        <div className="text-center text-gray-400 font-semibold ">
          Show {childrenLenght} more
        </div>
      )}
      <div className="mt-5 flex h-fit gap-5 justify-end group-hover/studentcard:visible invisible">
        {childrenLenght > 2 && (
          <Button onClick={() => setShowHidden((c) => !c)}>
            {showHidden ? "Show less" : "Show more"}
            {showHidden ? (
              <ChevronUp className="inline-block" />
            ) : (
              <ChevronDown className="inline-block" />
            )}
          </Button>
        )}
        <Button color="danger" onClick={onRemove}>
          <span className="flex items-center gap-2">
            <Trash className="inline size-5" /> Remove
          </span>
        </Button>
        <Button color={"accent"} onClick={onClickAddAcknowledgement}>
          <span className="flex items-center gap-2">
            <Plus className="inline size-5" /> Acknowledge
          </span>
        </Button>
      </div>
    </div>
  );
};
