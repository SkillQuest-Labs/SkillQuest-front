import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardUser } from "@/pages/dashboard/DashboardUser";
import { Skills } from "@/pages/dashboard/Skills";
import { Profil } from "@/pages/dashboard/Profil";
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { CanvasPage } from "./pages/dashboard/CanvasPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardUser />} />
          <Route path="skills" element={<Skills />} />
          <Route path="profil" element={<Profil />} />
          <Route path="canvas" element={<CanvasPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
