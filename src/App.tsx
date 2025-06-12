import { Button } from "./shared/components/ui/button";

function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-500">met ca au centre de la page</div>
        <Button>Button</Button>
      </div>
    </>
  );
}

export default App;
