import { useListState } from "@mantine/hooks";
import { useCallback, useEffect, useState } from "react";
import type { BaseEntity } from "../types/dtos/_baseEntity";
import type { BaseResponse } from "../types/dtos/_baseResponse";

interface UseListQueryOptions<TData> {
  initialData?: TData[];
  doInitialFetch?: boolean;
  useQueryParams?: boolean;
  onError?: (e?: any) => void;
}

export const useListQuery = <TData extends BaseEntity, TArgs extends [...any]>(
  fn: (...args: TArgs) => Promise<BaseResponse<TData[]>>,
  initialArgs: TArgs,
  options?: UseListQueryOptions<TData>
) => {
  const [defaultArgs, setDefaultArgs] = useState(initialArgs);
  const [data, dataHandlers] = useListState<TData>(options?.initialData);
  const [lastFetched, setLastFetched] = useState<Date>(new Date());
  const [fetching, setIsFetching] = useState<boolean>(false);

  const fetch = useCallback(
    (args: TArgs) => {
      setLastFetched(new Date());
      setIsFetching(true);
      fn(...args)
        .then((response) => {
          dataHandlers.setState(response.entity);
        })
        .catch((e) => {
          options?.onError?.(e);
        })
        .finally(() => {
          setIsFetching(false);
        });
    },
    [fn]
  );

  const refetch = useCallback(
    async () => await fetch(defaultArgs),
    [fetch, defaultArgs]
  );

  const setItem = useCallback((id: string, data: TData) => {
    dataHandlers.applyWhere(
      (x) => x?.id === id,
      () => data
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    dataHandlers.filter((x) => x?.id !== id);
  }, []);

  const addItem = useCallback((data: TData) => {
    dataHandlers.append(data);
  }, []);

  useEffect(() => {
    if (
      options?.doInitialFetch === true ||
      (options?.initialData === undefined &&
        options?.doInitialFetch === undefined)
    ) {
      refetch();
    }
  }, []);

  return [
    data,
    {
      refetch,
      fetch,
      setItem,
      addItem,
      removeItem,
      setDefaultArgs,
    },
    {
      fetching,
      defaultArgs,
      lastFetched,
    },
  ] as const;
};
