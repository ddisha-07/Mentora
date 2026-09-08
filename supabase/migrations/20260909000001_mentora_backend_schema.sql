-- ==============================================================================
-- MENTORA BACKEND DATABASE SCHEMA (PostgreSQL / Supabase)
-- 29 Tables with UUIDs, Strict Constraints, Indexes, RLS, Triggers, & Views
-- ==============================================================================

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean previous old tables if migrating
DROP TABLE IF EXISTS "user_answers" CASCADE;
DROP TABLE IF EXISTS "quiz_attempts" CASCADE;
DROP TABLE IF EXISTS "quiz_options" CASCADE;
DROP TABLE IF EXISTS "quiz_questions" CASCADE;
DROP TABLE IF EXISTS "quizzes" CASCADE;
DROP TABLE IF EXISTS "lesson_resources" CASCADE;
DROP TABLE IF EXISTS "lesson_progress" CASCADE;
DROP TABLE IF EXISTS "lessons" CASCADE;
DROP TABLE IF EXISTS "course_modules" CASCADE;
DROP TABLE IF EXISTS "user_courses" CASCADE;
DROP TABLE IF EXISTS "courses" CASCADE;
DROP TABLE IF EXISTS "recommendations" CASCADE;
DROP TABLE IF EXISTS "user_skills" CASCADE;
DROP TABLE IF EXISTS "skills" CASCADE;
DROP TABLE IF EXISTS "user_tasks" CASCADE;
DROP TABLE IF EXISTS "daily_tasks" CASCADE;
DROP TABLE IF EXISTS "user_achievements" CASCADE;
DROP TABLE IF EXISTS "achievements" CASCADE;
DROP TABLE IF EXISTS "xps" CASCADE;
DROP TABLE IF EXISTS "community_members" CASCADE;
DROP TABLE IF EXISTS "communities" CASCADE;
DROP TABLE IF EXISTS "schedule_events" CASCADE;
DROP TABLE IF EXISTS "chat_messages" CASCADE;
DROP TABLE IF EXISTS "chat_conversations" CASCADE;
DROP TABLE IF EXISTS "notifications" CASCADE;
DROP TABLE IF EXISTS "user_streaks" CASCADE;
DROP TABLE IF EXISTS "learning_events" CASCADE;
DROP TABLE IF EXISTS "media" CASCADE;
-- Also drop old Mentora legacy tables if present
DROP TABLE IF EXISTS "module_progress" CASCADE;
DROP TABLE IF EXISTS "modules" CASCADE;
DROP TABLE IF EXISTS "journeys" CASCADE;
DROP TABLE IF EXISTS "leaderboard_points" CASCADE;
DROP TABLE IF EXISTS "profiles" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- ------------------------------------------------------------------------------
-- 1. users
-- Stores the main user/employee account information.
-- ------------------------------------------------------------------------------
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password TEXT,
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin', 'mentor', 'manager')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. skills
-- Master list of skills available in Mentora.
-- ------------------------------------------------------------------------------
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    type VARCHAR(50) CHECK (type IS NULL OR type IN ('technical', 'soft_skill', 'leadership', 'domain', 'tool')),
    icon TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. user_skills
-- Maps users to their skills and proficiency levels (1-5).
-- ------------------------------------------------------------------------------
CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_skills_user_id_skill_id_unique UNIQUE (user_id, skill_id)
);

-- ------------------------------------------------------------------------------
-- 4. courses
-- Stores learning journeys/courses.
-- ------------------------------------------------------------------------------
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    thumbnail TEXT,
    category VARCHAR(100),
    difficulty VARCHAR(50) NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    xp_count INTEGER NOT NULL DEFAULT 0,
    estimated_time INTEGER, -- duration in minutes
    daily_goal INTEGER,     -- minutes per day
    tags JSONB DEFAULT '[]'::jsonb
);

-- ------------------------------------------------------------------------------
-- 5. course_modules
-- Represents modules/stages inside a course.
-- ------------------------------------------------------------------------------
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    estimated_time INTEGER, -- duration in minutes
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. lessons
-- Represents individual learning activities inside modules.
-- ------------------------------------------------------------------------------
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('video', 'article', 'quiz', 'flashcard', 'assignment', 'case_study', 'interactive', 'assessment')),
    display_order INTEGER NOT NULL DEFAULT 1,
    xp INTEGER NOT NULL DEFAULT 0,
    estimated_time INTEGER, -- duration in minutes
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. user_courses
-- Tracks courses assigned/enrolled to users.
-- ------------------------------------------------------------------------------
CREATE TABLE user_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_accessed_at TIMESTAMPTZ,
    CONSTRAINT user_courses_user_id_course_id_unique UNIQUE (user_id, course_id)
);

-- ------------------------------------------------------------------------------
-- 8. lesson_progress
-- Tracks individual lesson completion.
-- ------------------------------------------------------------------------------
CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
    progress DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress >= 0 AND progress <= 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ,
    CONSTRAINT lesson_progress_user_id_lesson_id_unique UNIQUE (user_id, lesson_id)
);

-- ------------------------------------------------------------------------------
-- 9. schedule_events
-- Stores scheduled learning events, meetings and mentor sessions.
-- ------------------------------------------------------------------------------
CREATE TABLE schedule_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    meeting_url TEXT,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. communities
-- Stores learning communities.
-- ------------------------------------------------------------------------------
CREATE TABLE communities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. community_members
-- Maps users to communities.
-- ------------------------------------------------------------------------------
CREATE TABLE community_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT community_members_community_id_user_id_unique UNIQUE (community_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 12. daily_tasks
-- Stores daily learning tasks.
-- ------------------------------------------------------------------------------
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    xp INTEGER NOT NULL DEFAULT 0,
    difficulty VARCHAR(50) CHECK (difficulty IS NULL OR difficulty IN ('easy', 'medium', 'hard')),
    due_date DATE,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. user_tasks
-- Tracks user completion of daily tasks.
-- ------------------------------------------------------------------------------
CREATE TABLE user_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'skipped')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_tasks_user_id_task_id_unique UNIQUE (user_id, task_id)
);

-- ------------------------------------------------------------------------------
-- 14. xps
-- Stores XP transactions (audit log; calculate total XP with SUM(points)).
-- ------------------------------------------------------------------------------
CREATE TABLE xps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    source VARCHAR(50) NOT NULL CHECK (source IN ('lesson', 'course', 'quiz', 'task', 'achievement', 'bonus')),
    ref_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. achievements
-- Master list of achievements/badges.
-- ------------------------------------------------------------------------------
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon TEXT,
    criteria JSONB NOT NULL DEFAULT '{}'::jsonb,
    points INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. user_achievements
-- Tracks achievements earned by users.
-- ------------------------------------------------------------------------------
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_achievements_user_id_achievement_id_unique UNIQUE (user_id, achievement_id)
);

-- ------------------------------------------------------------------------------
-- 17. media
-- Stores uploaded files and media.
-- ------------------------------------------------------------------------------
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE SET NULL,
    filename VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(100),
    file_size BIGINT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 18. lesson_resources
-- Stores resources attached to lessons.
-- ------------------------------------------------------------------------------
CREATE TABLE lesson_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(50) NOT NULL CHECK (resource_type IN ('pdf', 'video', 'article', 'website', 'document', 'cheat_sheet', 'revision_notes', 'glossary')),
    resource_url TEXT,
    media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 19. quizzes
-- Stores quiz information.
-- ------------------------------------------------------------------------------
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    passing_score INTEGER NOT NULL DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 20. quiz_questions
-- Stores quiz questions.
-- ------------------------------------------------------------------------------
CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL DEFAULT 'mcq',
    points INTEGER NOT NULL DEFAULT 1,
    display_order INTEGER NOT NULL DEFAULT 1
);

-- ------------------------------------------------------------------------------
-- 21. quiz_options
-- Stores possible answers.
-- ------------------------------------------------------------------------------
CREATE TABLE quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 1
);

-- ------------------------------------------------------------------------------
-- 22. quiz_attempts
-- Stores user quiz attempts.
-- ------------------------------------------------------------------------------
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    score DECIMAL(5,2) NOT NULL DEFAULT 0.00,
    passed BOOLEAN NOT NULL DEFAULT FALSE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- ------------------------------------------------------------------------------
-- 23. user_answers
-- Stores answers submitted by users.
-- ------------------------------------------------------------------------------
CREATE TABLE user_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES quiz_options(id) ON DELETE SET NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT user_answers_attempt_id_question_id_unique UNIQUE (attempt_id, question_id)
);

-- ------------------------------------------------------------------------------
-- 24. recommendations
-- Stores personalized learning recommendations.
-- ------------------------------------------------------------------------------
CREATE TABLE recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
    reason TEXT,
    score DECIMAL(5,2),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'viewed', 'accepted', 'dismissed', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 25. chat_conversations
-- Stores AI chatbot conversations.
-- ------------------------------------------------------------------------------
CREATE TABLE chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 26. chat_messages
-- Stores chatbot messages.
-- ------------------------------------------------------------------------------
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 27. notifications
-- Stores user notifications.
-- ------------------------------------------------------------------------------
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 28. user_streaks
-- Tracks learning streaks.
-- ------------------------------------------------------------------------------
CREATE TABLE user_streaks (
    user_id UUID PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 29. learning_events
-- Stores learning activity events for analytics.
-- ------------------------------------------------------------------------------
CREATE TABLE learning_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES (Foreign Keys & High-Frequency Query Columns)
-- ==============================================================================

-- users
CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_status ON users (status);

-- skills & user_skills
CREATE INDEX idx_skills_name ON skills (name);
CREATE INDEX idx_skills_type ON skills (type);
CREATE INDEX idx_user_skills_user_id ON user_skills (user_id);
CREATE INDEX idx_user_skills_skill_id ON user_skills (skill_id);

-- courses & modules & lessons
CREATE INDEX idx_courses_status ON courses (status);
CREATE INDEX idx_courses_created_by ON courses (created_by);
CREATE INDEX idx_courses_category ON courses (category);
CREATE INDEX idx_course_modules_course_id ON course_modules (course_id);
CREATE INDEX idx_course_modules_order ON course_modules (course_id, display_order);
CREATE INDEX idx_lessons_module_id ON lessons (module_id);
CREATE INDEX idx_lessons_order ON lessons (module_id, display_order);
CREATE INDEX idx_lesson_resources_lesson_id ON lesson_resources (lesson_id);

-- user course & lesson progress
CREATE INDEX idx_user_courses_user_id ON user_courses (user_id);
CREATE INDEX idx_user_courses_course_id ON user_courses (course_id);
CREATE INDEX idx_user_courses_status ON user_courses (status);
CREATE INDEX idx_lesson_progress_user_id ON lesson_progress (user_id);
CREATE INDEX idx_lesson_progress_lesson_id ON lesson_progress (lesson_id);
CREATE INDEX idx_lesson_progress_status ON lesson_progress (status);

-- schedule & communities
CREATE INDEX idx_schedule_events_created_by ON schedule_events (created_by);
CREATE INDEX idx_schedule_events_mentor_id ON schedule_events (mentor_id);
CREATE INDEX idx_schedule_events_course_id ON schedule_events (course_id);
CREATE INDEX idx_schedule_events_time ON schedule_events (start_time, end_time);
CREATE INDEX idx_communities_created_by ON communities (created_by);
CREATE INDEX idx_community_members_community_id ON community_members (community_id);
CREATE INDEX idx_community_members_user_id ON community_members (user_id);

-- daily tasks & gamification
CREATE INDEX idx_daily_tasks_created_by ON daily_tasks (created_by);
CREATE INDEX idx_daily_tasks_due_date ON daily_tasks (due_date);
CREATE INDEX idx_user_tasks_user_id ON user_tasks (user_id);
CREATE INDEX idx_user_tasks_task_id ON user_tasks (task_id);
CREATE INDEX idx_xps_user_id ON xps (user_id);
CREATE INDEX idx_xps_source ON xps (source);
CREATE INDEX idx_achievements_status ON achievements (status);
CREATE INDEX idx_user_achievements_user_id ON user_achievements (user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements (achievement_id);

-- quizzes & attempts
CREATE INDEX idx_quizzes_lesson_id ON quizzes (lesson_id);
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions (quiz_id);
CREATE INDEX idx_quiz_options_question_id ON quiz_options (question_id);
CREATE INDEX idx_quiz_attempts_quiz_id ON quiz_attempts (quiz_id);
CREATE INDEX idx_quiz_attempts_user_id ON quiz_attempts (user_id);
CREATE INDEX idx_user_answers_attempt_id ON user_answers (attempt_id);
CREATE INDEX idx_user_answers_question_id ON user_answers (question_id);

-- recommendations & chat & notifications & analytics
CREATE INDEX idx_recommendations_user_id ON recommendations (user_id);
CREATE INDEX idx_recommendations_course_id ON recommendations (course_id);
CREATE INDEX idx_recommendations_skill_id ON recommendations (skill_id);
CREATE INDEX idx_chat_conversations_user_id ON chat_conversations (user_id);
CREATE INDEX idx_chat_messages_conversation_id ON chat_messages (conversation_id);
CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_unread ON notifications (user_id) WHERE is_read = FALSE;
CREATE INDEX idx_learning_events_user_id ON learning_events (user_id);
CREATE INDEX idx_learning_events_type ON learning_events (event_type);
CREATE INDEX idx_media_user_id ON media (user_id);

-- ==============================================================================
-- DATABASE TRIGGERS (Auto-update updated_at)
-- ==============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_skills_updated_at
BEFORE UPDATE ON user_skills
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_chat_conversations_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_user_streaks_updated_at
BEFORE UPDATE ON user_streaks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================================================
-- VIEWS FOR DYNAMICALLY CALCULATED METRICS
-- ==============================================================================

-- 1. Course Stats View: calculates modules, lessons, enrolled students, and avg progress
CREATE OR REPLACE VIEW v_course_stats WITH (security_invoker = true) AS
SELECT 
    c.id AS course_id,
    c.title,
    c.difficulty,
    c.status,
    c.xp_count,
    COUNT(DISTINCT cm.id)::int AS modules_count,
    COUNT(DISTINCT l.id)::int AS lessons_count,
    COUNT(DISTINCT uc.user_id)::int AS students_enrolled,
    COALESCE(ROUND(AVG(uc.progress), 2), 0.00)::numeric AS average_progress
FROM courses c
LEFT JOIN course_modules cm ON cm.course_id = c.id
LEFT JOIN lessons l ON l.module_id = cm.id
LEFT JOIN user_courses uc ON uc.course_id = c.id
GROUP BY c.id, c.title, c.difficulty, c.status, c.xp_count;

-- 2. Community Stats View: calculates active members count
CREATE OR REPLACE VIEW v_community_stats WITH (security_invoker = true) AS
SELECT 
    com.id AS community_id,
    com.name,
    com.status,
    COUNT(cm.user_id)::int AS members_count
FROM communities com
LEFT JOIN community_members cm ON cm.community_id = com.id
GROUP BY com.id, com.name, com.status;

-- 3. Consolidated Dashboard Metrics RPC Function (Single roundtrip for frontend)
CREATE OR REPLACE FUNCTION get_user_dashboard_metrics(target_user_id UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user_id', target_user_id,
        'total_xp', COALESCE((SELECT SUM(points) FROM xps WHERE user_id = target_user_id), 0),
        'current_streak', COALESCE((SELECT current_streak FROM user_streaks WHERE user_id = target_user_id), 0),
        'longest_streak', COALESCE((SELECT longest_streak FROM user_streaks WHERE user_id = target_user_id), 0),
        'courses_completed', COALESCE((SELECT COUNT(*) FROM user_courses WHERE user_id = target_user_id AND status = 'completed'), 0),
        'courses_in_progress', COALESCE((SELECT COUNT(*) FROM user_courses WHERE user_id = target_user_id AND status = 'in_progress'), 0),
        'skills_count', COALESCE((SELECT COUNT(*) FROM user_skills WHERE user_id = target_user_id), 0),
        'quiz_average', COALESCE((SELECT ROUND(AVG(score), 2) FROM quiz_attempts WHERE user_id = target_user_id), 0.00),
        'achievements_count', COALESCE((SELECT COUNT(*) FROM user_achievements WHERE user_id = target_user_id), 0),
        'unread_notifications', COALESCE((SELECT COUNT(*) FROM notifications WHERE user_id = target_user_id AND is_read = FALSE), 0)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all 29 tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE xps ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_events ENABLE ROW LEVEL SECURITY;

-- 1. users
CREATE POLICY users_select_all ON users FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY users_update_own ON users FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);

-- 2. skills (public catalog)
CREATE POLICY skills_select_all ON skills FOR SELECT TO authenticated USING (TRUE);

-- 3. user_skills (user-owned)
CREATE POLICY user_skills_select_own ON user_skills FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY user_skills_insert_own ON user_skills FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY user_skills_update_own ON user_skills FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY user_skills_delete_own ON user_skills FOR DELETE TO authenticated 
    USING ((select auth.uid()) = user_id);

-- 4. courses, course_modules, lessons, lesson_resources (published readable by authenticated)
CREATE POLICY courses_select_published ON courses FOR SELECT TO authenticated 
    USING (status = 'published' OR (select auth.uid()) = created_by);
CREATE POLICY modules_select_all ON course_modules FOR SELECT TO authenticated 
    USING (status = 'active');
CREATE POLICY lessons_select_all ON lessons FOR SELECT TO authenticated 
    USING (status = 'active');
CREATE POLICY lesson_resources_select_all ON lesson_resources FOR SELECT TO authenticated 
    USING (TRUE);

-- 5. user_courses & lesson_progress (user-owned)
CREATE POLICY user_courses_select_own ON user_courses FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY user_courses_insert_own ON user_courses FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY user_courses_update_own ON user_courses FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY lesson_progress_select_own ON lesson_progress FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY lesson_progress_insert_own ON lesson_progress FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY lesson_progress_update_own ON lesson_progress FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);

-- 6. schedule_events (creator, mentor, or participants)
CREATE POLICY schedule_events_select ON schedule_events FOR SELECT TO authenticated 
    USING (TRUE);
CREATE POLICY schedule_events_insert ON schedule_events FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = created_by);
CREATE POLICY schedule_events_update ON schedule_events FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = created_by OR (select auth.uid()) = mentor_id);

-- 7. communities & community_members
CREATE POLICY communities_select ON communities FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY community_members_select ON community_members FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY community_members_join ON community_members FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY community_members_leave ON community_members FOR DELETE TO authenticated 
    USING ((select auth.uid()) = user_id);

-- 8. daily_tasks & user_tasks
CREATE POLICY daily_tasks_select ON daily_tasks FOR SELECT TO authenticated USING (status = 'active');
CREATE POLICY user_tasks_select_own ON user_tasks FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY user_tasks_insert_own ON user_tasks FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY user_tasks_update_own ON user_tasks FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);

-- 9. xps & achievements & user_achievements
-- Read-only for users to prevent tampering with gamification metrics
CREATE POLICY xps_select_own ON xps FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY achievements_select_all ON achievements FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY user_achievements_select_own ON user_achievements FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);

-- 10. media
CREATE POLICY media_select_own ON media FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id OR user_id IS NULL);
CREATE POLICY media_insert_own ON media FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);

-- 11. quizzes, questions, options, attempts, answers
CREATE POLICY quizzes_select ON quizzes FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY quiz_questions_select ON quiz_questions FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY quiz_options_select ON quiz_options FOR SELECT TO authenticated USING (TRUE);
CREATE POLICY quiz_attempts_select_own ON quiz_attempts FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY quiz_attempts_insert_own ON quiz_attempts FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY user_answers_select_own ON user_answers FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM quiz_attempts qa 
        WHERE qa.id = user_answers.attempt_id AND qa.user_id = (select auth.uid())
    ));
CREATE POLICY user_answers_insert_own ON user_answers FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (
        SELECT 1 FROM quiz_attempts qa 
        WHERE qa.id = user_answers.attempt_id AND qa.user_id = (select auth.uid())
    ));

-- 12. recommendations, chat, notifications, streaks, analytics
CREATE POLICY recommendations_select_own ON recommendations FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY recommendations_update_own ON recommendations FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id);

CREATE POLICY chat_conversations_own ON chat_conversations FOR ALL TO authenticated 
    USING ((select auth.uid()) = user_id) 
    WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY chat_messages_own ON chat_messages FOR ALL TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM chat_conversations cc 
        WHERE cc.id = chat_messages.conversation_id AND cc.user_id = (select auth.uid())
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM chat_conversations cc 
        WHERE cc.id = chat_messages.conversation_id AND cc.user_id = (select auth.uid())
    ));

CREATE POLICY notifications_select_own ON notifications FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY notifications_update_own ON notifications FOR UPDATE TO authenticated 
    USING ((select auth.uid()) = user_id);

CREATE POLICY user_streaks_select_own ON user_streaks FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);

CREATE POLICY learning_events_select_own ON learning_events FOR SELECT TO authenticated 
    USING ((select auth.uid()) = user_id);
CREATE POLICY learning_events_insert_own ON learning_events FOR INSERT TO authenticated 
    WITH CHECK ((select auth.uid()) = user_id);

-- ==============================================================================
-- SUPABASE AUTH SYNCHRONIZATION TRIGGER
-- Automatically mirrors any newly signed-up Supabase Auth user into public.users
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (user_id, email, name, role, status)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_app_meta_data->>'role', 'employee'),
        'active'
    )
    ON CONFLICT (email) DO UPDATE 
    SET user_id = EXCLUDED.user_id,
        updated_at = NOW();

    -- Also initialize an empty streak record
    INSERT INTO public.user_streaks (user_id, current_streak, longest_streak)
    VALUES (NEW.id, 0, 0)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to auth.users if auth schema is accessible
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'auth' AND table_name = 'users'
    ) THEN
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();
    END IF;
END $$;
