import { Button } from "@/shared/components/ui/button";
import FuzzyText from "@/shared/components/ui/fuzzytext";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black gap-8">
      <div className="text-center">
        <div className="flex justify-center">
          <FuzzyText
            baseIntensity={0.2}
            hoverIntensity={0.5}
            enableHover={true}
            fontSize="clamp(4rem, 15vw, 12rem)"
            color="#ffffff"
          >
            403
          </FuzzyText>
        </div>
        <div className="mt-8 flex justify-center">
          <FuzzyText
            baseIntensity={0.15}
            hoverIntensity={0.4}
            enableHover={true}
            fontSize="clamp(1.5rem, 5vw, 3rem)"
            color="#ff4444"
          >
            Unauthorized Access. Please contact the administrator.
          </FuzzyText>
        </div>
      </div>
      <Button
        variant="ghost"
        className="px-6 py-3 bg-white text-black cursor-pointer font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-200"
        asChild
      >
        <Link to="/sign-in" className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Retour
        </Link>
      </Button>
    </div>
  );
};
