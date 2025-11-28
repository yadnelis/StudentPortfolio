"use server";

import axios from "axios";

import type {
  CreateAcknowledgementRequest,
  GetAcknowledgementResponse,
  UpdateAcknowledgementRequest,
} from "../types/dtos/acknowledgement";

const controller =
  (import.meta.env.VITE_API_URL ?? "MISSING_API_URL") + "/Acknowledgements";

// export const getAcknowledgements = async (args?: GetAcknowledgementRequest) => {
//   const url = appendQueryString(controller, args);
//   var res = await axios.get<getAcknowledgementsResponse>(url);
//   return res.data;
// };

const get = async (id: string) => {
  const url = `${controller}/${id}`;
  var res = await axios.get<GetAcknowledgementResponse>(url);
  return res.data;
};

const create = async (args?: CreateAcknowledgementRequest) => {
  const url = controller;
  var res = await axios.post<GetAcknowledgementResponse>(url, args);
  return res.data;
};

const update = async (id: string, args?: UpdateAcknowledgementRequest) => {
  const url = controller + "/" + id;
  var res = await axios.put<GetAcknowledgementResponse>(url, args);
  return res.data;
};

const remove = async (id: string) => {
  const url = controller + "/" + id;
  var res = await axios.delete<GetAcknowledgementResponse>(url);
  return res.data;
};

export const AcknowledgementApi = {
  get,
  create,
  update,
  remove,
};
