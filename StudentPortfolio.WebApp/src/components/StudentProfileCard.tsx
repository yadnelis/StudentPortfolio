import { ChevronDown, ChevronUp, Dot, Plus, Trash } from "lucide-react";
import moment from "moment";
import {
  Children,
  useCallback,
  useMemo,
  useRef,
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
import { useOnClickOutsideElement } from "../hooks/useOnClickOutside";
import type { Student } from "../types/dtos/student";
import { cn } from "../utilities/cs";
import { AcknowledgementTypePluralResc } from "../utilities/enumResources";
import { Button } from "./Button";

interface StudentProfileCardProps
  extends Omit<ComponentProps<"div">, "className"> {
  institutionalId?: string;
  children: ReactNode;
  onClickAddAcknowledgement: MouseEventHandler<HTMLButtonElement>;
  student: Student;
  initialyOpen?: boolean;
}

export const StudentProfileCard: FC<StudentProfileCardProps> = ({
  student,
  children,
  onClickAddAcknowledgement,
  initialyOpen = false,
  ...props
}) => {
  const MAX_VISIBLE_LENGHT = 2;
  const contRef = useRef<HTMLDivElement>(null); //This is for mobile styling
  const [removeStudent] = useMutation(StudentApi.remove);
  const [showHidden, setShowHidden] = useState(initialyOpen);
  const [active, setActive] = useState(false); //This is for mobile styling

  const onClickOutside = () => {
    setActive(false);
  };

  const { visibleChildren, childrenLenght } = useMemo(() => {
    let visibleChildren = Children.toArray(children);
    let otherChildren = visibleChildren;
    let childrenLenght = Children.toArray(children).length;

    if (!showHidden || Children.count(children) <= MAX_VISIBLE_LENGHT) {
      otherChildren = visibleChildren.slice(
        childrenLenght - MAX_VISIBLE_LENGHT
      );
      visibleChildren = visibleChildren.slice(0, MAX_VISIBLE_LENGHT);
    } else otherChildren = [];

    return { visibleChildren, childrenLenght, otherChildren };
  }, [showHidden]);

  const onRemove = useCallback(() => {
    if (student.acknowledgements?.length ?? 0 > 0) {
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
    } else {
      toast.error("Cannot remove student if they have any acknowledgements.");
    }
  }, [student, removeStudent]);

  useOnClickOutsideElement(contRef, onClickOutside);

  return (
    <div
      ref={contRef}
      onClick={() => setActive(true)}
      {...props}
      className={cn(
        [
          "px-10 w-[min(90vw,1200px)] py-7 space-y-2.5 bg-slate-50 shadow-lg max-w-300 outline-accent hover:outline-2 group/studentcard transition-all transition-200 ",
          "max-md:border-1 border-transparent",
        ],
        { "max-md:border-gray-300": active }
      )}
    >
      <div>
        <div className="pt-2">
          <span className="font-bold">{student?.institutionalId}</span>
          <Dot className="inline-block" />
          <span className="font-semibold">{student?.fullName}</span>
        </div>
        {student?.startDate && (
          <div className="text-gray-600 gap-10 mb-10">
            <p>
              <span className="font-semibold">Started:</span>{" "}
              {moment(student?.startDate).format("MMMM YYYY")}
            </p>
            {student?.endDate && (
              <p className="">
                <span className="font-semibold">Graduated:</span>{" "}
                {moment(student?.endDate).format("MMMM YYYY")}
              </p>
            )}
            {(student.acknowledgements?.length ?? 0) > 0 && (
              <p className="">
                <span className="font-semibold">Has participated in:</span>{" "}
                {student.acknowledgements
                  ?.reduce<string[]>((prev, curr) => {
                    const name =
                      curr.type != 0
                        ? AcknowledgementTypePluralResc[curr.type]
                        : `'${curr.otherType!}'`;

                    if (!prev.includes(name)) {
                      prev.push(name);
                    }

                    return prev;
                  }, [])
                  .join(", ")}
              </p>
            )}
            <p></p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-10">{visibleChildren}</div>
      {childrenLenght > MAX_VISIBLE_LENGHT && (
        <div className="flex justify-center">
          <Button onClick={() => setShowHidden((c) => !c)}>
            <span className="text-gray-400">
              {showHidden
                ? `Show ${childrenLenght - MAX_VISIBLE_LENGHT} less`
                : `Show ${childrenLenght - MAX_VISIBLE_LENGHT} more`}
              {showHidden ? (
                <ChevronUp className="inline-block size-6" />
              ) : (
                <ChevronDown className="inline-block size-6" />
              )}
            </span>
          </Button>
        </div>
      )}
      <div
        className={cn(
          [
            "mt-5 flex h-fit gap-5 justify-end",
            "invisible has-[&.deleting]:visible group-hover/studentcard:visible group-focus-within/studentcard:visible group-active/studentcard:visible",
          ],
          {
            "max-md:visible": active,
          }
        )}
      >
        <Button color="danger" onClick={onRemove}>
          <span className="flex items-center gap-2">
            <Trash className="inline size-5" />{" "}
            <span className="max-sm:hidden">Remove</span>
          </span>
        </Button>
        <Button color={"accent"} onClick={onClickAddAcknowledgement}>
          <span className="flex items-center gap-2">
            <Plus className="inline size-5" />{" "}
            <span className="max-sm:hidden">Acknowledge</span>
          </span>
        </Button>
      </div>
    </div>
  );
};
