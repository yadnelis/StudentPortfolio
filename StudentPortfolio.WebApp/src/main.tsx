import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import AppLayout from "./pages/AppLayout.tsx";
import { StudentList } from "./pages/StudentList.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<StudentList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
