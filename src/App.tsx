import { BrowserRouter, Route, Routes } from "react-router-dom";
import { DashboardLayout } from "@/pages/dashboard/DashboardLayout";
import { DashboardUser } from "@/pages/DashboardUser";
import { Skills } from "@/pages/Skills";
import { Profil } from "@/pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardUser />} />
          <Route path="skills" element={<Skills />} />
          <Route path="profil" element={<Profil />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
