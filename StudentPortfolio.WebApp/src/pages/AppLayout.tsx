import { MantineProvider } from "@mantine/core";
// import "@mantine/core/styles.layer.css";

import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import { Layout } from "../components/LayoutComponents";
import { CreateAcknowledgementModal } from "./portals/CreateAcknowledgementModal";
import { CreateStudentModal } from "./portals/CreateStudentModal";

export default function AppLayout() {
  return (
    <Layout>
      <MantineProvider>
        <Layout.Header />
        <main className="overflow-auto">
          <Outlet />
        </main>
        {/* Portals: Modals, Dialogs and sidebars */}
        <Layout.Portals>
          <CreateStudentModal />
          <CreateAcknowledgementModal />
        </Layout.Portals>
        <Toaster />
      </MantineProvider>
    </Layout>
  );
}
