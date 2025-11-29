import { UserRoundSearch } from "lucide-react";
import { useMemo, type FC } from "react";
import { StudentApi } from "../api/StudentApi";
import { AcknowledgementListItem } from "../components/AcknowledgementListItem";
import { StudentProfileCard } from "../components/StudentProfileCard";
import { StudentProfileCardSkeleton } from "../components/StudentProfileCardSkeleton";
import { AppEvents, emitEvent, useEvent } from "../hooks/useEvent";
import { useListQuery } from "../hooks/useQuery";
import { buildQuery, getQueryStringVariable } from "../utilities/utils";

const getQueryFromSearchValue = (value: string | null | undefined) => {
  if (!value) return undefined;

  const values: string[] = value.split(" ");
  return buildQuery({
    filter: {
      or: values.flatMap((x) => [
        { name: { contains: x } },
        { lastName: { contains: x } },
        { institutionalId: { contains: x } },
      ]),
    },
  });
};

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

  useEvent(AppEvents.RefreshStudentList, () => {
    studentHandlers.refetch();
  });

  useEvent(AppEvents.Search, (e) => {
    const query = getQueryFromSearchValue(e.detail?.value);
    history.pushState(null, "", `?search=${e.detail?.value}`);
    studentHandlers.fetch([query]);
  });

  useEvent(AppEvents.StudentCreated, (e) => {
    if (e.detail?.institutionalId) {
      const query = buildQuery({
        filter: { institutionalId: e.detail.institutionalId },
      });
      history.pushState(null, "", `?search=${e.detail?.institutionalId}`);
      studentHandlers.fetch([query]);
    }
  });

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
