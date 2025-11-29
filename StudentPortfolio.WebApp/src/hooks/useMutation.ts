import { useThrottledCallback } from "@mantine/hooks";
import { useState } from "react";
import toast from "react-hot-toast";

interface options<TResult, TErrorResult = void> {
  onSuccess?: (args: TResult) => void;
  onSettled?: () => void;
  onError?: (reason: any) => TErrorResult;
  onServerError?: (reason: any) => TErrorResult;
}

export type MutateFN<TArgs, TResult> = (
  data: TArgs,
  options?: options<TResult, void> | undefined
) => void;

export const useMutation = <TArgs extends [...any], TResult>(
  fn: (...args: TArgs) => Promise<TResult>
) => {
  const [mutating, setMutating] = useState(false);

  const mutate = useThrottledCallback(
    async (data: TArgs, options?: options<TResult>) => {
      setMutating(true);
      await fn(...data)
        .then(options?.onSuccess)
        .catch((e) => {
          if (e?.status && e?.status >= 500 && e?.status % 500 > 100)
            toast.error("An unexpected server error occured.", {
              position: "bottom-center",
            });
          else options?.onError?.(e);
        })
        .finally(() => {
          options?.onSettled?.();
          setMutating(false);
        });
    },
    1000
  );

  return [mutate, { mutating }] as const;
};
