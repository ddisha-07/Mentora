import { mockSkills } from "../data/mockSkills";
import { uid, delay } from "../utils";

let _skills = [...mockSkills];

export async function getSkills() {
  await delay();
  return [..._skills];
}

export async function addSkill(skillDraft: any) {
  await delay();
  const newSkill = {
    id: uid("skl"),
    learners: 0,
    category: "Professional",
    level: "Beginner",
    ...skillDraft,
  };
  _skills = [newSkill, ..._skills];
  return newSkill;
}

export async function updateSkill(id: string, patch: any) {
  await delay();
  _skills = _skills.map((s) => (s.id === id ? { ...s, ...patch } : s));
  return _skills.find((s) => s.id === id);
}

export async function deleteSkill(id: string) {
  await delay();
  _skills = _skills.filter((s) => s.id !== id);
  return { id };
}
