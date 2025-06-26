import { DashboardUser } from "./pages/DashboardUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Skills } from "./pages/Skills";
import { Profil } from "./pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardUser />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/profil" element={<Profil />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
