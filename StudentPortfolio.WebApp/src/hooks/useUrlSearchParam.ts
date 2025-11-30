export const useUrlSearchParam = (param: string) => {
  const { search } = window.location;
  const searchParams = new URLSearchParams(search);
  const value = searchParams.get(param) ?? "";

  return [value];
};
