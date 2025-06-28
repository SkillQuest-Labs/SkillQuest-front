import { BrowserRouter, Routes, Route } from "react-router-dom";
import SkillsPage from "@/pages/Skills";
import SkillDetail from "@/pages/SkillDetail";
import { Canva } from "@/modules/canvas/Canva";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:skillId" element={<SkillDetail />} />
        <Route path="/canvas" element={<Canva />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
