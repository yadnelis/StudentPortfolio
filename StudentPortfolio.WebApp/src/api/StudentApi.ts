"use server";

import axios from "axios";
import type {
  CreateStudentRequest,
  GetStudentsResponse,
} from "../types/dtos/student";
import { appendQueryString } from "../utilities/utils";

const controller = (import.meta.env.VITE_API_URL ?? "") + "api/Students";

const getAll = async (args?: string) => {
  const url = appendQueryString(controller, args);
  var res = await axios.get<GetStudentsResponse>(url);
  return res.data;
};

const get = async (id: string) => {
  const url = `${controller}/${id}`;
  var res = await axios.get<GetStudentsResponse>(url);
  return res.data;
};

const create = async (args?: CreateStudentRequest) => {
  const url = controller;
  var res = await axios.post<GetStudentsResponse>(url, args);
  return res.data;
};

const update = async (id: string, args?: CreateStudentRequest) => {
  const url = `${controller}/${id}`;
  var res = await axios.put<GetStudentsResponse>(url, args);
  return res.data;
};

const remove = async (id: string) => {
  const url = `${controller}/${id}`;
  var res = await axios.delete<GetStudentsResponse>(url);
  return res.data;
};

export const StudentApi = {
  create,
  get,
  getAll,
  update,
  remove,
};
