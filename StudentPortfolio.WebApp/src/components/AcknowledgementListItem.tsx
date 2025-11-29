import { Pencil, Trash } from "lucide-react";
import moment from "moment";

import { useRef, useState, type FC } from "react";
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
    studentOrganizatonName,
  } = acknowledgement;
  const contRef = useRef<HTMLDivElement>(null); //This is for mobile styling
  const [active, setActive] = useState(false); //This is for mobile styling
  const [removeAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.remove
  );

  const onRemove = () => {
    removeAcknowledgement([id]);
  };

  const onClickOutside = () => {
    setActive(false);
  };

  useOnClickOutsideElement(contRef, onClickOutside);

  const TypeAndPlace = ({ className }: { className?: string }) => (
    <span className={"text-nowrap text-ellipsis overflow-hidden " + className}>
      <span className="text-primary-500 font-semibold">
        {type === 0
          ? otherType
          : Object.entries(acknowledgementType).find((x) => x[1] === type)?.[0]}
      </span>
      {place && <> at {place}</>}
    </span>
  );

  return (
    <div
      {...props}
      ref={contRef}
      className={cn(
        [
          "bg-slate-50 group max-md:border max-md:border-t-0 max-md:border-transparent",
        ],
        {
          "max-md:border-slate-300 ": active,
        }
      )}
      onBlur={(e) => setActive(false)}
      onClick={(e) => setActive(true)}
    >
      <div className="border-t sm:border-b border-slate-300 flex gap-2 h-10 min-h-fit items-center">
        {/* Time */}
        <div className="text-gray-700 sm:bg-slate-200 px-2 py-1 h-full flex items-center">
          <span className=" ">
            {startDate && <span>{moment(startDate).format("YYYY/MM/DD")}</span>}
            {endDate && <span> - {moment(endDate).format("YYYY/MM/DD")}</span>}
          </span>
        </div>
        <div className="flex gap-2 justify-between items-center grow w-100 max-w-full min-w-0">
          {/*  Type & Place */}
          <TypeAndPlace className="max-sm:invisible" />
          {/*  Command Btns */}
          <div
            className={cn(
              [
                "space-x-3 flex-nowrap min-w-fit transition-all transition-200 pe-3",
                "invisible has-[&.deleting]:visible group-hover:visible group-focus-within:visible group-active:visible",
              ],
              {
                "max-md:visible": active,
                deleting: mutating,
              }
            )}
          >
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
            <IconButton onClick={onRemove} variant="danger" loading={mutating}>
              <Trash />
            </IconButton>
          </div>
        </div>
      </div>

      {/*  Type & Place: mobile */}
      <div className="flex sm:hidden w-full overflow-hidden p-2 border-b border-slate-300">
        <TypeAndPlace className="" />
      </div>

      {description && (
        <div className="bg-slate-100 p-3 text-wrap overflow-hidden break-all">
          {(competitionName || competitionPosition) && (
            <div className="mb-5 text-gray-600">
              {competitionName && <p> Name: {competitionName}</p>}
              {competitionPosition && (
                <p>
                  Position:{" "}
                  {competitionPosition + ordinalSuffixOf(competitionPosition)}{" "}
                  Place
                </p>
              )}
            </div>
          )}
          <p>{description}</p>
        </div>
      )}
      {children && <p className="bg-slate-100 p-3">{children}</p>}
    </div>
  );
};
