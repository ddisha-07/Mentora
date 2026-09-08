"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback, ReactNode } from "react";
import * as userService from "@/lib/admin/services/userService";
import * as skillService from "@/lib/admin/services/skillService";
import * as courseService from "@/lib/admin/services/courseService";
import * as scheduleService from "@/lib/admin/services/scheduleService";
import * as communityService from "@/lib/admin/services/communityService";
import * as taskService from "@/lib/admin/services/taskService";
import * as leaderboardService from "@/lib/admin/services/leaderboardService";
import { useToast } from "./ToastContext";

const AdminDataContext = createContext<any>(null);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const toast = useToast();

  const [users, setUsers] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [communities, setCommunities] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [u, sk, c, ev, com, t, lb] = await Promise.all([
        userService.getUsers(),
        skillService.getSkills(),
        courseService.getCourses(),
        scheduleService.getEvents(),
        communityService.getCommunities(),
        taskService.getTasks(),
        leaderboardService.getLeaderboard(),
      ]);
      setUsers(u);
      setSkills(sk);
      setCourses(c);
      setEvents(ev);
      setCommunities(com);
      setTasks(t);
      setLeaderboard(lb);
      setLoading(false);
    })();
  }, []);

  // ---- Users ----
  const addUser = useCallback(async (draft: any) => {
    const created = await userService.addUser(draft);
    setUsers((prev) => [created, ...prev]);
    toast.success(`${created.name} added`);
    return created;
  }, [toast]);

  const editUser = useCallback(async (id: string, patch: any) => {
    const updated = await userService.updateUser(id, patch);
    setUsers((prev) => prev.map((u) => (u.id === id ? updated : u)));
    toast.success("User updated");
    return updated;
  }, [toast]);

  const removeUser = useCallback(async (id: string) => {
    await userService.deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
    toast.success("User removed");
  }, [toast]);

  // ---- Skills ----
  const addSkill = useCallback(async (draft: any) => {
    const created = await skillService.addSkill(draft);
    setSkills((prev) => [created, ...prev]);
    toast.success(`${created.name} added`);
    return created;
  }, [toast]);

  const editSkill = useCallback(async (id: string, patch: any) => {
    const updated = await skillService.updateSkill(id, patch);
    setSkills((prev) => prev.map((s) => (s.id === id ? updated : s)));
    toast.success("Skill updated");
    return updated;
  }, [toast]);

  const removeSkill = useCallback(async (id: string) => {
    await skillService.deleteSkill(id);
    setSkills((prev) => prev.filter((s) => s.id !== id));
    toast.success("Skill removed");
  }, [toast]);

  // ---- Courses ----
  const addCourse = useCallback(async (draft: any) => {
    const created = await courseService.addCourse(draft);
    setCourses((prev) => [created, ...prev]);
    toast.success(`${created.title} created`);
    return created;
  }, [toast]);

  const editCourse = useCallback(async (id: string, patch: any) => {
    const updated = await courseService.updateCourse(id, patch);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    return updated;
  }, []);

  const removeCourse = useCallback(async (id: string) => {
    await courseService.deleteCourse(id);
    setCourses((prev) => prev.filter((c) => c.id !== id));
    toast.success("Course deleted");
  }, [toast]);

  const setCourseStatus = useCallback(async (id: string, status: string) => {
    const updated = await courseService.setCourseStatus(id, status);
    setCourses((prev) => prev.map((c) => (c.id === id ? updated : c)));
    toast.success(status === "Published" ? "Course published" : "Moved to draft");
    return updated;
  }, [toast]);

  const addModule = useCallback(async (courseId: string, draft: any) => {
    await courseService.addModule(courseId, draft);
    const refreshed = await courseService.getCourses();
    setCourses(refreshed);
    toast.success("Module added");
  }, [toast]);

  const deleteModule = useCallback(async (courseId: string, moduleId: string) => {
    await courseService.deleteModule(courseId, moduleId);
    const refreshed = await courseService.getCourses();
    setCourses(refreshed);
    toast.success("Module removed");
  }, [toast]);

  const addLesson = useCallback(async (courseId: string, moduleId: string, draft: any) => {
    await courseService.addLesson(courseId, moduleId, draft);
    const refreshed = await courseService.getCourses();
    setCourses(refreshed);
    toast.success("Lesson added");
  }, [toast]);

  const deleteLesson = useCallback(async (courseId: string, moduleId: string, lessonId: string) => {
    await courseService.deleteLesson(courseId, moduleId, lessonId);
    const refreshed = await courseService.getCourses();
    setCourses(refreshed);
    toast.success("Lesson removed");
  }, [toast]);

  // ---- Schedule ----
  const addEvent = useCallback(async (draft: any) => {
    const created = await scheduleService.addEvent(draft);
    setEvents((prev) => [...prev, created]);
    toast.success("Event scheduled");
    return created;
  }, [toast]);

  const editEvent = useCallback(async (id: string, patch: any) => {
    const updated = await scheduleService.updateEvent(id, patch);
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
    toast.success("Event updated");
    return updated;
  }, [toast]);

  const removeEvent = useCallback(async (id: string) => {
    await scheduleService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event removed");
  }, [toast]);

  // ---- Community ----
  const addCommunity = useCallback(async (draft: any) => {
    const created = await communityService.addCommunity(draft);
    setCommunities((prev) => [created, ...prev]);
    toast.success(`${created.name} created`);
    return created;
  }, [toast]);

  const editCommunity = useCallback(async (id: string, patch: any) => {
    const updated = await communityService.updateCommunity(id, patch);
    setCommunities((prev) => prev.map((c) => (c.id === id ? updated : c)));
    toast.success("Community updated");
    return updated;
  }, [toast]);

  const removeCommunity = useCallback(async (id: string) => {
    await communityService.deleteCommunity(id);
    setCommunities((prev) => prev.filter((c) => c.id !== id));
    toast.success("Community deleted");
  }, [toast]);

  const addMember = useCallback(async (communityId: string, member: any) => {
    await communityService.addMember(communityId, member);
    const refreshed = await communityService.getCommunities();
    setCommunities(refreshed);
    toast.success("Member added");
  }, [toast]);

  const removeMember = useCallback(async (communityId: string, memberId: string) => {
    await communityService.removeMember(communityId, memberId);
    const refreshed = await communityService.getCommunities();
    setCommunities(refreshed);
    toast.success("Member removed");
  }, [toast]);

  // ---- Tasks ----
  const addTask = useCallback(async (draft: any) => {
    const created = await taskService.addTask(draft);
    setTasks((prev) => [created, ...prev]);
    toast.success("Task added");
    return created;
  }, [toast]);

  const editTask = useCallback(async (id: string, patch: any) => {
    const updated = await taskService.updateTask(id, patch);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    return updated;
  }, []);

  const removeTask = useCallback(async (id: string) => {
    await taskService.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    toast.success("Task removed");
  }, [toast]);

  // ---- Leaderboard ----
  const addPoints = useCallback(async (id: string, amount: number) => {
    const refreshed = await leaderboardService.addPoints(id, amount);
    setLeaderboard(refreshed);
    toast.success(`+${amount} points`);
  }, [toast]);

  const removePoints = useCallback(async (id: string, amount: number) => {
    const refreshed = await leaderboardService.removePoints(id, amount);
    setLeaderboard(refreshed);
    toast.success(`-${amount} points`);
  }, [toast]);

  const setPoints = useCallback(async (id: string, amount: number) => {
    const refreshed = await leaderboardService.setPoints(id, amount);
    setLeaderboard(refreshed);
    toast.success("Points updated");
  }, [toast]);

  const value = useMemo(
    () => ({
      loading,
      users, addUser, editUser, removeUser,
      skills, addSkill, editSkill, removeSkill,
      courses, addCourse, editCourse, removeCourse, setCourseStatus,
      addModule, deleteModule, addLesson, deleteLesson,
      events, addEvent, editEvent, removeEvent,
      communities, addCommunity, editCommunity, removeCommunity, addMember, removeMember,
      tasks, addTask, editTask, removeTask,
      leaderboard, addPoints, removePoints, setPoints,
    }),
    [loading, users, skills, courses, events, communities, tasks, leaderboard,
      addUser, editUser, removeUser, addSkill, editSkill, removeSkill,
      addCourse, editCourse, removeCourse, setCourseStatus, addModule, deleteModule, addLesson, deleteLesson,
      addEvent, editEvent, removeEvent, addCommunity, editCommunity, removeCommunity, addMember, removeMember,
      addTask, editTask, removeTask, addPoints, removePoints, setPoints]
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
