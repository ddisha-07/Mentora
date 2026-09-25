'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { PredefinedCourse } from '@/lib/courses/courseFormatter';
import Link from 'next/link';

interface CoursePreviewModalProps {
  course: PredefinedCourse | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (courseId: string) => void;
  isEnrolled?: boolean;
  ctaMode?: 'enroll' | 'login' | 'dashboard';
}

export default function CoursePreviewModal({
  course,
  isOpen,
  onClose,
  onEnroll,
  isEnrolled = false,
  ctaMode = 'enroll',
}: CoursePreviewModalProps) {
  const { isBright } = useTheme();

  if (!isOpen || !course) return null;

  const bgModal = isBright ? '#FFFFFF' : '#140E0A';
  const borderColor = isBright ? '#EAE0D5' : 'rgba(255,107,53,0.2)';
  const textPrimary = isBright ? '#1C1917' : '#FFF8F0';
  const textMuted = isBright ? '#78716C' : 'rgba(255,248,240,0.6)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl border"
        style={{
          background: bgModal,
          borderColor,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Banner */}
        <div
          className="relative w-full p-6 flex flex-col justify-end min-h-[160px] overflow-hidden"
          style={{ background: course.bannerBg }}
        >
          {course.thumbnail && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${course.thumbnail})` }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-black/30 pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/50 text-white hover:bg-black/80 flex items-center justify-center transition-colors text-sm"
          >
            ✕
          </button>

          <div className="relative z-10 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#FF6B35] text-white">
                {course.level}
              </span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm">
                {course.category}
              </span>
              <span className="text-[10px] font-mono text-white/70 ml-auto">
                ⏱ {course.duration} • {course.students} learners
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {course.title}
            </h2>
            <p className="text-xs text-white/80 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key stats row */}
          <div
            className="grid grid-cols-3 gap-3 p-3.5 rounded-2xl border text-center"
            style={{
              background: isBright ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
              borderColor: isBright ? '#EAE0D5' : 'rgba(255,255,255,0.08)',
            }}
          >
            <div>
              <span className="text-[10px] font-mono uppercase block" style={{ color: textMuted }}>
                Curriculum
              </span>
              <span className="text-sm font-black" style={{ color: textPrimary }}>
                {course.modulesCount || 4} Modules
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase block" style={{ color: textMuted }}>
                Instructor / Author
              </span>
              <span className="text-sm font-black truncate block" style={{ color: textPrimary }}>
                {course.author}
              </span>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase block" style={{ color: textMuted }}>
                Mastery Gate
              </span>
              <span className="text-sm font-black text-orange-500">
                70% Strict Pass
              </span>
            </div>
          </div>

          {/* Curriculum breakdown */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider font-bold mb-3" style={{ color: textMuted }}>
              Syllabus & Module Roadmap
            </h3>

            {course.modules && course.modules.length > 0 ? (
              <div className="space-y-2.5">
                {course.modules.map((mod: any, idx: number) => (
                  <div
                    key={mod.id || idx}
                    className="p-3.5 rounded-xl border flex items-start gap-3 transition-colors"
                    style={{
                      background: isBright ? '#FAF8F5' : 'rgba(255,255,255,0.02)',
                      borderColor: isBright ? '#EAE0D5' : 'rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="w-6 h-6 rounded-lg bg-[#FF6B35]/15 text-[#FF6B35] font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs font-bold truncate" style={{ color: textPrimary }}>
                          {mod.title || `Module ${idx + 1}`}
                        </h4>
                        <span className="text-[10px] font-mono shrink-0" style={{ color: textMuted }}>
                          {mod.duration || mod.readTime || '45m'}
                        </span>
                      </div>
                      {mod.tagline && (
                        <p className="text-[11px] mt-0.5" style={{ color: textMuted }}>
                          {mod.tagline}
                        </p>
                      )}
                      {mod.video?.title && (
                        <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-orange-400 font-mono">
                          <span>▶</span>
                          <span className="truncate">{mod.video.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border text-center text-xs" style={{ color: textMuted }}>
                Complete curriculum syllabus with active recall flashcards, YouTube masterclasses, and diagnostic quizzes.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div
          className="p-4 border-t flex items-center justify-between gap-3"
          style={{
            background: isBright ? '#FAF8F5' : '#0F0A07',
            borderColor,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer border"
            style={{
              borderColor: isBright ? '#EAE0D5' : 'rgba(255,255,255,0.1)',
              color: textMuted,
            }}
          >
            Close Preview
          </button>

          {ctaMode === 'login' ? (
            <Link
              href={`/login?track=${encodeURIComponent(course.id)}`}
              onClick={onClose}
              className="flex-1 max-w-xs py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md text-center transition-all"
            >
              Sign In to Start Track →
            </Link>
          ) : ctaMode === 'dashboard' ? (
            <Link
              href="/dashboard/courses"
              onClick={onClose}
              className="flex-1 max-w-xs py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-md text-center transition-all"
            >
              View in Courses Hub →
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onEnroll) onEnroll(course.id);
                onClose();
              }}
              className={`flex-1 max-w-xs py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all cursor-pointer ${
                isEnrolled ? 'bg-emerald-600' : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600'
              }`}
            >
              {isEnrolled ? '✓ Enrolled (Open Course)' : 'Enroll in Track Now →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
