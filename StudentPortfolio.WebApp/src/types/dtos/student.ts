import type { BaseEntity } from "./_baseEntity";
import type { BaseResponse } from "./_baseResponse";
import type { Acknowledgement } from "./acknowledgement";

export interface Student extends BaseEntity {
  id: string;
  institutionalId: string;
  name: string;
  lastName: string;
  fullName: string;
  startDate: string;
  endDate: string;
  institution: string;
  acknowledgements?: Acknowledgement[];
}

export type MutateStudentRequest = Partial<
  Omit<Student, "Id" | "acknowledgements" | "fullName">
>;

export type CreateStudentRequest = MutateStudentRequest;
export type UpdateAcknowledgementRequest = MutateStudentRequest;

export type GetStudentResponse = BaseResponse<Student>;
export type GetStudentsResponse = BaseResponse<Student[]>;
export type GetStudentRequest = Record<string, string>;
export type UpdateStudentRequest = CreateStudentRequest;
