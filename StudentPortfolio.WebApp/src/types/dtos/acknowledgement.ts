import type { BaseResponse } from "./_baseResponse";
import type { Student } from "./student";

export interface Acknowledgement {
  id: string;
  studentId: number;
  type: AcknowledgementTypeValues;
  place: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  otherType?: string;
  competitionPosition?: number;
  competitionName?: string;
  studentOrganizatonName?: string;
  student: Student;
}

export interface CreateAcknowledgementRequest {
  studentId?: string;
  type?: AcknowledgementTypeValues;
  place?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  otherType?: string;
  email?: string;
  competitionPosition?: number;
  competitionName?: string;
  studentOrganizatonName?: string;
}

export interface UpdateAcknowledgementRequest {
  studentId?: string;
  type?: AcknowledgementTypeValues;
  place?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  otherType?: string;
  email?: string;
  competitionPosition?: string;
  competitionName?: string;
  studentOrganizatonName?: string;
}

export type getAcknowledgementResponse = BaseResponse<Acknowledgement>;
export type getAcknowledgementsResponse = BaseResponse<Acknowledgement[]>;

export const AcknowledgementType = {
  Other: 0,
  Investigation: 1,
  Competition: 2,
  Internship: 3,
  Athlete: 4,
  Lidership: 5,
} as const;

export type AcknowledgementTypeValues =
  (typeof AcknowledgementType)[keyof typeof AcknowledgementType];
