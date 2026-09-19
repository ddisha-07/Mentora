// src/lib/admin/services/xpService.ts

export interface XpHistoryItem {
 id: string;
 points: number;
 source: "lesson" | "exercise" | "flashcard" | "dialogue" | "quiz" | "task" | "bonus";
 reason: string;
 timestamp: string;
}

export interface UserXpData {
 totalXp: number;
 level: number;
 streakDays: number;
 lastActiveDate: string;
 history: XpHistoryItem[];
}

const STORAGE_KEY = "mentora_user_xp_v1";

const DEFAULT_XP_DATA: UserXpData = {
 totalXp: 180,
 level: 2,
 streakDays: 3,
 lastActiveDate: new Date().toISOString().slice(0, 10),
 history: [
 {
 id: "xph_1",
 points: 100,
 source: "bonus",
 reason: "Welcome to Mentora Academy! ",
 timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
 },
 {
 id: "xph_2",
 points: 80,
 source: "quiz",
 reason: "Passed Foundations Diagnostic Gate ",
 timestamp: new Date(Date.now() - 86400000).toISOString(),
 },
 ],
};

// Calculate level tier:
// Level 1: 0 - 100 XP
// Level 2: 101 - 300 XP
// Level 3: 301 - 600 XP
// Level 4: 601 - 1000 XP
// Level 5: 1001 - 1500 XP
// Level 6+: +600 XP per level
export function calculateLevel(totalXp: number): { level: number; currentLevelXp: number; nextLevelXp: number; progressPercent: number } {
 const thresholds = [0, 100, 300, 600, 1000, 1500, 2200, 3000, 4000, 5200];
 let level = 1;

 for (let i = 0; i < thresholds.length - 1; i++) {
 if (totalXp >= thresholds[i]) {
 level = i + 1;
 }
 }

 const currentFloor = thresholds[level - 1] || 0;
 const nextCeiling = thresholds[level] || currentFloor + 1000;
 const range = nextCeiling - currentFloor;
 const progressWithinLevel = Math.max(0, totalXp - currentFloor);
 const progressPercent = Math.min(100, Math.round((progressWithinLevel / range) * 100));

 return {
 level,
 currentLevelXp: progressWithinLevel,
 nextLevelXp: range,
 progressPercent,
 };
}

export function getStoredXpData(): UserXpData {
 if (typeof window === "undefined") return DEFAULT_XP_DATA;
 try {
 const raw = localStorage.getItem(STORAGE_KEY);
 if (!raw) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_XP_DATA));
 return DEFAULT_XP_DATA;
 }
 const parsed = JSON.parse(raw);
 const { level } = calculateLevel(parsed.totalXp || 0);
 return { ...parsed, level };
 } catch (err) {
 console.warn("Failed to read XP data from localStorage, using default", err);
 return DEFAULT_XP_DATA;
 }
}

export function saveXpData(data: UserXpData): void {
 if (typeof window === "undefined") return;
 try {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
 } catch (err) {
 console.error("Failed to save XP data to localStorage", err);
 }
}

export function addXp(
 points: number,
 source: "lesson" | "exercise" | "flashcard" | "dialogue" | "quiz" | "task" | "bonus",
 reason: string
): { updatedData: UserXpData; leveledUp: boolean; newLevel: number } {
 const current = getStoredXpData();
 const prevLevel = calculateLevel(current.totalXp).level;

 const newTotal = current.totalXp + points;
 const { level: newLevel } = calculateLevel(newTotal);
 const leveledUp = newLevel > prevLevel;

 const historyItem: XpHistoryItem = {
 id: `xph_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
 points,
 source,
 reason,
 timestamp: new Date().toISOString(),
 };

 const updated: UserXpData = {
 ...current,
 totalXp: newTotal,
 level: newLevel,
 lastActiveDate: new Date().toISOString().slice(0, 10),
 history: [historyItem, ...(current.history || []).slice(0, 49)],
 };

 saveXpData(updated);
 return { updatedData: updated, leveledUp, newLevel };
}
