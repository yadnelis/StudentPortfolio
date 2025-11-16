"use server";

import axios from "axios";
import type {
  CreateStudentRequest,
  GetStudentRequest,
  GetStudentsResponse,
} from "../types/dtos/student";
import { appendQueryString } from "../utilities/utils";

const controller =
  (import.meta.env.VITE_API_URL ?? "MISSING_API_URL") + "/Students";

export const getStudents = async (args?: GetStudentRequest) => {
  const url = appendQueryString(controller, args);
  var res = await axios.get<GetStudentsResponse>(url);
  return res.data;
};

export const getStudent = async (id: string) => {
  const url = `${controller}/${id}`;
  var res = await axios.get<GetStudentsResponse>(url);
  return res.data;
};

export const postStudent = async (args?: CreateStudentRequest) => {
  const url = controller;
  var res = await axios.post<GetStudentsResponse>(url, args);
  return res.data;
};

export const updateStudent = async (args?: CreateStudentRequest) => {
  const url = controller;
  var res = await axios.post<GetStudentsResponse>(url, args);
  return res.data;
};
