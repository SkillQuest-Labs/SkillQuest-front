import { useState } from "react";
import type { Skill } from "../skills.type";
import { mockedSkills } from "../skills.const";

export const useSkills = () => {
  const [skills, setSkills] = useState<Skill[]>(mockedSkills);
  return { skills, setSkills };
};
