import { useState } from "react";
import type { Skill } from "../skills.type";
import { mockedSkills } from "../skills.mock";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>(mockedSkills);
  return { skills, setSkills };
};
