import { Pencil, Trash } from "lucide-react";
import moment from "moment";

import { useRef, useState, type FC } from "react";
import toast from "react-hot-toast";
import { AcknowledgementApi } from "../api/AcknowledgementApi";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { useMutation } from "../hooks/useMutation";
import { useOnClickOutsideElement } from "../hooks/useOnClickOutside";
import {
  acknowledgementType,
  type Acknowledgement,
} from "../types/dtos/acknowledgement";
import type { Student } from "../types/dtos/student";
import { cn } from "../utilities/cs";
import { ordinalSuffixOf } from "../utilities/utils";
import { IconButton } from "./IconButton";

interface AcknowledgementProps {
  children?: string | string[];
  acknowledgement: Acknowledgement;
  student: Partial<Student>;
}

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
  } = acknowledgement;
  const contRef = useRef<HTMLDivElement>(null); //This is for mobile styling
  const [active, setActive] = useState(false); //This is for mobile styling
  const [removeAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.remove
  );

  const remove = () => {
    removeAcknowledgement([id], {
      onSuccess: () => {
        emitEvent(AppEvents.AcknowledgementDeleted, {
          student,
          acknowledgement,
        });
      },
      onError: () => {
        toast.error("An error occured deleting the acknowledgement 😢");
      },
    });
  };

  const onClickOutside = () => {
    setActive(false);
  };

  const edit = () =>
    emitEvent(AppEvents.OpenUpdateAcknowledgementModal, {
      student,
      acknowledgement,
    });

  useOnClickOutsideElement(contRef, onClickOutside);

  const TypeAndPlace = ({ className }: { className?: string }) => (
    <span className={"text-nowrap text-ellipsis overflow-hidden " + className}>
      <span className="text-primary-500 font-semibold">
        {type === 0
          ? otherType
          : Object.entries(acknowledgementType).find((x) => x[1] === type)?.[0]}
      </span>
      {competitionName && <span className="">: {competitionName}</span>}
      {place && <> at {place}</>}
    </span>
  );

  return (
    <div
      {...props}
      ref={contRef}
      className={cn(["bg-slate-50 group border border-t-0 border-slate-300"], {
        "max-sm:border-slate-300 ": active,
      })}
      onBlur={() => setActive(false)}
      onClick={() => setActive(true)}
    >
      <div
        className={cn(
          "border-t border-slate-300 flex gap-2 h-10 min-h-fit items-center max-sm:bg-slate-200/60",
          {
            "sm:border-b": !!description,
          }
        )}
      >
        {/* Time */}
        <div className="text-gray-700 sm:bg-slate-200 px-2 h-full flex items-center w-fit ">
          <span className="text-nowrap text-ellipsis">
            {startDate && (
              <span>{moment(startDate).format("MMMM DD, YYYY")}</span>
            )}
            {endDate && (
              <span> - {moment(endDate).format("MMMM DD, YYYY")}</span>
            )}
          </span>
        </div>
        <div className="flex gap-2 justify-between items-center grow max-w-full min-w-0">
          {/*  Type & Place */}
          <TypeAndPlace className="max-sm:hidden" />
          {/*  Command Btns */}
          <div
            className={cn(
              [
                "space-x-3 flex-nowrap min-w-fit transition-all transition-200 pe-3 flex grow justify-end",
                "invisible has-[&.deleting]:visible group-hover:visible group-focus-within:visible group-active:visible",
              ],
              {
                "max-md:visible": active,
                deleting: mutating,
              }
            )}
          >
            <IconButton onClick={edit} variant="secondary">
              <Pencil />
            </IconButton>
            <IconButton onClick={remove} variant="danger" loading={mutating}>
              <Trash />
            </IconButton>
          </div>
        </div>
      </div>

      {/*  Type & Place: mobile */}
      <div
        className={cn(
          "flex sm:hidden w-full overflow-hidden p-2 border-slate-300",
          { "border-b": !!description }
        )}
      >
        <TypeAndPlace className="" />
      </div>

      {description && (
        <div className="bg-slate-100 p-3 text-wrap overflow-hidden break-all">
          {competitionPosition && (
            <div className="mb-5 text-gray-600">
              {competitionPosition && (
                <p>
                  Position:{" "}
                  {competitionPosition + ordinalSuffixOf(competitionPosition)}{" "}
                  Place
                </p>
              )}
            </div>
          )}
          <pre className="font-sans">{description}</pre>
        </div>
      )}
      {children && <p className="bg-slate-100 p-3">{children}</p>}
    </div>
  );
};
