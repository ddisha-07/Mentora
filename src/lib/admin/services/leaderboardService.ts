import { mockLeaderboard } from "../data/mockLeaderboard";
import { delay } from "../utils";

let _board = [...mockLeaderboard];

function sorted() {
  return [..._board].sort((a, b) => b.points - a.points);
}

export async function getLeaderboard() {
  await delay();
  return sorted();
}

export async function addPoints(id: string, amount: number) {
  await delay(200);
  _board = _board.map((e) =>
    e.id === id ? { ...e, points: Math.max(0, e.points + Math.abs(amount)) } : e
  );
  return sorted();
}

export async function removePoints(id: string, amount: number) {
  await delay(200);
  _board = _board.map((e) =>
    e.id === id ? { ...e, points: Math.max(0, e.points - Math.abs(amount)) } : e
  );
  return sorted();
}

export async function setPoints(id: string, amount: number) {
  await delay(200);
  _board = _board.map((e) => (e.id === id ? { ...e, points: Math.max(0, amount) } : e));
  return sorted();
}
