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

export const getAcknowledgement = async (id: string) => {
  const url = `${controller}/${id}`;
  var res = await axios.get<GetAcknowledgementResponse>(url);
  return res.data;
};

export const postAcknowledgement = async (
  args?: CreateAcknowledgementRequest
) => {
  const url = controller;
  var res = await axios.post<GetAcknowledgementResponse>(url, args);
  return res.data;
};

export const putAcknowledgement = async (
  args?: UpdateAcknowledgementRequest
) => {
  const url = controller;
  var res = await axios.post<GetAcknowledgementResponse>(url, args);
  return res.data;
};
