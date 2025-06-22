import { useState } from "react";
import type { Skill } from "../skills.type";
import { mockedSkills } from "../skills.mock";

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>(mockedSkills);

  return { skills, setSkills };
}
