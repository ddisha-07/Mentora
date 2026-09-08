import {
  bigint,
  boolean,
  date,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ==============================================================================
// 1. users
// ==============================================================================
export const users = pgTable('users', {
  userId: uuid('user_id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  password: text('password'),
  avatarUrl: text('avatar_url'),
  bio: text('bio'),
  role: varchar('role', { length: 50 }).notNull().default('employee'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 2. skills
// ==============================================================================
export const skills = pgTable('skills', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  type: varchar('type', { length: 50 }),
  icon: text('icon'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 3. user_skills
// ==============================================================================
export const userSkills = pgTable(
  'user_skills',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    skillId: uuid('skill_id')
      .notNull()
      .references(() => skills.id, { onDelete: 'cascade' }),
    level: integer('level').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('user_skills_user_id_skill_id_unique').on(table.userId, table.skillId),
  ]
);

// ==============================================================================
// 4. courses
// ==============================================================================
export const courses = pgTable('courses', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  thumbnail: text('thumbnail'),
  category: varchar('category', { length: 100 }),
  difficulty: varchar('difficulty', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdBy: uuid('created_by').references(() => users.userId, { onDelete: 'set null' }),
  xpCount: integer('xp_count').notNull().default(0),
  estimatedTime: integer('estimated_time'),
  dailyGoal: integer('daily_goal'),
  tags: jsonb('tags').$type<string[]>().default([]),
});

// ==============================================================================
// 5. course_modules
// ==============================================================================
export const courseModules = pgTable('course_modules', {
  id: uuid('id').defaultRandom().primaryKey(),
  courseId: uuid('course_id')
    .notNull()
    .references(() => courses.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  displayOrder: integer('display_order').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  estimatedTime: integer('estimated_time'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 6. lessons
// ==============================================================================
export const lessons = pgTable('lessons', {
  id: uuid('id').defaultRandom().primaryKey(),
  moduleId: uuid('module_id')
    .notNull()
    .references(() => courseModules.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  content: text('content'),
  type: varchar('type', { length: 50 }).notNull(),
  displayOrder: integer('display_order').notNull().default(1),
  xp: integer('xp').notNull().default(0),
  estimatedTime: integer('estimated_time'),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 7. user_courses
// ==============================================================================
export const userCourses = pgTable(
  'user_courses',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    courseId: uuid('course_id')
      .notNull()
      .references(() => courses.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 50 }).notNull().default('not_started'),
    progress: decimal('progress', { precision: 5, scale: 2 }).notNull().default('0.00'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    enrolledAt: timestamp('enrolled_at', { withTimezone: true }).defaultNow().notNull(),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  },
  (table) => [
    unique('user_courses_user_id_course_id_unique').on(table.userId, table.courseId),
  ]
);

// ==============================================================================
// 8. lesson_progress
// ==============================================================================
export const lessonProgress = pgTable(
  'lesson_progress',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    lessonId: uuid('lesson_id')
      .notNull()
      .references(() => lessons.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 50 }).notNull().default('not_started'),
    progress: decimal('progress', { precision: 5, scale: 2 }).notNull().default('0.00'),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    lastAccessedAt: timestamp('last_accessed_at', { withTimezone: true }),
  },
  (table) => [
    unique('lesson_progress_user_id_lesson_id_unique').on(table.userId, table.lessonId),
  ]
);

// ==============================================================================
// 9. schedule_events
// ==============================================================================
export const scheduleEvents = pgTable('schedule_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }).notNull(),
  endTime: timestamp('end_time', { withTimezone: true }).notNull(),
  meetingUrl: text('meeting_url'),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'set null' }),
  createdBy: uuid('created_by')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  mentorId: uuid('mentor_id').references(() => users.userId, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('scheduled'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 10. communities
// ==============================================================================
export const communities = pgTable('communities', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  createdBy: uuid('created_by').references(() => users.userId, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 11. community_members
// ==============================================================================
export const communityMembers = pgTable(
  'community_members',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    communityId: uuid('community_id')
      .notNull()
      .references(() => communities.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    role: varchar('role', { length: 50 }).notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('community_members_community_id_user_id_unique').on(table.communityId, table.userId),
  ]
);

// ==============================================================================
// 12. daily_tasks
// ==============================================================================
export const dailyTasks = pgTable('daily_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  xp: integer('xp').notNull().default(0),
  difficulty: varchar('difficulty', { length: 50 }),
  dueDate: date('due_date'),
  createdBy: uuid('created_by').references(() => users.userId, { onDelete: 'set null' }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 13. user_tasks
// ==============================================================================
export const userTasks = pgTable(
  'user_tasks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    taskId: uuid('task_id')
      .notNull()
      .references(() => dailyTasks.id, { onDelete: 'cascade' }),
    status: varchar('status', { length: 50 }).notNull().default('pending'),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('user_tasks_user_id_task_id_unique').on(table.userId, table.taskId),
  ]
);

// ==============================================================================
// 14. xps
// ==============================================================================
export const xps = pgTable('xps', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  points: integer('points').notNull(),
  source: varchar('source', { length: 50 }).notNull(),
  refId: uuid('ref_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 15. achievements
// ==============================================================================
export const achievements = pgTable('achievements', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  icon: text('icon'),
  criteria: jsonb('criteria').$type<Record<string, any>>().notNull().default({}),
  points: integer('points').notNull().default(0),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 16. user_achievements
// ==============================================================================
export const userAchievements = pgTable(
  'user_achievements',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.userId, { onDelete: 'cascade' }),
    achievementId: uuid('achievement_id')
      .notNull()
      .references(() => achievements.id, { onDelete: 'cascade' }),
    earnedAt: timestamp('earned_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('user_achievements_user_id_achievement_id_unique').on(table.userId, table.achievementId),
  ]
);

// ==============================================================================
// 17. media
// ==============================================================================
export const media = pgTable('media', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.userId, { onDelete: 'set null' }),
  filename: varchar('filename', { length: 255 }).notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: varchar('file_type', { length: 100 }),
  fileSize: bigint('file_size', { mode: 'number' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 18. lesson_resources
// ==============================================================================
export const lessonResources = pgTable('lesson_resources', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonId: uuid('lesson_id')
    .notNull()
    .references(() => lessons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  resourceType: varchar('resource_type', { length: 50 }).notNull(),
  resourceUrl: text('resource_url'),
  mediaId: uuid('media_id').references(() => media.id, { onDelete: 'set null' }),
  displayOrder: integer('display_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 19. quizzes
// ==============================================================================
export const quizzes = pgTable('quizzes', {
  id: uuid('id').defaultRandom().primaryKey(),
  lessonId: uuid('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  passingScore: integer('passing_score').notNull().default(70),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 20. quiz_questions
// ==============================================================================
export const quizQuestions = pgTable('quiz_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  question: text('question').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull().default('mcq'),
  points: integer('points').notNull().default(1),
  displayOrder: integer('display_order').notNull().default(1),
});

// ==============================================================================
// 21. quiz_options
// ==============================================================================
export const quizOptions = pgTable('quiz_options', {
  id: uuid('id').defaultRandom().primaryKey(),
  questionId: uuid('question_id')
    .notNull()
    .references(() => quizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text').notNull(),
  isCorrect: boolean('is_correct').notNull().default(false),
  displayOrder: integer('display_order').notNull().default(1),
});

// ==============================================================================
// 22. quiz_attempts
// ==============================================================================
export const quizAttempts = pgTable('quiz_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  quizId: uuid('quiz_id')
    .notNull()
    .references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  score: decimal('score', { precision: 5, scale: 2 }).notNull().default('0.00'),
  passed: boolean('passed').notNull().default(false),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
});

// ==============================================================================
// 23. user_answers
// ==============================================================================
export const userAnswers = pgTable(
  'user_answers',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    attemptId: uuid('attempt_id')
      .notNull()
      .references(() => quizAttempts.id, { onDelete: 'cascade' }),
    questionId: uuid('question_id')
      .notNull()
      .references(() => quizQuestions.id, { onDelete: 'cascade' }),
    selectedOptionId: uuid('selected_option_id').references(() => quizOptions.id, { onDelete: 'set null' }),
    isCorrect: boolean('is_correct').notNull().default(false),
    answeredAt: timestamp('answered_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique('user_answers_attempt_id_question_id_unique').on(table.attemptId, table.questionId),
  ]
);

// ==============================================================================
// 24. recommendations
// ==============================================================================
export const recommendations = pgTable('recommendations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  courseId: uuid('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  skillId: uuid('skill_id').references(() => skills.id, { onDelete: 'cascade' }),
  reason: text('reason'),
  score: decimal('score', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 50 }).notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 25. chat_conversations
// ==============================================================================
export const chatConversations = pgTable('chat_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 26. chat_messages
// ==============================================================================
export const chatMessages = pgTable('chat_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => chatConversations.id, { onDelete: 'cascade' }),
  sender: varchar('sender', { length: 50 }).notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 27. notifications
// ==============================================================================
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  type: varchar('type', { length: 50 }),
  isRead: boolean('is_read').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 28. user_streaks
// ==============================================================================
export const userStreaks = pgTable('user_streaks', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.userId, { onDelete: 'cascade' }),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActivityDate: date('last_activity_date'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// 29. learning_events
// ==============================================================================
export const learningEvents = pgTable('learning_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.userId, { onDelete: 'cascade' }),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 50 }),
  entityId: uuid('entity_id'),
  metadata: jsonb('metadata').$type<Record<string, any>>().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ==============================================================================
// RELATIONS
// ==============================================================================
export const usersRelations = relations(users, ({ one, many }) => ({
  skills: many(userSkills),
  courses: many(userCourses),
  progress: many(lessonProgress),
  tasks: many(userTasks),
  xps: many(xps),
  achievements: many(userAchievements),
  quizAttempts: many(quizAttempts),
  recommendations: many(recommendations),
  chatConversations: many(chatConversations),
  notifications: many(notifications),
  streak: one(userStreaks, {
    fields: [users.userId],
    references: [userStreaks.userId],
  }),
  events: many(learningEvents),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  creator: one(users, {
    fields: [courses.createdBy],
    references: [users.userId],
  }),
  modules: many(courseModules),
  enrolledUsers: many(userCourses),
}));

export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  resources: many(lessonResources),
  quizzes: many(quizzes),
  progress: many(lessonProgress),
}));

export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  options: many(quizOptions),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one, many }) => ({
  user: one(users, {
    fields: [chatConversations.userId],
    references: [users.userId],
  }),
  messages: many(chatMessages),
}));

export const communitiesRelations = relations(communities, ({ one, many }) => ({
  creator: one(users, {
    fields: [communities.createdBy],
    references: [users.userId],
  }),
  members: many(communityMembers),
}));

// Type exports
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseModule = typeof courseModules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Quiz = typeof quizzes.$inferSelect;
export type UserStreak = typeof userStreaks.$inferSelect;
export type XpTransaction = typeof xps.$inferSelect;
