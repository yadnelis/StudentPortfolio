import { Pencil, Trash } from "lucide-react";
import moment from "moment";
import type { FC } from "react";
import { AcknowledgementApi } from "../api/AcknowledgementApi";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { useMutation } from "../hooks/useMutation";
import {
  acknowledgementType,
  type Acknowledgement,
} from "../types/dtos/acknowledgement";
import type { Student } from "../types/dtos/student";
import { cn } from "../utilities/cs";
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
  const [removeAcknowledgement, { mutating }] = useMutation(
    AcknowledgementApi.remove
  );

  const onRemove = () => {
    removeAcknowledgement([id]);
  };

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
        <div
          className={cn(
            "space-x-3 flex-nowrap w-fit has-[&.deleting]:opacity-100 group-hover:opacity-100 opacity-0 transition-all transition-200",
            {
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
      {description && (
        <p className="bg-slate-100 p-3 text-wrap overflow-hidden break-all">
          {description}
        </p>
      )}
      {children && <p className="bg-slate-100 p-3">{children}</p>}
    </div>
  );
};
