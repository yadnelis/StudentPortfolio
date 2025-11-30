import { useListState } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import type { BaseEntity } from "../types/dtos/_baseEntity";
import type { BaseResponse } from "../types/dtos/_baseResponse";

interface UseListQueryOptions<TData> {
  initialData?: TData[];
  doInitialFetch?: boolean;
  useQueryParams?: boolean;
  onError?: (e?: any) => void;
}

export const useListQuery = <
  TData extends BaseEntity,
  TArgs extends [string, ...any]
>(
  fn: (...args: TArgs) => Promise<BaseResponse<TData[]>>,
  initialArgs: TArgs,
  options?: UseListQueryOptions<TData>
) => {
  const lastArgs = useRef<TArgs>(initialArgs);
  const page = useRef(0);
  const [defaultArgs, setDefaultArgs] = useState(initialArgs);
  const [data, dataHandlers] = useListState<TData>(options?.initialData);
  const [lastFetched, setLastFetched] = useState<Date>(new Date());
  const [fetching, setIsFetching] = useState<boolean>(false);
  const [fetchingMore, setIsFetchingMore] = useState<boolean>(false);

  const fetch = useCallback(
    (args: TArgs) => {
      setLastFetched(new Date());
      setIsFetching(true);
      lastArgs.current = [...args];

      const searchParams = new URLSearchParams(args[0]);
      searchParams.set("top", "100");
      args[0] = searchParams.toString();

      fn(...args)
        .then((response) => {
          page.current = 0;
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

  const fetchAppend = useCallback(() => {
    setLastFetched(new Date());
    setIsFetchingMore(true);
    const pagedArgs = lastArgs.current;

    const searchParams = new URLSearchParams(pagedArgs[0]);
    searchParams.set("top", "100");
    searchParams.set("skip", ((page.current + 1) * 100).toString());

    pagedArgs[0] = searchParams.toString();
    fn(...pagedArgs)
      .then((response) => {
        page.current++;
        dataHandlers.append(...response.entity);
      })
      .catch((e) => {
        options?.onError?.(e);
      })
      .finally(() => {
        setIsFetchingMore(false);
      });
  }, [fn]);

  const refetch = useCallback(() => fetch(defaultArgs), [fetch, defaultArgs]);

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
      fetchAppend,
    },
    {
      fetchingMore,
      fetching,
      defaultArgs,
      lastFetched,
      morePages: data.length % 100 === 0,
    },
  ] as const;
};
