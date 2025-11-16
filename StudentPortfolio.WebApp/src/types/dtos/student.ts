import type { BaseResponse } from "./_baseResponse";
import type { Acknowledgement } from "./acknowledgement";

export interface Student {
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

export interface CreateStudentRequest {
  institutionalId: string;
  name: string;
  lastName: string;
  startDate: string;
  endDate: string;
  institution: string;
}

export type GetStudentResponse = BaseResponse<Student>;
export type GetStudentsResponse = BaseResponse<Student[]>;
export type GetStudentRequest = Record<string, string>;
export type UpdateStudentRequest = CreateStudentRequest;
