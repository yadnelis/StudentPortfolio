import { MantineProvider } from "@mantine/core";
// import "@mantine/core/styles.layer.css";

import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import { Layout } from "../components/LayoutComponents";
import { CreateAcknowledgementModal } from "./portals/CreateAcknowledgementModal";
import { CreateStudentModal } from "./portals/CreateStudentModal";
import { UpdateAcknowledgementModal } from "./portals/UpdateAcknowledgementModal";
import { UpdateStudentModal } from "./portals/UpdateStudentModal";

export default function AppLayout() {
  return (
    <Layout>
      <MantineProvider>
        <Layout.Header />
        <main className="overflow-auto max-w-dvw w-dvw">
          <Outlet />
        </main>
        {/* Portals: Modals, Dialogs and sidebars */}
        <Layout.Portals>
          <CreateStudentModal />
          <CreateAcknowledgementModal />
          <UpdateAcknowledgementModal />
          <UpdateStudentModal />
        </Layout.Portals>
        <Toaster />
      </MantineProvider>
    </Layout>
  );
}
