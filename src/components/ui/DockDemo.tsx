'use client';

import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Users,
  Trophy,
  Award,
  MessageSquare,
  Sparkles,
  Settings,
} from 'lucide-react';
import HamburgerDock from './HamburgerDock';
import { useRouter } from 'next/navigation';

export default function DockDemo() {
  const router = useRouter();

  const dockItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
      onClick: () => router.push('/dashboard'),
    },
    {
      icon: <Compass size={20} />,
      label: 'Journeys',
      onClick: () => router.push('/dashboard/journeys'),
    },
    {
      icon: <BookOpen size={20} />,
      label: 'Courses',
      onClick: () => router.push('/dashboard/courses'),
    },
    {
      icon: <Users size={20} />,
      label: 'Community',
      onClick: () => router.push('/dashboard/community'),
    },
    {
      icon: <Trophy size={20} />,
      label: 'Leaderboard',
      onClick: () => router.push('/dashboard/leaderboard'),
    },
    {
      icon: <Award size={20} />,
      label: 'Skill Passport',
      onClick: () => router.push('/dashboard/passport'),
    },
    {
      icon: <MessageSquare size={20} />,
      label: 'Mentorship',
      onClick: () => router.push('/dashboard/mentorship'),
    },
    {
      icon: <Sparkles size={20} className="text-amber-400" />,
      label: 'Kai AI Assistant',
      onClick: () => router.push('/dashboard/kai'),
    },
    {
      icon: <Settings size={20} />,
      label: 'Settings',
      onClick: () => router.push('/dashboard/settings'),
    },
  ];

  return <HamburgerDock items={dockItems} position="left" defaultOpen={true} />;
}
