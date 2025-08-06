import { Button } from "@/shared/components/ui/button";
import { Map } from "lucide-react";

type RoadmapButtonProps = {
  onClick: () => void;
};

export const RoadmapButton = ({ onClick }: RoadmapButtonProps) => (
  <Button
    variant="outline"
    size="sm"
    aria-label="Afficher la roadmap"
    onClick={onClick}
    className="bg-[#0C0821] hover:bg-gray-700 text-white hover:text-white px-4 py-2 rounded-lg shadow-lg transition-colors cursor-pointer duration-200 flex items-center gap-2"
  >
    <Map className="w-5 h-5" />
    Roadmap
  </Button>
);
