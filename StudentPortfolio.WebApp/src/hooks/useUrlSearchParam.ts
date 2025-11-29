import { useLocation } from "react-router";

export const useUrlSearchParam = (param: string) => {
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const value = searchParams.get(param) ?? "";

  return [value];
};
