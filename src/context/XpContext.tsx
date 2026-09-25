"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  getStoredXpData,
  addXp as addXpService,
  calculateLevel,
  UserXpData,
  XpHistoryItem,
} from "@/lib/admin/services/xpService";
import { useToast } from "@/context/admin/ToastContext";

interface XpContextType {
  xpData: UserXpData;
  totalXp: number;
  level: number;
  levelProgress: number;
  currentLevelXp: number;
  nextLevelXp: number;
  streakDays: number;
  history: XpHistoryItem[];
  awardXp: (
    points: number,
    source: "lesson" | "exercise" | "flashcard" | "dialogue" | "quiz" | "task" | "bonus",
    reason: string
  ) => void;
  levelUpNotification: { newLevel: number; pointsGained: number } | null;
  clearLevelUpNotification: () => void;
}

const XpContext = createContext<XpContextType | null>(null);

export function XpProvider({ children }: { children: ReactNode }) {
  const [xpData, setXpData] = useState<UserXpData>({
    totalXp: 180,
    level: 2,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    history: [],
  });
  const [levelUpNotification, setLevelUpNotification] = useState<{ newLevel: number; pointsGained: number } | null>(null);

  useEffect(() => {
    setXpData(getStoredXpData());

    const handleXpUpdate = (e: any) => {
      if (e?.detail) setXpData(e.detail);
      else setXpData(getStoredXpData());
    };

    window.addEventListener("mentora_xp_updated", handleXpUpdate);
    window.addEventListener("storage", handleXpUpdate);

    return () => {
      window.removeEventListener("mentora_xp_updated", handleXpUpdate);
      window.removeEventListener("storage", handleXpUpdate);
    };
  }, []);

  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevel(xpData.totalXp);

  const awardXp = (
    points: number,
    source: "lesson" | "exercise" | "flashcard" | "dialogue" | "quiz" | "task" | "bonus",
    reason: string
  ) => {
    const { updatedData, leveledUp, newLevel } = addXpService(points, source, reason);
    setXpData(updatedData);

    if (leveledUp) {
      setLevelUpNotification({ newLevel, pointsGained: points });
    }
  };

  const clearLevelUpNotification = () => setLevelUpNotification(null);

  return (
    <XpContext.Provider
      value={{
        xpData,
        totalXp: xpData.totalXp,
        level,
        levelProgress: progressPercent,
        currentLevelXp,
        nextLevelXp,
        streakDays: xpData.streakDays,
        history: xpData.history,
        awardXp,
        levelUpNotification,
        clearLevelUpNotification,
      }}
    >
      {children}
    </XpContext.Provider>
  );
}

export function useXp() {
  const context = useContext(XpContext);
  if (!context) {
    // Fallback for components rendered outside provider
    return {
      xpData: { totalXp: 180, level: 2, streakDays: 3, lastActiveDate: "", history: [] },
      totalXp: 180,
      level: 2,
      levelProgress: 40,
      currentLevelXp: 80,
      nextLevelXp: 200,
      streakDays: 3,
      history: [],
      awardXp: () => {},
      levelUpNotification: null,
      clearLevelUpNotification: () => {},
    };
  }
  return context;
}
