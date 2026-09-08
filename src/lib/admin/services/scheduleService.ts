import { mockEvents } from "../data/mockSchedule";
import { uid, delay } from "../utils";

let _events = [...mockEvents];

export async function getEvents() {
  await delay();
  return [..._events];
}

export async function addEvent(eventDraft: any) {
  await delay();
  const newEvent = { id: uid("evt"), type: "Webinar", location: "Online", ...eventDraft };
  _events = [..._events, newEvent];
  return newEvent;
}

export async function updateEvent(id: string, patch: any) {
  await delay();
  _events = _events.map((e) => (e.id === id ? { ...e, ...patch } : e));
  return _events.find((e) => e.id === id);
}

export async function deleteEvent(id: string) {
  await delay();
  _events = _events.filter((e) => e.id !== id);
  return { id };
}
