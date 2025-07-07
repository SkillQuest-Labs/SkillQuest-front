import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardUser } from "@/pages/dashboard/DashboardUser";
import SkillsPage from "@/pages/Skills";
import { Profil } from "@/pages/dashboard/Profil";
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { CanvasPage } from "./pages/CanvasPage";
import { Store } from "./pages/dashboard/Store";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardUser />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="profil" element={<Profil />} />
          <Route path="store" element={<Store />} />
        </Route>
        <Route path="canvas" element={<CanvasPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
