'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { PredefinedCourse } from '@/lib/courses/courseFormatter';

interface PredefinedCourseCardProps {
  course: PredefinedCourse;
  isEnrolled?: boolean;
  onEnrollToggle?: (courseId: string) => void;
  onViewSyllabus?: (course: PredefinedCourse) => void;
  actionLabel?: string;
  className?: string;
}

export default function PredefinedCourseCard({
  course,
  isEnrolled = false,
  onEnrollToggle,
  onViewSyllabus,
  actionLabel,
  className = '',
}: PredefinedCourseCardProps) {
  const { isBright } = useTheme();

  const cardBg = isBright ? '#FFFFFF' : '#1A130D';
  const cardBorder = isBright ? 'rgba(234,88,12,0.14)' : 'rgba(255,107,53,0.16)';
  const cardShadow = isBright
    ? '0 4px 20px -2px rgba(234,88,12,0.06)'
    : '0 4px 24px -2px rgba(0,0,0,0.45)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.55)';
  const textSub = isBright ? '#A8A29E' : 'rgba(255,248,240,0.35)';

  const handleCardClick = () => {
    if (onViewSyllabus) {
      onViewSyllabus(course);
    } else if (onEnrollToggle) {
      onEnrollToggle(course.id);
    }
  };

  return (
    <div
      id={`course-card-${course.id}`}
      onClick={handleCardClick}
      className={`flex-shrink-0 w-[270px] rounded-2xl flex flex-col transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer overflow-hidden group select-none ${className}`}
      style={{
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        boxShadow: cardShadow,
      }}
    >
      {/* ─── Top Visual Banner ─── */}
      <div
        className="relative w-full h-32 rounded-t-2xl overflow-hidden flex flex-col justify-between p-3"
        style={{ background: course.bannerBg }}
      >
        {/* Background Image if custom or template thumbnail */}
        {course.thumbnail && (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${course.thumbnail})` }}
          />
        )}

        {/* High-contrast gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 pointer-events-none" />

        {/* Tech Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.25) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Radial Ambient Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 85% 15%, rgba(255,255,255,0.3) 0%, transparent 60%)',
          }}
        />

        {/* Header Badges Row */}
        <div className="relative z-10 flex items-center justify-between w-full">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FF6B35] text-white shadow-md uppercase tracking-wider">
            {course.level || 'Beginner'}
          </span>
          <div className="w-6 h-6 rounded-md bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-[10px] font-black text-white shadow-sm">
            {course.techLogo || '⚡'}
          </div>
        </div>

        {/* Bottom Banner Typography / Vector */}
        <div className="relative z-10 flex items-end justify-between gap-1 mt-auto">
          <div className="max-w-[70%] pb-0.5">
            <span className="text-[9px] font-bold text-orange-300 uppercase tracking-widest font-mono block truncate">
              {course.category}
            </span>
            <p className="text-[11px] font-black leading-tight tracking-wider text-white uppercase drop-shadow-md line-clamp-2">
              {course.bannerText}
            </p>
          </div>

          {/* Right-side Vector Art if no image */}
          {!course.thumbnail && (
            <div className="w-16 h-12 relative flex items-center justify-center shrink-0">
              <svg viewBox="0 0 100 80" fill="none" className="w-full h-full drop-shadow-md">
                <rect x="10" y="10" width="76" height="50" rx="5" fill="#0F172A" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                <rect x="16" y="18" width="28" height="4" rx="2" fill="#FF6B35" />
                <rect x="16" y="26" width="44" height="4" rx="2" fill="#FBBF24" opacity="0.9" />
                <circle cx="74" cy="30" r="10" fill="#FF6B35" stroke="white" strokeWidth="1" />
                <text x="74" y="34" textAnchor="middle" fill="white" fontSize="8" fontWeight="900">AI</text>
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* ─── Bottom Card Body ─── */}
      <div className="p-3.5 flex flex-col justify-between flex-1 space-y-2.5">
        <div>
          {/* Course Title */}
          <h4
            className="text-xs font-bold leading-snug line-clamp-2 min-h-[34px] transition-colors group-hover:text-[#FF6B35]"
            style={{ color: textPrimary }}
          >
            {course.title}
          </h4>

          {/* Reason / Gap Bridged or Description */}
          {course.reason && (
            <p className="text-[10px] mt-1.5 leading-relaxed font-mono line-clamp-2" style={{ color: textMuted }}>
              <span className="text-orange-500 font-bold">Why: </span>
              {course.reason}
            </p>
          )}

          {/* Key Topics Pills */}
          {course.keyTopics && course.keyTopics.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {course.keyTopics.slice(0, 3).map((topic: string, tidx: number) => (
                <span
                  key={tidx}
                  className="text-[9px] font-mono px-1.5 py-0.5 rounded-md border"
                  style={{
                    background: isBright ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)',
                    borderColor: isBright ? '#E5D7C8' : 'rgba(255,255,255,0.1)',
                    color: textMuted,
                  }}
                >
                  {topic}
                </span>
              ))}
            </div>
          )}

          {/* Duration, Level & Students Metadata */}
          <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono" style={{ color: textSub }}>
            <span>⏱ {course.duration || '6 Weeks'}</span>
            <span>{course.modulesCount > 0 ? `${course.modulesCount} modules` : `Level: ${course.level}`}</span>
          </div>
        </div>

        {/* ─── Action Button ─── */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onEnrollToggle) {
              onEnrollToggle(course.id);
            } else if (onViewSyllabus) {
              onViewSyllabus(course);
            }
          }}
          className={`w-full py-2 rounded-full text-xs font-bold transition-all duration-200 border flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
            isEnrolled
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'hover:bg-[#FF6B35] hover:text-white hover:border-[#FF6B35]'
          }`}
          style={
            !isEnrolled
              ? {
                  borderColor: isBright ? 'rgba(234,88,12,0.35)' : 'rgba(255,107,53,0.35)',
                  color: '#FF6B35',
                  background: isBright ? 'rgba(255,107,53,0.04)' : 'rgba(255,107,53,0.08)',
                }
              : undefined
          }
        >
          {isEnrolled ? (
            <>
              <span>✓</span>
              <span>Enrolled in Pathway</span>
            </>
          ) : actionLabel ? (
            <>
              <span>{actionLabel}</span>
              <span>→</span>
            </>
          ) : (
            <>
              <span>Start Learning</span>
              <span>→</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
