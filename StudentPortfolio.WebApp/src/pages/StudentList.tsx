import { UserRoundSearch } from "lucide-react";
import { useMemo, type FC } from "react";
import { StudentApi } from "../api/StudentApi";
import { AcknowledgementListItem } from "../components/AcknowledgementListItem";
import { StudentProfileCard } from "../components/StudentProfileCard";
import { StudentProfileCardSkeleton } from "../components/StudentProfileCardSkeleton";
import { AppEvents, emitEvent, useEvent } from "../hooks/useEvent";
import { useListQuery } from "../hooks/useQuery";
import {
  getQueryFromSearchValue,
  getQueryStringVariable,
} from "../utilities/utils";

export const StudentList: FC = () => {
  const initialSearch = useMemo(
    () => getQueryFromSearchValue(getQueryStringVariable("search")),
    []
  );

  const [students, studentHandlers, studentMeta] = useListQuery(
    StudentApi.getAll,
    [initialSearch],
    {}
  );

  const search = (value: string | undefined) => {
    const query = getQueryFromSearchValue(value);
    history.pushState(null, "", `?search=${value}`);
    studentHandlers.fetch([query]);
  };

  useEvent(AppEvents.RefreshStudentList, () => {
    studentHandlers.refetch();
  });

  useEvent(
    [
      AppEvents.AcknowledgementCreated,
      AppEvents.AcknowledgementDeleted,
      AppEvents.AcknowledgementEdited,
    ],
    (e) => {
      console.log("dsajfh ujo", e);
      search(e.detail?.student?.institutionalId);
    }
  );

  useEvent([AppEvents.StudentCreated, AppEvents.StudentEdited], (e) =>
    search(e.detail?.institutionalId)
  );

  useEvent(AppEvents.Search, (e) => search(e.detail?.value));

  useEvent(AppEvents.StudentDeleted, (e) => {
    if (e.detail?.id) {
      studentHandlers.removeItem(e.detail.id);
    }
  });

  return (
    <section className="relative flex flex-col h-full gap-12 items-center w-full p-12 overflow-y-auto overflow-x-hidden">
      {studentMeta.fetching ? (
        <>
          <StudentProfileCardSkeleton visible={studentMeta.fetching} />
          <StudentProfileCardSkeleton visible={studentMeta.fetching} />
        </>
      ) : students?.length && students.length > 0 ? (
        students?.map((st, i) => (
          <StudentProfileCard
            key={st?.id + i}
            student={st}
            onClickAddAcknowledgement={() => {
              emitEvent(AppEvents.OpenCreateAcknowledgementModal, st);
            }}
          >
            {st?.acknowledgements?.map((ack, i) => (
              <AcknowledgementListItem
                key={ack.id + i}
                acknowledgement={ack}
                student={st}
              />
            ))}
          </StudentProfileCard>
        ))
      ) : (
        <div className="h-full w-full flex justify-center items-center">
          <div className="flex gap-5 items-center text-slate-600">
            <UserRoundSearch className="size-10 stroke-2" />
            <span className="font-bold text-lg">
              No results... Try searching something else
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
