import { useSkills } from "../hooks/use.Skills";
import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { useNavigate } from "react-router-dom";

export function SkillsList() {
  const { skills } = useSkills();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mes Skills</h1>
        <Button onClick={() => navigate("/canvas")}>Créer un skill</Button>
      </div>

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Card
            key={skill.id}
            className="p-4 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/skills/${skill.id}`)}
          >
            <h2 className="font-semibold text-lg">{skill.title}</h2>
            <p className="text-sm">🎯 Difficulté : {skill.difficulty}</p>
            <p className="text-sm">⏱️ Durée : {skill.duration} min</p>
            <p className="text-sm">📌 Statut : {skill.status}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
