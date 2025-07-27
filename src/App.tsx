import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;
