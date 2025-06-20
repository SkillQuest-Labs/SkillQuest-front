import { ReactFlowProvider } from "@xyflow/react";
import { Canva } from "./modules/canvas/Canva";

function App() {
  return (
    <>
      <ReactFlowProvider>
        <Canva />
      </ReactFlowProvider>
    </>
  );
}

export default App;
