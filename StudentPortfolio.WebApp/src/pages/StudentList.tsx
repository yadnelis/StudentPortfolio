import { useListState } from "@mantine/hooks";
import { useEffect, type FC } from "react";
import { StudentApi } from "../api/StudentApi";
import {
  AcknowledgementListItem,
  StudentProfileCard,
} from "../components/StudentProfileCard";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import type { Student } from "../types/dtos/student";

export const StudentList: FC = () => {
  const [students, studentHandlers] = useListState<Student>();

  const get = async () => {
    const students = await StudentApi.getAll();
    studentHandlers.setState(students.entity);
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <section className="flex flex-col gap-12 justify-center items-center w-full p-12">
      {students?.map((st) => (
        <StudentProfileCard
          key={st.id}
          student={st}
          onClickAddAcknowledgement={() => {
            emitEvent(AppEvents.OpenCreateAcknowledgementModal, st);
          }}
        >
          {st.acknowledgements?.map((ack) => (
            <AcknowledgementListItem
              key={ack.id}
              acknowledgement={ack}
              student={st}
            />
          ))}
        </StudentProfileCard>
      ))}
    </section>
  );
};
