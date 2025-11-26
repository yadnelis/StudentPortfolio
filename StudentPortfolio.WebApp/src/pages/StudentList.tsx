import { useListState } from "@mantine/hooks";
import { useEffect, type FC } from "react";
import { getStudents } from "../api/students";
import {
  AcknowledgementListItem,
  StudentProfileCard,
} from "../components/StudentProfileCard";
import { AppEvents, emitEvent } from "../hooks/useEvent";
import type { Student } from "../types/dtos/student";

export const StudentList: FC = () => {
  const [students, studentHandlers] = useListState<Student>();
  useEffect(() => {
    const get = async () => {
      const students = await getStudents();
      studentHandlers.setState(students.entity);
    };

    get();
  }, []);

  return (
    <section className="flex flex-col gap-12 justify-center items-center w-full p-12">
      {students?.map((st) => (
        <StudentProfileCard
          key={st.id}
          {...st}
          fullName={st.fullName}
          institutionalId={st.institutionalId}
          onClickAddAcknowledgement={() => {
            emitEvent(AppEvents.OpenCreateAcknowledgementModal, st);
          }}
        >
          {st.acknowledgements?.map((ack) => (
            <AcknowledgementListItem key={ack.id} {...ack} />
          ))}
        </StudentProfileCard>
      ))}
    </section>
  );
};
