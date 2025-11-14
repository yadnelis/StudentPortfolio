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

export type GetStudentResponse = BaseResponse<Student>;
export type GetStudentsResponse = BaseResponse<Student[]>;
export type GetStudentRequest = Record<string, string>;
