import { mockTasks } from "../data/mockTasks";
import { uid, delay } from "../utils";

let _tasks = [...mockTasks];

export async function getTasks() {
  await delay();
  return [..._tasks];
}

export async function addTask(taskDraft: any) {
  await delay();
  const newTask = {
    id: uid("tsk"),
    points: 10,
    difficulty: "Easy",
    active: true,
    date: new Date().toISOString().slice(0, 10),
    ...taskDraft,
  };
  _tasks = [newTask, ..._tasks];
  return newTask;
}

export async function updateTask(id: string, patch: any) {
  await delay();
  _tasks = _tasks.map((t) => (t.id === id ? { ...t, ...patch } : t));
  return _tasks.find((t) => t.id === id);
}

export async function deleteTask(id: string) {
  await delay();
  _tasks = _tasks.filter((t) => t.id !== id);
  return { id };
}

export async function setTaskPoints(id: string, points: number) {
  return updateTask(id, { points });
}

export async function setTaskDate(id: string, date: string) {
  return updateTask(id, { date });
}

export async function setTaskDifficulty(id: string, difficulty: string) {
  return updateTask(id, { difficulty });
}
