-- TeachFlow Database Schema for Supabase PostgreSQL
-- Run this in Supabase SQL Editor

-- 1. User Profiles (extends Supabase Auth)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Processes (chương trình học)
CREATE TABLE IF NOT EXISTS processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES user_profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Lessons (bài học trong process)
CREATE TABLE IF NOT EXISTS lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('website', 'pdf')),
    content_url TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Student-Process assignments
CREATE TABLE IF NOT EXISTS student_processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES user_profiles(id),
    process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, process_id)
);

-- 5. Lesson Completions (theo dõi hoàn thành)
CREATE TABLE IF NOT EXISTS lesson_completions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES user_profiles(id),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, lesson_id)
);

-- 6. Lesson Notes (feedback/ghi chú)
CREATE TABLE IF NOT EXISTS lesson_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES user_profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_processes_teacher_id ON processes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lessons_process_id ON lessons(process_id);
CREATE INDEX IF NOT EXISTS idx_student_processes_student_id ON student_processes(student_id);
CREATE INDEX IF NOT EXISTS idx_student_processes_process_id ON student_processes(process_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_student_id ON lesson_completions(student_id);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_lesson_id ON lesson_completions(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_notes_lesson_id ON lesson_notes(lesson_id);

-- Row Level Security (RLS) policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_notes ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is a teacher without triggering RLS recursion
CREATE OR REPLACE FUNCTION is_teacher()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid() AND role = 'teacher'
  );
$$;

-- Allow users to read their own profile (or teachers to view all profiles)
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id OR is_teacher());

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Allow inserting profiles (for registration)
CREATE POLICY "Users can insert profiles" ON user_profiles
    FOR INSERT WITH CHECK (true);

-- Allow teachers to manage their own processes
CREATE POLICY "Teachers can manage own processes" ON processes
    FOR ALL USING (teacher_id = auth.uid());

-- Allow students to view assigned processes
CREATE POLICY "Students can view assigned processes" ON processes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_processes sp
            WHERE sp.process_id = id AND sp.student_id = auth.uid()
        )
    );

-- Allow teachers to manage lessons in their processes
CREATE POLICY "Teachers can manage lessons" ON lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM processes p
            WHERE p.id = process_id AND p.teacher_id = auth.uid()
        )
    );

-- Allow students to view lessons in assigned processes
CREATE POLICY "Students can view assigned lessons" ON lessons
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM student_processes sp
            WHERE sp.process_id = process_id AND sp.student_id = auth.uid()
        )
    );

-- Allow teachers to assign students to processes
CREATE POLICY "Teachers can manage student processes" ON student_processes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM processes p
            WHERE p.id = process_id AND p.teacher_id = auth.uid()
        )
    );

-- Allow students to view their own assignments
CREATE POLICY "Students can view own assignments" ON student_processes
    FOR SELECT USING (student_id = auth.uid());

-- Allow students to manage their own completions
CREATE POLICY "Students can manage own completions" ON lesson_completions
    FOR ALL USING (student_id = auth.uid());

-- Allow teachers to view completions for their lessons
CREATE POLICY "Teachers can view completions for own lessons" ON lesson_completions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lessons l
            JOIN processes p ON p.id = l.process_id
            WHERE l.id = lesson_id AND p.teacher_id = auth.uid()
        )
    );

-- Allow teachers and students to manage notes for their lessons
CREATE POLICY "Teachers can manage notes for own lessons" ON lesson_notes
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM lessons l
            JOIN processes p ON p.id = l.process_id
            WHERE l.id = lesson_id AND p.teacher_id = auth.uid()
        )
    );

CREATE POLICY "Students can view notes for assigned lessons" ON lesson_notes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM lessons l
            JOIN student_processes sp ON sp.process_id = l.process_id
            WHERE l.id = lesson_id AND sp.student_id = auth.uid()
        )
    );
