import { ChevronDown, ChevronUp, Dot, Plus } from "lucide-react";
import {
  Children,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from "react";
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
      </div>
      <div className="flex flex-col gap-10">{visibleChildren}</div>
      {childrenLenght > 2 && !showHidden && (
        <div className="text-center text-gray-400 font-semibold ">
          Show {childrenLenght} more
        </div>
      )}
      <div className="flex h-fit gap-5 justify-end">
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
        <Button
          color={"accent"}
          onClick={onClickAddAcknowledgement}
          className="mt-5 group-hover/studentcard:visible invisible"
        >
          <span className="flex items-center gap-2">
            <Plus className="inline size-5" /> Acknowledge
          </span>
        </Button>
      </div>
    </div>
  );
};
