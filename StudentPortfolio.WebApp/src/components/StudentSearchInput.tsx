import { useCallback, type FC } from "react";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import { SearchInput } from "./SearchInput";

export const StudentSearchInput: FC = () => {
  const onChangeDebounceValue = useCallback((value: string) => {
    emitEvent(AppEvents.Search, { value });
  }, []);

  return <SearchInput onChangeDebounceValue={onChangeDebounceValue} />;
};
