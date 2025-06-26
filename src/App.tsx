import { Navbar } from "./component/sidebar/Sidebar";
import { DashboardUser } from "./pages/DashboardUser";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Skills } from "./pages/Skills";
import { Profil } from "./pages/Profil";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<DashboardUser />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
