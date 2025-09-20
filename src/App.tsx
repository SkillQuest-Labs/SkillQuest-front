import { RouterProvider } from "react-router-dom";
import { useState } from "react";
import { router } from "./routes/router";
import DebugModal from "./component/debug-modal/DebugModal";

function App() {
  const [isDebugModalOpen, setIsDebugModalOpen] = useState(false);

  const toggleDebugModal = () => {
    setIsDebugModalOpen((prev) => !prev);
  };

  return (
    <>
      <RouterProvider router={router} />
      {import.meta.env.DEV && (
        <>
          <DebugModal isOpen={isDebugModalOpen} onToggle={toggleDebugModal} />
        </>
      )}
    </>
  );
}

export default App;
