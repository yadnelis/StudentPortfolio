import type { BaseResponse } from "./_baseResponse";
import type { Student } from "./student";

export interface Acknowledgement {
  id: string;
  studentId: string;
  type: AcknowledgementTypeValues;
  place: string;
  description: string;
  startDate: string;
  endDate?: string;
  otherType?: string;
  competitionPosition?: number;
  competitionName?: string;
  studentOrganizatonName?: string;
  student: Student;
}

export type MutateAcknowledgementRequest = Partial<
  Omit<Acknowledgement, "Id" | "student">
>;
export type CreateAcknowledgementRequest = MutateAcknowledgementRequest;
export type UpdateAcknowledgementRequest = Omit<
  MutateAcknowledgementRequest,
  "studentId"
>;

export type GetAcknowledgementResponse = BaseResponse<Acknowledgement>;
export type GetAcknowledgementsResponse = BaseResponse<Acknowledgement[]>;

export const acknowledgementType = {
  Other: 0,
  Investigation: 1,
  Competition: 2,
  Internship: 3,
  Athlete: 4,
  Lidership: 5,
} as const;

export type AcknowledgementTypeValues =
  (typeof acknowledgementType)[keyof typeof acknowledgementType];
