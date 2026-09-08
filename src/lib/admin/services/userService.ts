import { mockUsers } from "../data/mockUsers";
import { uid, delay } from "../utils";

let _users = [...mockUsers];

export async function getUsers() {
  await delay();
  return [..._users];
}

export async function getUserById(id: string) {
  await delay(150);
  return _users.find((u) => u.id === id) || null;
}

export async function addUser(userDraft: any) {
  await delay();
  const newUser = {
    id: uid("usr"),
    status: "Active",
    plan: "Free",
    points: 0,
    coursesEnrolled: 0,
    joinedAt: new Date().toISOString().slice(0, 10),
    avatarColor: randomColor(),
    ...userDraft,
  };
  _users = [newUser, ..._users];
  return newUser;
}

export async function updateUser(id: string, patch: any) {
  await delay();
  _users = _users.map((u) => (u.id === id ? { ...u, ...patch } : u));
  return _users.find((u) => u.id === id);
}

export async function deleteUser(id: string) {
  await delay();
  _users = _users.filter((u) => u.id !== id);
  return { id };
}

function randomColor() {
  const palette = ["#ff7a1a", "#5c8bff", "#34d399", "#c084fc", "#f87171", "#ffb74d", "#38bdf8"];
  return palette[Math.floor(Math.random() * palette.length)];
}
