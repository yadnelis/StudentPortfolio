import { ChevronDown, ChevronUp, Dot, Pencil, Plus, Trash } from "lucide-react";
import moment from "moment";
import {
  Children,
  useMemo,
  useState,
  type ComponentProps,
  type FC,
  type MouseEventHandler,
  type ReactNode,
} from "react";
import { AcknowledgementApi } from "../api/AcknowledgementApi";
import { useMutation } from "../hooks/api";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import {
  acknowledgementType,
  type Acknowledgement,
} from "../types/dtos/acknowledgement";
import type { Student } from "../types/dtos/student";
import { Button } from "./Button";
import { IconButton } from "./IconButton";

interface AcknowledgementProps {
  children?: string | string[];
  acknowledgement: Acknowledgement;
  student: Partial<Student>;
}

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
          className="sticky bottom-16"
        >
          <span className="flex items-center gap-2">
            <Plus className="inline size-5" /> Acknowledge
          </span>
        </Button>
      </div>
    </div>
  );
};

export const AcknowledgementListItem: FC<AcknowledgementProps> = ({
  acknowledgement,
  student,
  children,
  ...props
}) => {
  const {
    id,
    startDate,
    endDate,
    type,
    place,
    otherType,
    description,
    competitionName,
    competitionPosition,
    studentOrganizatonName,
  } = acknowledgement;
  const [removeAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.remove
  );

  return (
    <div {...props} className=" bg-slate-50 group">
      <div className="border-b border-slate-300 px-1 py-2 flex justify-between min-h-11">
        <p className="">
          <span className="text-gray-700 bg-gray-100 px-2 py-1 rounded-4xl">
            {startDate && <span>{moment(startDate).format("YYYY/MM/DD")}</span>}
            {endDate && <span> - {moment(endDate).format("YYYY/MM/DD")}</span>}
          </span>
          <span className="text-primary-500 font-semibold">
            {type === 0
              ? otherType
              : Object.entries(acknowledgementType).find(
                  (x) => x[1] === type
                )?.[0]}
          </span>{" "}
          {place && <span className="">at {place}</span>}
        </p>
        <div className="space-x-3 flex-nowrap w-fit group-hover:opacity-100 opacity-0 transition-all transition-200">
          <IconButton
            onClick={() =>
              emitEvent(AppEvents.OpenUpdateAcknowledgementModal, {
                student,
                acknowledgement,
              })
            }
            variant="secondary"
          >
            <Pencil />
          </IconButton>
          <IconButton
            onClick={() => removeAcknowledgement([id])}
            variant="danger"
          >
            <Trash />
          </IconButton>
        </div>
      </div>
      {description && (
        <p className="bg-slate-100 p-3 text-wrap overflow-hidden break-all">
          {description}
        </p>
      )}
      {children && <p className="bg-slate-100 p-3">{children}</p>}
    </div>
  );
};
