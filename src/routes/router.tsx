import { BrowserRouter, Routes, Route } from "react-router-dom";
import SkillsPage from "@/pages/Skills";
import SkillDetail from "@/pages/SkillDetail";
import { Canvas } from "../modules/canvas/Canvas";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/skills/:skillId" element={<SkillDetail />} />
        <Route path="/canvas" element={<Canvas />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
